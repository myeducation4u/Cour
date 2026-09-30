import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction } from "@/lib/db";
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
  type Perm,
} from "@/lib/commerce-rules";

type Profile = { userId: string; role: string; displayName: string | null };

function forbidden(): Error {
  const err = new Error("Forbidden");
  (err as Error & { status?: number }).status = 403;
  return err;
}

async function getProfile(userId: string): Promise<Profile | null> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string; role: string; display_name: string | null }>`
    select user_id, role, display_name from user_profiles where user_id = ${userId}
  `;
  const r = rows[0];
  return r ? { userId: r.user_id, role: r.role, displayName: r.display_name } : null;
}

async function requireStaff(userId: string) {
  const profile = await getProfile(userId);
  if (!profile || !can(profile.role, "content")) {
    throw forbidden();
  }
  return profile;
}

async function requirePerm(userId: string, perm: Perm) {
  const profile = await getProfile(userId);
  if (!profile || !can(profile.role, perm)) {
    throw forbidden();
  }
  return profile;
}

async function audit(userId: string, action: string, entity: string, entityId?: string) {
  const sql = await getSql();
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
    const profile = await getProfile(context.userId);
    return {
      userId: context.userId,
      profile,
      needsClaim: Number(owners[0]?.n ?? 0) === 0,
      isStaff: Boolean(profile && isStaffRole(profile.role)),
    };
  });

export const claimOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      await withTransaction(async (sql) => {
        const owners = await sql<{ n: number }>`
          select count(*)::int as n from user_profiles where role = 'owner'
        `;
        if (Number(owners[0]?.n ?? 0) > 0) throw new Error("The studio already has an owner.");
        await sql`
          insert into user_profiles (user_id, role, display_name)
          values (${context.userId}, 'owner', 'Owner')
          on conflict (user_id) do update
            set role = 'owner',
                display_name = coalesce(user_profiles.display_name, 'Owner')
        `;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/user_profiles_one_owner|unique/i.test(message) && !/already has an owner/.test(message)) {
        throw new Error("The studio already has an owner.");
      }
      throw err;
    }
    await audit(context.userId, "claim_owner", "user_profiles", context.userId);
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const orders = await sql<{ n: number; revenue: string | number | null }>`
      select count(*)::int as n, coalesce(sum(total_cents), 0) as revenue from orders
    `;
    const low = await sql`
      select v.sku, v.size, v.inventory_quantity, p.name
      from product_variants v
      join products p on p.id = v.product_id
      where v.inventory_quantity <= 3
      order by v.inventory_quantity asc
      limit 12
    `;
    const recent = await sql`
      select id, email, status, total_cents, created_at from orders
      order by created_at desc limit 8
    `;
    const products = await sql<{ n: number }>`select count(*)::int as n from products`;
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

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JsonRow[]> => {
    await requireStaff(context.userId);
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
  .validator((id: string) => id)
  .handler(async ({ context, data: id }): Promise<{ product: JsonRow; variants: JsonRow[] } | null> => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const products = await sql`select * from products where id = ${id} limit 1`;
    const product = products[0];
    if (!product) return null;
    const variants = await sql`
      select * from product_variants where product_id = ${id} order by size
    `;
    return { product: asJsonRow(product), variants: variants.map((row) => asJsonRow(row)) };
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
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
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "catalog");
    if (!data.name.trim() || !isSlug(data.slug)) throw new Error("Name and a valid slug are required.");
    if (!Number.isFinite(data.priceCents) || data.priceCents < 0) throw new Error("Price must be zero or more.");
    if (!isProductStatus(data.status)) throw new Error("Unknown product status.");
    if (data.colorHex && !isHexColor(data.colorHex)) throw new Error("Color must be a #RRGGBB value.");
    if (data.seoTitle && data.seoTitle.length > 120) throw new Error("SEO title is too long.");
    if (data.seoDescription && data.seoDescription.length > 240) throw new Error("SEO description is too long.");
    const sql = await getSql();
    await sql`
      update products set
        name = ${data.name},
        slug = ${data.slug},
        description = ${data.description ?? null},
        story = ${data.story ?? null},
        price_cents = ${data.priceCents},
        status = ${data.status},
        featured = ${data.featured},
        color_name = ${data.colorName ?? null},
        color_hex = ${data.colorHex ?? null},
        fit = ${data.fit ?? null},
        material = ${data.material ?? null},
        care = ${data.care ?? null},
        seo_title = ${data.seoTitle ?? null},
        seo_description = ${data.seoDescription ?? null},
        updated_at = now()
      where id = ${data.id}
    `;
    await audit(context.userId, "update_product", "products", data.id);
    return { ok: true };
  });

export const adminSaveVariantInventory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; inventoryQuantity: number; status: string }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "inventory");
    if (!isVariantStatus(data.status)) throw new Error("Unknown variant status.");
    const qty = clampInventory(data.inventoryQuantity);
    const sql = await getSql();
    await sql`
      update product_variants
      set inventory_quantity = ${qty}, status = ${data.status}
      where id = ${data.id}
    `;
    await audit(context.userId, "update_inventory", "product_variants", data.id);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JsonRow[]> => {
    await requirePerm(context.userId, "orders");
    const sql = await getSql();
    const rows = await sql`
      select * from orders order by created_at desc limit 80
    `;
    return rows.map((row) => asJsonRow(row));
  });

export const adminSetOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; status: string }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "orders");
    const sql = await getSql();
    const current = await sql`select status from orders where id = ${data.id} limit 1`;
    const from = String(asJsonRow(current[0] ?? {}).status ?? "");
    if (!canTransitionOrder(from, data.status)) {
      throw new Error("That order status change is not allowed.");
    }
    await sql`update orders set status = ${data.status} where id = ${data.id}`;
    await audit(context.userId, "update_order", "orders", data.id);
    return { ok: true };
  });

export const adminListContent = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(
    async ({
      context,
    }): Promise<{
      settings: JsonRow | null;
      sections: JsonRow[];
      navigation: JsonRow[];
      faqs: JsonRow[];
      policies: JsonRow[];
      media: JsonRow[];
      inquiries: JsonRow[];
      audit: JsonRow[];
    }> => {
      await requireStaff(context.userId);
      await ensureSeed();
      const sql = await getSql();
      const settings = await sql`select * from site_settings where id = 'default'`;
      const sections = await sql`select * from homepage_sections order by sort_order`;
      const navigation = await sql`select * from navigation order by location, sort_order`;
      const faqs = await sql`select * from faqs order by sort_order`;
      const policies = await sql`select * from policies order by title`;
      const media = await sql`select * from media order by created_at desc`;
      const inquiries = await sql`select * from inquiries order by created_at desc limit 40`;
      const auditRows = await sql`select * from audit_log order by created_at desc limit 30`;
      return {
        settings: settings[0] ? asJsonRow(settings[0]) : null,
        sections: sections.map((row) => asJsonRow(row)),
        navigation: navigation.map((row) => asJsonRow(row)),
        faqs: faqs.map((row) => asJsonRow(row)),
        policies: policies.map((row) => asJsonRow(row)),
        media: media.map((row) => asJsonRow(row)),
        inquiries: inquiries.map((row) => asJsonRow(row)),
        audit: auditRows.map((row) => asJsonRow(row)),
      };
    },
  );

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      brandName: string;
      tagline?: string;
      contactEmail?: string;
      announcement?: string;
      announcementEnabled: boolean;
      footerNote?: string;
      shippingNote?: string;
      socialInstagram?: string;
      socialX?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "settings");
    if (data.contactEmail && !isValidEmail(data.contactEmail)) throw new Error("Contact email is invalid.");
    if (data.brandName.trim().length < 1 || data.brandName.length > 80) throw new Error("Brand name is required.");
    const sql = await getSql();
    await sql`
      update site_settings set
        brand_name = ${data.brandName},
        tagline = ${data.tagline ?? null},
        contact_email = ${data.contactEmail ?? null},
        announcement = ${data.announcement ?? null},
        announcement_enabled = ${data.announcementEnabled},
        footer_note = ${data.footerNote ?? null},
        shipping_note = ${data.shippingNote ?? null},
        social_instagram = ${data.socialInstagram ?? null},
        social_x = ${data.socialX ?? null},
        updated_at = now()
      where id = 'default'
    `;
    await audit(context.userId, "update_settings", "site_settings", "default");
    return { ok: true };
  });

export const adminSaveSection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      title?: string;
      body?: string;
      ctaLabel?: string;
      ctaHref?: string;
      enabled: boolean;
      content?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    if (data.ctaHref && !isSafeInternalHref(data.ctaHref)) {
      throw new Error("CTA href must be an internal path.");
    }
    if ((data.title ?? "").length > 120) throw new Error("Title is too long.");
    if ((data.body ?? "").length > 2000) throw new Error("Body is too long.");
    const sql = await getSql();
    const rows = await sql`select section_key from homepage_sections where id = ${data.id} limit 1`;
    const key = String(asJsonRow(rows[0] ?? {}).section_key ?? "");
    if (!key) throw new Error("Section not found.");
    const content = serializeSectionContent(key, data.content ?? "{}");
    await sql`
      update homepage_sections set
        title = ${data.title ?? null},
        body = ${data.body ?? null},
        cta_label = ${data.ctaLabel ?? null},
        cta_href = ${data.ctaHref ?? null},
        enabled = ${data.enabled},
        content = ${content}
      where id = ${data.id}
    `;
    await audit(context.userId, "update_section", "homepage_sections", data.id);
    return { ok: true };
  });

export const adminSaveFaq = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; question: string; answer: string; published: boolean }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    if (!data.question.trim() || data.question.length > 180) throw new Error("Question is required.");
    if (!data.answer.trim() || data.answer.length > 2000) throw new Error("Answer is required.");
    const sql = await getSql();
    await sql`
      update faqs set question = ${data.question}, answer = ${data.answer}, published = ${data.published}
      where id = ${data.id}
    `;
    await audit(context.userId, "update_faq", "faqs", data.id);
    return { ok: true };
  });

export const adminSaveNav = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; label: string; href: string; visible: boolean }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    if (!data.label.trim() || data.label.length > 40) throw new Error("Label is required.");
    if (!isSafeInternalHref(data.href)) throw new Error("Navigation href must be an internal path.");
    const sql = await getSql();
    await sql`
      update navigation set label = ${data.label}, href = ${data.href}, visible = ${data.visible}
      where id = ${data.id}
    `;
    await audit(context.userId, "update_nav", "navigation", data.id);
    return { ok: true };
  });

export const adminSavePolicy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; title: string; body: string; published: boolean }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "content");
    if (!data.title.trim() || data.title.length > 80) throw new Error("Title is required.");
    if (!data.body.trim() || data.body.length > 20000) throw new Error("Policy body is required.");
    const sql = await getSql();
    await sql`
      update policies set title = ${data.title}, body = ${data.body}, published = ${data.published}, updated_at = now()
      where id = ${data.id}
    `;
    await audit(context.userId, "update_policy", "policies", data.id);
    return { ok: true };
  });

export const adminSaveMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; url: string; altText: string }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "media");
    if (!isSafeMediaUrl(data.url)) throw new Error("Media URL is not allowed.");
    if (data.altText.length > 180) throw new Error("Alt text is too long.");
    const sql = await getSql();
    await sql`update media set url = ${data.url}, alt_text = ${data.altText} where id = ${data.id}`;
    await audit(context.userId, "update_media", "media", data.id);
    return { ok: true };
  });

export const adminAddMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { url: string; altText: string; kind?: string }) => input)
  .handler(async ({ context, data }) => {
    await requirePerm(context.userId, "media");
    if (!isSafeMediaUrl(data.url)) throw new Error("Media URL is not allowed.");
    if (data.altText.length > 180) throw new Error("Alt text is too long.");
    const kind = data.kind ?? "image";
    if (!isMediaKind(kind)) throw new Error("Unknown media kind.");
    const sql = await getSql();
    const id = uid("media");
    await sql`
      insert into media (id, kind, url, alt_text)
      values (${id}, ${kind}, ${data.url}, ${data.altText})
    `;
    await audit(context.userId, "add_media", "media", id);
    return { id };
  });
