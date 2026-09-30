import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { ensureSeed } from "./seed";
import { asJsonRow, parseSectionContent } from "@/lib/types";
import { isValidEmail, sanitizeSearchTerm, stockAvailability } from "@/lib/commerce-rules";
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

function productFromRow(r: object): ProductCard {
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
  };
}

export const getStorefront = createServerFn({ method: "GET" }).handler(async (): Promise<Storefront> => {
  await ensureSeed();
  const sql = await getSql();

  const [settingsRows, navRows, sectionRows, productRows, collectionRows, faqRows, policyRows] = await Promise.all([
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
    return {
      id: String(row.id ?? ""),
      sectionKey: String(row.section_key ?? ""),
      title: row.title == null ? null : String(row.title),
      eyebrow: row.eyebrow == null ? null : String(row.eyebrow),
      body: row.body == null ? null : String(row.body),
      ctaLabel: row.cta_label == null ? null : String(row.cta_label),
      ctaHref: row.cta_href == null ? null : String(row.cta_href),
      enabled: true,
      sortOrder: Number(row.sort_order ?? 0),
      content: parseSectionContent(row.content == null ? "{}" : String(row.content)),
    };
  });

  const products: ProductCard[] = productRows.map(productFromRow);

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
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
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
    const variants: Variant[] = variantRows.map((v) => {
      const row = asJsonRow(v);
      return {
        id: String(row.id ?? ""),
        productId: String(row.product_id ?? ""),
        sku: String(row.sku ?? ""),
        size: String(row.size ?? ""),
        priceOverrideCents: row.price_override_cents == null ? null : Number(row.price_override_cents),
        availability: stockAvailability(Number(row.inventory_quantity ?? 0)),
        status: String(row.status ?? "active"),
      };
    });
    const sizeRank: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
    variants.sort((a, b) => (sizeRank[a.size] ?? 99) - (sizeRank[b.size] ?? 99));
    return { product, variants };
  });

export const getCollectionBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
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
    const productRows = await sql`
      select p.*, m.url as image_url
      from products p
      join product_collections pc on pc.product_id = p.id
      left join media m on m.id = p.primary_media_id
      where pc.collection_id = ${String(row.id)} and p.status = 'published'
      order by p.name
    `;
    return {
      collection: {
        id: String(row.id ?? ""),
        slug: String(row.slug ?? ""),
        name: String(row.name ?? ""),
        description: row.description == null ? null : String(row.description),
        cover: row.cover_url == null ? null : String(row.cover_url),
        visible: true,
      } satisfies CollectionCard,
      products: productRows.map(productFromRow),
    };
  });

export const searchProducts = createServerFn({ method: "GET" })
  .validator((q: string) => q)
  .handler(async ({ data: q }) => {
    await ensureSeed();
    const sql = await getSql();
    const term = sanitizeSearchTerm(q);
    if (!term) return [] as ProductCard[];
    const like = `%${term}%`;
    const rows = await sql`
      select p.*, m.url as image_url
      from products p
      left join media m on m.id = p.primary_media_id
      where p.status = 'published'
        and (
          lower(p.name) like ${like}
          or lower(coalesce(p.description, '')) like ${like}
          or lower(coalesce(p.color_name, '')) like ${like}
        )
      order by p.name
    `;
    return rows.map(productFromRow);
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: { email: string; kind?: string; message?: string }) => input)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new Error("Enter a valid email.");
    const kind = data.kind === "contact" ? "contact" : "newsletter";
    const message = (data.message ?? "").slice(0, 2000) || null;
    const sql = await getSql();
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
