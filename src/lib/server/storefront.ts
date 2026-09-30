import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { ensureSeed } from "./seed";
import { asJsonRow, parseSectionContent } from "@/lib/types";
import {
  isValidEmail,
  sanitizeSearchTerm,
  stockAvailability,
  type StockAvailability,
} from "@/lib/commerce-rules";
import type {
  CollectionCard,
  Faq,
  HomeSection,
  NavItem,
  Policy,
  ProductCard,
  SiteSettings,
  Storefront,
  Variant,
} from "@/lib/types";

/**
 * Public storefront reads.
 *
 * These are the only catalog functions reachable without a session, so they are
 * also the only place inventory could leak: variants expose a *semantic*
 * availability ("in" / "low" / "out") and never a raw `inventory_quantity`.
 * Exact quantities are operator data and are only returned by the studio API.
 */

/** Row shape shared by every product query in this module. */
type ProductRow = object;

function productFromRow(r: ProductRow, availability: StockAvailability = "out"): ProductCard {
  const row = asJsonRow(r);
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    description: row.description == null ? null : String(row.description),
    story: row.story == null ? null : String(row.story),
    priceCents: Number(row.price_cents ?? 0),
    status: String(row.status ?? "published"),
    featured: Boolean(row.featured),
    image: String(row.image_url ?? "/media/void-puffer.webp"),
    colorName: row.color_name == null ? null : String(row.color_name),
    colorHex: row.color_hex == null ? null : String(row.color_hex),
    fit: row.fit == null ? null : String(row.fit),
    material: row.material == null ? null : String(row.material),
    care: row.care == null ? null : String(row.care),
    seoTitle: row.seo_title == null ? null : String(row.seo_title),
    seoDescription: row.seo_description == null ? null : String(row.seo_description),
    availability,
  };
}

/**
 * Total sellable units per product, as a semantic availability.
 *
 * One aggregate query for the whole catalog rather than a per-product variant
 * read — the card grid would otherwise issue an N+1 that grows with the line.
 */
async function availabilityByProduct(sql: Sql): Promise<Map<string, StockAvailability>> {
  const rows = await sql<{ product_id: string; units: number }>`
    select product_id, coalesce(sum(inventory_quantity), 0)::int as units
    from product_variants
    where status = 'active'
    group by product_id
  `;
  const out = new Map<string, StockAvailability>();
  for (const row of rows) {
    out.set(String(row.product_id), stockAvailability(Number(row.units ?? 0)));
  }
  return out;
}

export const getStorefront = createServerFn({ method: "GET" }).handler(
  async (): Promise<Storefront> => {
    await ensureSeed();
    const sql = await getSql();

    // One round of parallel reads; nothing here depends on another result.
    const [settingsRows, navRows, sectionRows, productRows, collectionRows, faqRows, policyRows, availability] =
      await Promise.all([
        sql`select * from site_settings where id = 'default'`,
        sql`select * from navigation where visible = true order by location, sort_order`,
        sql`select * from homepage_sections where enabled = true order by sort_order`,
        sql`
          select p.*, m.url as image_url
          from products p
          left join media m on m.id = p.primary_media_id
          where p.status = 'published'
          order by p.featured desc, p.name
        `,
        sql`
          select c.*, m.url as cover_url
          from collections c
          left join media m on m.id = c.cover_media_id
          where c.visible = true
          order by c.sort_order
        `,
        sql`select * from faqs where published = true order by sort_order`,
        sql`select * from policies where published = true order by title`,
        availabilityByProduct(sql),
      ]);

    const s = asJsonRow(settingsRows[0] ?? {});
    const settings: SiteSettings = {
      id: "default",
      brandName: String(s.brand_name ?? "COUR"),
      tagline: s.tagline == null ? null : String(s.tagline),
      contactEmail: s.contact_email == null ? null : String(s.contact_email),
      currency: String(s.currency ?? "USD"),
      announcement: s.announcement == null ? null : String(s.announcement),
      announcementEnabled: Boolean(s.announcement_enabled),
      footerNote: s.footer_note == null ? null : String(s.footer_note),
      socialInstagram: s.social_instagram == null ? null : String(s.social_instagram),
      socialX: s.social_x == null ? null : String(s.social_x),
      shippingNote: s.shipping_note == null ? null : String(s.shipping_note),
      maintenanceMode: Boolean(s.maintenance_mode),
    };

    const navigation: NavItem[] = navRows.map((r) => {
      const row = asJsonRow(r);
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        href: String(row.href ?? "/"),
        location: row.location === "footer" ? "footer" : "header",
        sortOrder: Number(row.sort_order ?? 0),
        visible: true,
      };
    });

    const sections: HomeSection[] = sectionRows.map((r) => {
      const row = asJsonRow(r);
      const sectionKey = String(row.section_key ?? "");
      return {
        id: String(row.id ?? ""),
        sectionKey,
        title: row.title == null ? null : String(row.title),
        eyebrow: row.eyebrow == null ? null : String(row.eyebrow),
        body: row.body == null ? null : String(row.body),
        ctaLabel: row.cta_label == null ? null : String(row.cta_label),
        ctaHref: row.cta_href == null ? null : String(row.cta_href),
        enabled: true,
        sortOrder: Number(row.sort_order ?? 0),
        content: parseSectionContent(row.content == null ? "{}" : String(row.content), sectionKey),
      };
    });

    const products: ProductCard[] = productRows.map((row) =>
      productFromRow(row, availability.get(String(asJsonRow(row).id ?? "")) ?? "out"),
    );

    const collections: CollectionCard[] = collectionRows.map((r) => {
      const row = asJsonRow(r);
      return {
        id: String(row.id ?? ""),
        slug: String(row.slug ?? ""),
        name: String(row.name ?? ""),
        description: row.description == null ? null : String(row.description),
        cover: row.cover_url == null ? null : String(row.cover_url),
        visible: true,
      };
    });

    const faqs: Faq[] = faqRows.map((r) => {
      const row = asJsonRow(r);
      return {
        id: String(row.id ?? ""),
        question: String(row.question ?? ""),
        answer: String(row.answer ?? ""),
        sortOrder: Number(row.sort_order ?? 0),
        published: true,
      };
    });

    const policies: Policy[] = policyRows.map((r) => {
      const row = asJsonRow(r);
      return {
        id: String(row.id ?? ""),
        slug: String(row.slug ?? ""),
        title: String(row.title ?? ""),
        body: String(row.body ?? ""),
        published: true,
      };
    });

    return { settings, navigation, sections, products, collections, faqs, policies };
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((slug: unknown) => (typeof slug === "string" ? slug.slice(0, 80) : ""))
  .handler(async ({ data: slug }) => {
    if (!slug) return null;
    await ensureSeed();
    const sql = await getSql();
    const productRows = await sql`
      select p.*, m.url as image_url
      from products p
      left join media m on m.id = p.primary_media_id
      where p.slug = ${slug} and p.status = 'published'
      limit 1
    `;
    const r = productRows[0];
    if (!r) return null;
    const product = productFromRow(r);
    const variantRows = await sql`
      select * from product_variants
      where product_id = ${product.id} and status = 'active'
      order by size
    `;
    // `inventory_quantity` is read here and deliberately NOT forwarded — a
    // variant carries an availability band only.
    const variants: Variant[] = variantRows.map((v) => {
      const row = asJsonRow(v);
      return {
        id: String(row.id ?? ""),
        productId: String(row.product_id ?? ""),
        sku: String(row.sku ?? ""),
        size: String(row.size ?? ""),
        priceOverrideCents:
          row.price_override_cents == null ? null : Number(row.price_override_cents),
        availability: stockAvailability(Number(row.inventory_quantity ?? 0)),
        status: String(row.status ?? "active"),
      };
    });
    const sizeRank: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
    variants.sort((a, b) => (sizeRank[a.size] ?? 99) - (sizeRank[b.size] ?? 99));
    const totalUnits = variants.reduce((n, v) => n + (v.availability === "out" ? 0 : 1), 0);
    return {
      product: { ...product, availability: stockAvailability(totalUnits) },
      variants,
    };
  });

export const getCollectionBySlug = createServerFn({ method: "GET" })
  .validator((slug: unknown) => (typeof slug === "string" ? slug.slice(0, 80) : ""))
  .handler(async ({ data: slug }) => {
    if (!slug) return null;
    await ensureSeed();
    const sql = await getSql();
    const cols = await sql`
      select c.*, m.url as cover_url
      from collections c
      left join media m on m.id = c.cover_media_id
      where c.slug = ${slug} and c.visible = true
      limit 1
    `;
    const c = cols[0];
    if (!c) return null;
    const row = asJsonRow(c);
    const [productRows, availability] = await Promise.all([
      sql`
        select p.*, m.url as image_url
        from products p
        join product_collections pc on pc.product_id = p.id
        left join media m on m.id = p.primary_media_id
        where pc.collection_id = ${String(row.id)} and p.status = 'published'
        order by p.name
      `,
      availabilityByProduct(sql),
    ]);
    return {
      collection: {
        id: String(row.id ?? ""),
        slug: String(row.slug ?? ""),
        name: String(row.name ?? ""),
        description: row.description == null ? null : String(row.description),
        cover: row.cover_url == null ? null : String(row.cover_url),
        visible: true,
      } satisfies CollectionCard,
      products: productRows.map((p) =>
        productFromRow(p, availability.get(String(asJsonRow(p).id ?? "")) ?? "out"),
      ),
    };
  });

/**
 * Canonical product search. The route calls this — there is no parallel
 * client-side filter, because two implementations is two behaviours to keep in
 * sync and only one of them was ever indexed.
 */
export const searchProducts = createServerFn({ method: "GET" })
  .validator((q: unknown) => (typeof q === "string" ? q.slice(0, 80) : ""))
  .handler(async ({ data: q }) => {
    await ensureSeed();
    const sql = await getSql();
    const term = sanitizeSearchTerm(q);
    if (!term) return [] as ProductCard[];
    const like = `%${term}%`;
    const [rows, availability] = await Promise.all([
      sql`
        select p.*, m.url as image_url
        from products p
        left join media m on m.id = p.primary_media_id
        where p.status = 'published'
          and (
            lower(p.name) like ${like}
            or lower(coalesce(p.description, '')) like ${like}
            or lower(coalesce(p.color_name, '')) like ${like}
            or lower(coalesce(p.material, '')) like ${like}
            or lower(coalesce(p.fit, '')) like ${like}
          )
        order by
          case when lower(p.name) like ${like} then 0 else 1 end,
          p.name
      `,
      availabilityByProduct(sql),
    ]);
    return rows.map((row) =>
      productFromRow(row, availability.get(String(asJsonRow(row).id ?? "")) ?? "out"),
    );
  });

// ── public inquiry / newsletter ─────────────────────────────────────────────

/**
 * In-process submission throttle.
 *
 * A public write endpoint with no session has to defend itself. The runtime is
 * a single Node process (and PGLite is embedded), so an in-memory window is
 * both sufficient and free; it also holds no visitor data beyond a counter
 * that expires.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissions = new Map<string, number[]>();

function throttle(key: string, now = Date.now()): boolean {
  const hits = (submissions.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    submissions.set(key, hits);
    return false;
  }
  hits.push(now);
  submissions.set(key, hits);
  // Opportunistic sweep so the map cannot grow without bound.
  if (submissions.size > 500) {
    for (const [k, v] of submissions) {
      if (!v.some((t) => now - t < WINDOW_MS)) submissions.delete(k);
    }
  }
  return true;
}

/** Only these kinds may be stored; anything else is normalized away. */
const INQUIRY_KINDS = ["newsletter", "contact"] as const;

export const submitInquiry = createServerFn({ method: "POST" })
  .validator(
    (input: unknown): { email: string; kind?: string; message?: string; company?: string } => {
      if (!input || typeof input !== "object") throw new Error("Email is required.");
      return input as { email: string; kind?: string; message?: string; company?: string };
    },
  )
  .handler(async ({ data }) => {
    // Honeypot: a field real visitors never see. A bot that fills it gets the
    // same success response and nothing is stored.
    if (typeof data.company === "string" && data.company.trim().length > 0) {
      return { ok: true };
    }

    const email = (typeof data.email === "string" ? data.email : "").trim().toLowerCase().slice(0, 180);
    if (!isValidEmail(email)) throw new Error("Enter a valid email address.");

    const kindInput = typeof data.kind === "string" ? data.kind.trim().toLowerCase() : "newsletter";
    const kind = (INQUIRY_KINDS as readonly string[]).includes(kindInput) ? kindInput : "newsletter";

    const rawMessage = typeof data.message === "string" ? data.message.trim() : "";
    if (kind === "contact" && rawMessage.length < 2) {
      throw new Error("Add a short message so the studio can reply.");
    }
    const message = rawMessage ? rawMessage.slice(0, 2000) : null;

    if (!throttle(email)) {
      throw new Error("That address has already been submitted recently. Try again shortly.");
    }

    await ensureSeed();
    const sql = await getSql();

    // The in-memory throttle is per process; this is the durable backstop, and
    // it also makes a repeat submission from a restarted process a no-op rather
    // than a second row.
    const recent = await sql`
      select id from inquiries
      where email = ${email} and kind = ${kind}
        and created_at > now() - interval '10 minutes'
      limit 1
    `;
    if (recent[0]) return { ok: true };

    const id = `inq_${crypto.randomUUID().slice(0, 10)}`;
    await sql`
      insert into inquiries (id, email, kind, message)
      values (${id}, ${email}, ${kind}, ${message})
    `;
    return { ok: true };
  });
