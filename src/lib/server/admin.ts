import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed } from "./seed";
import { uid } from "@/lib/utils";
import { asJsonRow } from "@/lib/types";
import type { JsonRow, LowStockRow, RecentOrderRow } from "@/lib/types";
import { serializeSectionContent } from "@/lib/section-schema";
import {
  can,
  canTransitionOrder,
  clampInventory,
  isHexColor,
  isMediaKind,
  isProductStatus,
  isSafeInternalHref,
  isSafeMediaUrl,
  isSlug,
  isStaffRole,
  isValidEmail,
  isVariantStatus,
  NAV_LOCATIONS,
  STAFF_ROLES,
  type Perm,
  type StaffRole,
} from "@/lib/commerce-rules";

/**
 * Studio (admin) server functions.
 *
 * Authorization is per-operation: every handler declares the ONE permission it
 * needs, and the permission is checked against the caller's stored role before
 * anything else happens. Hiding a control in the UI is not authorization — each
 * of these is reachable directly over the network.
 *
 * The `customers` and `audit` permissions are deliberately narrower than
 * `content`: an editor who may fix FAQ copy has no business reading the inquiry
 * inbox or the audit trail.
 */

type Profile = { userId: string; role: string; displayName: string | null };

function httpError(message: string, status: number): Error {
  const err = new Error(message);
  (err as Error & { status?: number }).status = status;
  return err;
}

const forbidden = () => httpError("Forbidden", 403);
const invalid = (message: string) => httpError(message, 400);
const notFound = (message: string) => httpError(message, 404);

/** Trim + bound a client string. */
function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalText(value: unknown, max: number): string | null {
  const s = str(value, max);
  return s.length ? s : null;
}

async function getProfile(sql: Sql, userId: string): Promise<Profile | null> {
  const rows = await sql<{ user_id: string; role: string; display_name: string | null }>`
    select user_id, role, display_name from user_profiles where user_id = ${userId}
  `;
  const r = rows[0];
  return r ? { userId: r.user_id, role: r.role, displayName: r.display_name } : null;
}

/**
 * A validator that keeps the client-visible input type while still refusing a
 * non-object payload at runtime. TypeScript's type is a convenience for the
 * caller; this check is the actual boundary.
 */
function requireShape<T>(label: string) {
  return (input: T): T => {
    if (!input || typeof input !== "object") throw invalid(`${label} is required.`);
    return input;
  };
}

/** The single gate every privileged mutation passes through. */
async function requirePerm(userId: string, perm: Perm): Promise<Profile> {
  const sql = await getSql();
  const profile = await getProfile(sql, userId);
  if (!profile || !isStaffRole(profile.role) || !can(profile.role, perm)) {
    throw forbidden();
  }
  return profile;
}

async function audit(sql: Sql, userId: string, action: string, entity: string, entityId?: string) {
  await sql`
    insert into audit_log (id, user_id, action, entity, entity_id)
    values (${uid("aud")}, ${userId}, ${action}, ${entity}, ${entityId ?? null})
  `;
}

export const getAdminContext = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeed();
    const sql = await getSql();
    const owners = await sql<{ n: number }>`
      select count(*)::int as n from user_profiles where role in ('owner', 'admin')
    `;
    const profile = await getProfile(sql, context.userId);
    const staffRole = profile && isStaffRole(profile.role) ? profile.role : null;
    return {
      userId: context.userId,
      profile,
      needsClaim: Number(owners[0]?.n ?? 0) === 0,
      isStaff: Boolean(staffRole),
      role: staffRole,
      /** Which desk tabs this role may use at all. */
      permissions: {
        dashboard: Boolean(staffRole && can(staffRole, "orders")),
        products: Boolean(staffRole && can(staffRole, "catalog")),
        inventory: Boolean(staffRole && can(staffRole, "inventory")),
        orders: Boolean(staffRole && can(staffRole, "orders")),
        content: Boolean(staffRole && can(staffRole, "content")),
        media: Boolean(staffRole && can(staffRole, "media")),
        settings: Boolean(staffRole && can(staffRole, "settings")),
        customers: Boolean(staffRole && can(staffRole, "customers")),
        audit: Boolean(staffRole && can(staffRole, "audit")),
      },
    };
  });

/** Advisory-lock key for the owner claim. Any stable constant works. */
const CLAIM_OWNER_LOCK = 0x636f7572; // "cour"

/**
 * Claim the studio as its first owner.
 *
 * The check ("does an owner exist?") and the write have to be one atomic step:
 * two visitors hitting this at the same instant must not both become owner. A
 * transaction-scoped advisory lock serializes the two, and the partial unique
 * index `user_profiles_one_owner` is the backstop if that lock is ever
 * bypassed — so the operation is safe under any interleaving.
 */
export const claimOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      await withTransaction(async (sql) => {
        await sql`select pg_advisory_xact_lock(${CLAIM_OWNER_LOCK})`;
        const owners = await sql<{ n: number }>`
          select count(*)::int as n from user_profiles where role in ('owner', 'admin')
        `;
        if (Number(owners[0]?.n ?? 0) > 0) {
          throw httpError("The studio already has an owner.", 409);
        }
        await sql`
          insert into user_profiles (user_id, role, display_name)
          values (${context.userId}, 'owner', 'Owner')
          on conflict (user_id) do update
            set role = 'owner',
                display_name = coalesce(user_profiles.display_name, 'Owner')
        `;
        await audit(sql, context.userId, "claim_owner", "user_profiles", context.userId);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/user_profiles_one_owner|duplicate key/i.test(message)) {
        throw httpError("The studio already has an owner.", 409);
      }
      throw err;
    }
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // Revenue and customer email are order data, not general studio data.
    await requirePerm(context.userId, "orders");
    await ensureSeed();
    const sql = await getSql();
    const [orders, low, recent, products] = await Promise.all([
      sql<{ n: number; revenue: string | number | null }>`
        select count(*)::int as n, coalesce(sum(total_cents), 0) as revenue from orders
      `,
      sql`
        select v.sku, v.size, v.inventory_quantity, p.name
        from product_variants v
        join products p on p.id = v.product_id
        where v.inventory_quantity <= 3
        order by v.inventory_quantity asc
        limit 12
      `,
      sql`
        select id, email, status, total_cents, created_at from orders
        order by created_at desc limit 8
      `,
      sql<{ n: number }>`select count(*)::int as n from products`,
    ]);
    const lowStock: LowStockRow[] = low.map((row) => {
      const r = asJsonRow(row);
      return {
        sku: String(r.sku ?? ""),
        size: String(r.size ?? ""),
        inventoryQuantity: Number(r.inventory_quantity ?? 0),
        name: String(r.name ?? ""),
      };
    });
    const recentOrders: RecentOrderRow[] = recent.map((row) => {
      const r = asJsonRow(row);
      return {
        id: String(r.id ?? ""),
        email: r.email == null ? null : String(r.email),
        status: String(r.status ?? ""),
        totalCents: Number(r.total_cents ?? 0),
        createdAt: String(r.created_at ?? ""),
      };
    });
    return {
      orderCount: Number(orders[0]?.n ?? 0),
      revenueCents: Number(orders[0]?.revenue ?? 0),
      productCount: Number(products[0]?.n ?? 0),
      lowStock,
      recentOrders,
    };
  });

// ── catalog ─────────────────────────────────────────────────────────────────

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JsonRow[]> => {
    await requirePerm(context.userId, "catalog");
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql`
      select p.*, m.url as image_url
      from products p
      left join media m on m.id = p.primary_media_id
      order by p.name
    `;
    return rows.map((row) => asJsonRow(row));
  });

export const adminGetProduct = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: unknown) => str(id, 64))
  .handler(
    async ({ context, data: id }): Promise<{ product: JsonRow; variants: JsonRow[] } | null> => {
      await requirePerm(context.userId, "catalog");
      if (!id) return null;
      const sql = await getSql();
      const products = await sql`select * from products where id = ${id} limit 1`;
      const product = products[0];
      if (!product) return null;
      const variants = await sql`
        select * from product_variants where product_id = ${id} order by size
      `;
      return { product: asJsonRow(product), variants: variants.map((row) => asJsonRow(row)) };
    },
  );

type VariantInput = { id: string; inventoryQuantity: number; status: string };

type OrderStatusInput = { id: string; status: string };

type ProductInput = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  story?: string;
  priceCents: number;
  status: string;
  featured: boolean;
  colorName?: string;
  colorHex?: string;
  fit?: string;
  material?: string;
  care?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<ProductInput>("Product payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "catalog");

    const id = str(data.id, 64);
    if (!id) throw invalid("Product id is required.");
    const name = str(data.name, 120);
    if (!name) throw invalid("Product name is required.");
    const slug = str(data.slug, 80);
    if (!isSlug(slug)) {
      throw invalid("Slug must be lowercase words separated by single hyphens (2–80 characters).");
    }
    const price = Number(data.priceCents);
    if (!Number.isInteger(price) || price < 0) {
      throw invalid("Price must be a whole number of cents, zero or greater.");
    }
    if (!isProductStatus(data.status)) throw invalid("Unknown product status.");

    const colorHex = optionalText(data.colorHex, 7);
    if (colorHex && !isHexColor(colorHex)) {
      throw invalid("Color must be a #RRGGBB value.");
    }
    const colorName = optionalText(data.colorName, 60);
    const description = optionalText(data.description, 1000);
    const story = optionalText(data.story, 2000);
    const fit = optionalText(data.fit, 120);
    const material = optionalText(data.material, 240);
    const care = optionalText(data.care, 240);
    const seoTitle = optionalText(data.seoTitle, 120);
    const seoDescription = optionalText(data.seoDescription, 240);
    if (seoTitle && seoTitle.length > 120) throw invalid("SEO title is too long.");
    if (seoDescription && seoDescription.length > 240) throw invalid("SEO description is too long.");

    const sql = await getSql();
    try {
      const updated = await sql`
        update products set
          name = ${name},
          slug = ${slug},
          description = ${description},
          story = ${story},
          price_cents = ${price},
          status = ${data.status},
          featured = ${Boolean(data.featured)},
          color_name = ${colorName},
          color_hex = ${colorHex},
          fit = ${fit},
          material = ${material},
          care = ${care},
          seo_title = ${seoTitle},
          seo_description = ${seoDescription},
          updated_at = now()
        where id = ${id}
        returning id
      `;
      if (!updated[0]) throw notFound("Product not found.");
    } catch (err) {
      // Surface a slug collision as a field-level error instead of a 500 with a
      // raw driver message.
      const message = err instanceof Error ? err.message : String(err);
      if (/products_slug_key|duplicate key.*slug/i.test(message)) {
        throw httpError("Another product already uses that slug.", 409);
      }
      throw err;
    }
    await audit(sql, context.userId, "update_product", "products", id);
    return { ok: true };
  });

export const adminSaveVariantInventory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<VariantInput>("Variant payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "inventory");
    const id = str(data.id, 64);
    if (!id) throw invalid("Variant id is required.");
    if (!isVariantStatus(data.status)) throw invalid("Unknown variant status.");
    const supplied = Number(data.inventoryQuantity);
    if (!Number.isFinite(supplied)) throw invalid("Inventory must be a number.");
    const qty = clampInventory(supplied);

    const sql = await getSql();
    const updated = await sql`
      update product_variants
      set inventory_quantity = ${qty}, status = ${data.status}
      where id = ${id}
      returning id
    `;
    if (!updated[0]) throw notFound("Variant not found.");
    await audit(sql, context.userId, "update_inventory", "product_variants", id);
    return { ok: true };
  });

// ── orders ──────────────────────────────────────────────────────────────────

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JsonRow[]> => {
    await requirePerm(context.userId, "orders");
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql`
      select * from orders order by created_at desc limit 80
    `;
    return rows.map((row) => asJsonRow(row));
  });

export const adminSetOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<OrderStatusInput>("Order payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "orders");
    const id = str(data.id, 64);
    const next = str(data.status, 24);
    if (!id) throw invalid("Order id is required.");

    return withTransaction(async (sql) => {
      const rows = await sql`select status from orders where id = ${id} limit 1`;
      const from = String(asJsonRow(rows[0] ?? {}).status ?? "");
      if (!from) throw notFound("Order not found.");
      // The status machine is server-owned; a client cannot invent a state.
      if (!canTransitionOrder(from, next)) {
        throw httpError(`An order cannot move from ${from} to ${next}.`, 409);
      }
      // Re-assert the observed status in the predicate so a concurrent change
      // cannot be silently overwritten by a stale read.
      const updated = await sql`
        update orders set status = ${next}
        where id = ${id} and status = ${from}
        returning id
      `;
      if (!updated[0]) throw httpError("The order changed while it was being updated.", 409);
      await audit(sql, context.userId, `order_status:${from}->${next}`, "orders", id);
    });
    return { ok: true };
  });

// ── content, media, settings ────────────────────────────────────────────────

export const adminListContent = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await requirePerm(context.userId, "content");
    await ensureSeed();
    const sql = await getSql();
    const canCustomers = can(profile.role, "customers");
    const canAudit = can(profile.role, "audit");
    const canMedia = can(profile.role, "media");

    const settings = await sql`select * from site_settings where id = 'default'`;
    const sections = await sql`select * from homepage_sections order by sort_order`;
    const navigation = await sql`select * from navigation order by location, sort_order`;
    const faqs = await sql`select * from faqs order by sort_order`;
    const policies = await sql`select * from policies order by title`;
    // Inquiries carry customer emails and messages; the audit trail carries
    // every operator action. Neither is part of "content", and neither is read
    // (or returned) unless the caller's role grants it.
    const mediaRows: object[] = canMedia ? await sql`select * from media order by created_at desc` : [];
    const inquiryRows: object[] = canCustomers
      ? await sql`select * from inquiries order by created_at desc limit 40`
      : [];
    const auditRows: object[] = canAudit
      ? await sql`select * from audit_log order by created_at desc limit 30`
      : [];

    return {
      role: profile.role,
      permissions: { media: canMedia, customers: canCustomers, audit: canAudit },
      settings: settings[0] ? asJsonRow(settings[0]) : null,
      sections: sections.map((row) => asJsonRow(row)),
      navigation: navigation.map((row) => asJsonRow(row)),
      faqs: faqs.map((row) => asJsonRow(row)),
      policies: policies.map((row) => asJsonRow(row)),
      media: mediaRows.map((row) => asJsonRow(row)),
      inquiries: inquiryRows.map((row) => asJsonRow(row)),
      audit: auditRows.map((row) => asJsonRow(row)),
    };
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Settings payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "settings");
    const brandName = str(data.brandName, 80);
    if (!brandName) throw invalid("Brand name is required.");
    const contactEmail = optionalText(data.contactEmail, 180);
    if (contactEmail && !isValidEmail(contactEmail)) throw invalid("Contact email is invalid.");
    const socialInstagram = optionalText(data.socialInstagram, 200);
    const socialX = optionalText(data.socialX, 200);
    for (const [label, url] of [
      ["Instagram", socialInstagram],
      ["X", socialX],
    ] as const) {
      if (url && !/^https:\/\/[^\s]+$/.test(url)) {
        throw invalid(`${label} link must be an https:// URL.`);
      }
    }

    const sql = await getSql();
    await sql`
      update site_settings set
        brand_name = ${brandName},
        tagline = ${optionalText(data.tagline, 120)},
        contact_email = ${contactEmail},
        announcement = ${optionalText(data.announcement, 200)},
        announcement_enabled = ${Boolean(data.announcementEnabled)},
        footer_note = ${optionalText(data.footerNote, 300)},
        shipping_note = ${optionalText(data.shippingNote, 300)},
        social_instagram = ${socialInstagram},
        social_x = ${socialX},
        updated_at = now()
      where id = 'default'
    `;
    await audit(sql, context.userId, "update_settings", "site_settings", "default");
    return { ok: true };
  });

export const adminSaveSection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Section payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    const id = str(data.id, 64);
    if (!id) throw invalid("Section id is required.");
    const ctaHref = optionalText(data.ctaHref, 180);
    if (ctaHref && !isSafeInternalHref(ctaHref)) {
      throw invalid("CTA link must be an internal path such as /shop.");
    }
    const title = optionalText(data.title, 120);
    const body = optionalText(data.body, 2000);
    const ctaLabel = optionalText(data.ctaLabel, 40);
    const enabled = Boolean(data.enabled);
    // The raw JSON never reaches the column unvalidated: serializeSectionContent
    // parses it, checks it against the schema for THIS section key, and returns
    // the canonical serialization (or throws a 400 naming the field).
    const rawContent = typeof data.content === "string" ? data.content : "{}";

    const sql = await getSql();
    const rows = await sql`select section_key from homepage_sections where id = ${id} limit 1`;
    const key = String(asJsonRow(rows[0] ?? {}).section_key ?? "");
    if (!key) throw notFound("Section not found.");
    const content = serializeSectionContent(key, rawContent);
    await sql`
      update homepage_sections set
        title = ${title},
        body = ${body},
        cta_label = ${ctaLabel},
        cta_href = ${ctaHref},
        enabled = ${enabled},
        content = ${content}
      where id = ${id}
    `;
    await audit(sql, context.userId, "update_section", "homepage_sections", id);
    return { ok: true };
  });

export const adminSaveFaq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("FAQ payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    const id = str(data.id, 64);
    if (!id) throw invalid("FAQ id is required.");
    const question = str(data.question, 180);
    const answer = str(data.answer, 2000);
    if (!question) throw invalid("FAQ question is required.");
    if (!answer) throw invalid("FAQ answer is required.");
    const sortOrder = Number.isFinite(Number(data.sortOrder)) ? Math.trunc(Number(data.sortOrder)) : 0;

    const sql = await getSql();
    const updated = await sql`
      update faqs set
        question = ${question},
        answer = ${answer},
        published = ${Boolean(data.published)},
        sort_order = ${Math.max(0, Math.min(999, sortOrder))}
      where id = ${id}
      returning id
    `;
    if (!updated[0]) throw notFound("FAQ not found.");
    await audit(sql, context.userId, "update_faq", "faqs", id);
    return { ok: true };
  });

export const adminSaveNav = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Navigation payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    const id = str(data.id, 64);
    if (!id) throw invalid("Navigation id is required.");
    const label = str(data.label, 40);
    if (!label) throw invalid("Navigation label is required.");
    const href = str(data.href, 180);
    // A route this app actually serves — never an arbitrary string, and never
    // a scheme that could run script.
    if (!isSafeInternalHref(href)) {
      throw invalid("Navigation link must be an internal path such as /shop.");
    }
    const location = str(data.location, 12);
    const resolvedLocation = (NAV_LOCATIONS as readonly string[]).includes(location)
      ? location
      : "header";
    const sortOrder = Math.max(0, Math.min(999, Math.trunc(Number(data.sortOrder) || 0)));

    const sql = await getSql();
    const updated = await sql`
      update navigation set
        label = ${label},
        href = ${href},
        location = ${resolvedLocation},
        sort_order = ${sortOrder},
        visible = ${Boolean(data.visible)}
      where id = ${id}
      returning id
    `;
    if (!updated[0]) throw notFound("Navigation item not found.");
    await audit(sql, context.userId, "update_nav", "navigation", id);
    return { ok: true };
  });

export const adminSavePolicy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Policy payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    const id = str(data.id, 64);
    if (!id) throw invalid("Policy id is required.");
    const title = str(data.title, 80);
    const body = str(data.body, 20000);
    if (!title) throw invalid("Policy title is required.");
    if (!body) throw invalid("Policy body is required.");

    const sql = await getSql();
    const updated = await sql`
      update policies set
        title = ${title},
        body = ${body},
        published = ${Boolean(data.published)},
        updated_at = now()
      where id = ${id}
      returning id
    `;
    if (!updated[0]) throw notFound("Policy not found.");
    await audit(sql, context.userId, "update_policy", "policies", id);
    return { ok: true };
  });

export const adminSaveMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Media payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "media");
    const id = str(data.id, 64);
    if (!id) throw invalid("Media id is required.");
    const url = str(data.url, 240);
    if (!isSafeMediaUrl(url)) {
      throw invalid("Media URL must be a site path (/media/…) or an https:// image or video URL.");
    }
    const altText = str(data.altText, 180);

    const sql = await getSql();
    const updated = await sql`
      update media set url = ${url}, alt_text = ${altText} where id = ${id} returning id
    `;
    if (!updated[0]) throw notFound("Media not found.");
    await audit(sql, context.userId, "update_media", "media", id);
    return { ok: true };
  });

export const adminAddMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<Record<string, unknown>>("Media payload"))
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "media");
    const url = str(data.url, 240);
    if (!isSafeMediaUrl(url)) {
      throw invalid("Media URL must be a site path (/media/…) or an https:// image or video URL.");
    }
    const altText = str(data.altText, 180);
    const kind = str(data.kind, 12) || "image";
    if (!isMediaKind(kind)) throw invalid("Unknown media kind.");

    const sql = await getSql();
    const id = uid("media");
    await sql`
      insert into media (id, kind, url, alt_text)
      values (${id}, ${kind}, ${url}, ${altText})
    `;
    await audit(sql, context.userId, "add_media", "media", id);
    return { id };
  });

// ── staff roles (owner only) ────────────────────────────────────────────────

export const adminListStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JsonRow[]> => {
    await requirePerm(context.userId, "settings");
    const sql = await getSql();
    const rows = await sql`
      select p.user_id, p.role, p.display_name, p.created_at
      from user_profiles p
      where p.role <> 'customer'
      order by p.created_at
    `;
    return rows.map((row) => asJsonRow(row));
  });

/**
 * Grant or revoke a studio role.
 *
 * Owner-only, and an owner cannot demote the last owner — losing the final
 * owner row would strand the deployment with nobody able to administer it.
 */
export const adminSetStaffRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<{ userId: string; role: string }>("Role payload"))
  .handler(async ({ context, data }) => {
    const actor = await requirePerm(context.userId, "settings");
    if (actor.role !== "owner") throw forbidden();

    const userId = str(data.userId, 64);
    const role = str(data.role, 16);
    if (!userId) throw invalid("User id is required.");
    if (role !== "customer" && !(STAFF_ROLES as readonly string[]).includes(role)) {
      throw invalid("Unknown role.");
    }

    return withTransaction(async (sql) => {
      const target = await sql`
        select role from user_profiles where user_id = ${userId} limit 1
      `;
      const from = target[0] ? String(asJsonRow(target[0]).role ?? "") : "";
      if (!from) throw notFound("That account has no profile.");

      if (from === "owner" && role !== "owner") {
        const owners = await sql<{ n: number }>`
          select count(*)::int as n from user_profiles where role = 'owner'
        `;
        if (Number(owners[0]?.n ?? 0) <= 1) {
          throw httpError("The studio must keep at least one owner.", 409);
        }
      }
      if (role === "owner") {
        const owners = await sql<{ n: number }>`
          select count(*)::int as n from user_profiles where role = 'owner' and user_id <> ${userId}
        `;
        // The partial unique index would reject a second owner row anyway; this
        // turns that into a sentence.
        if (Number(owners[0]?.n ?? 0) > 0) {
          throw httpError("The studio already has an owner.", 409);
        }
      }

      await sql`update user_profiles set role = ${role} where user_id = ${userId}`;
      await audit(sql, context.userId, `set_role:${from}->${role}`, "user_profiles", userId);
    });
    return { ok: true };
  });

/** The role vocabulary the UI offers, sourced from the server's own table. */
export const adminRoles = STAFF_ROLES as readonly StaffRole[];
