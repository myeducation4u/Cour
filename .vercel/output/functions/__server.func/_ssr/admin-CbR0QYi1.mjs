import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CHoOEFfd.mjs";
import { n as uid } from "./utils-4_bTDmXX.mjs";
import { t as authMiddleware } from "./middleware-DA70zXJk.mjs";
import { n as createServerRpc, r as ensureSeed, t as asJsonRow } from "./types-BdVQSQmT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CbR0QYi1.js
async function getProfile(userId) {
	const r = (await (await getSql())`
    select user_id, role, display_name from user_profiles where user_id = ${userId}
  `)[0];
	return r ? {
		userId: r.user_id,
		role: r.role,
		displayName: r.display_name
	} : null;
}
async function requireStaff(userId) {
	const profile = await getProfile(userId);
	if (!profile || ![
		"owner",
		"admin",
		"editor"
	].includes(profile.role)) {
		const err = /* @__PURE__ */ new Error("Forbidden");
		err.status = 403;
		throw err;
	}
	return profile;
}
async function audit(userId, action, entity, entityId) {
	await (await getSql())`
    insert into audit_log (id, user_id, action, entity, entity_id)
    values (${uid("aud")}, ${userId}, ${action}, ${entity}, ${entityId ?? null})
  `;
}
var getAdminContext_createServerFn_handler = createServerRpc({
	id: "6785b65249ae7a357fc002a9a5a6c8bfc334c51ca1cafe4a5f51e1449dd1a974",
	name: "getAdminContext",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminContext.__executeServer(opts));
var getAdminContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminContext_createServerFn_handler, async ({ context }) => {
	await ensureSeed();
	const owners = await (await getSql())`
      select count(*)::int as n from user_profiles where role in ('owner', 'admin')
    `;
	const profile = await getProfile(context.userId);
	return {
		userId: context.userId,
		profile,
		needsClaim: Number(owners[0]?.n ?? 0) === 0,
		isStaff: Boolean(profile && [
			"owner",
			"admin",
			"editor"
		].includes(profile.role))
	};
});
var claimOwner_createServerFn_handler = createServerRpc({
	id: "2569cb9fd1cdd89c764f9d63f1a7a8b11dacd8de1b98fddc87ea8f03ace52c9e",
	name: "claimOwner",
	filename: "src/lib/server/admin.ts"
}, (opts) => claimOwner.__executeServer(opts));
var claimOwner = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimOwner_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const owners = await sql`
      select count(*)::int as n from user_profiles where role in ('owner', 'admin')
    `;
	if (Number(owners[0]?.n ?? 0) > 0) throw new Error("The studio already has an owner.");
	await sql`
      insert into user_profiles (user_id, role, display_name)
      values (${context.userId}, 'owner', 'Owner')
      on conflict (user_id) do update set role = 'owner'
    `;
	await audit(context.userId, "claim_owner", "user_profiles", context.userId);
	return { ok: true };
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "a4d1e1a0fbd35f1887b311ded858b2b2fa1a387726501a02ca3b8473cc2c267a",
	name: "getDashboard",
	filename: "src/lib/server/admin.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	await requireStaff(context.userId);
	const sql = await getSql();
	const orders = await sql`
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
	const products = await sql`select count(*)::int as n from products`;
	const lowStock = low.map((row) => {
		const r = asJsonRow(row);
		return {
			sku: String(r.sku ?? ""),
			size: String(r.size ?? ""),
			inventoryQuantity: Number(r.inventory_quantity ?? 0),
			name: String(r.name ?? "")
		};
	});
	const recentOrders = recent.map((row) => {
		const r = asJsonRow(row);
		return {
			id: String(r.id ?? ""),
			email: r.email == null ? null : String(r.email),
			status: String(r.status ?? ""),
			totalCents: Number(r.total_cents ?? 0),
			createdAt: String(r.created_at ?? "")
		};
	});
	return {
		orderCount: Number(orders[0]?.n ?? 0),
		revenueCents: Number(orders[0]?.revenue ?? 0),
		productCount: Number(products[0]?.n ?? 0),
		lowStock,
		recentOrders
	};
});
var adminListProducts_createServerFn_handler = createServerRpc({
	id: "e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e",
	name: "adminListProducts",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListProducts.__executeServer(opts));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListProducts_createServerFn_handler, async ({ context }) => {
	await requireStaff(context.userId);
	return (await (await getSql())`
      select p.*, m.url as image_url
      from products p
      left join media m on m.id = p.primary_media_id
      order by p.name
    `).map((row) => asJsonRow(row));
});
var adminGetProduct_createServerFn_handler = createServerRpc({
	id: "da2592303af7514e03a8e9adc368aee03bb07ba8862d4c0f79a779e9c2af160a",
	name: "adminGetProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetProduct.__executeServer(opts));
var adminGetProduct = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(adminGetProduct_createServerFn_handler, async ({ context, data: id }) => {
	await requireStaff(context.userId);
	const sql = await getSql();
	const product = (await sql`select * from products where id = ${id} limit 1`)[0];
	if (!product) return null;
	const variants = await sql`
      select * from product_variants where product_id = ${id} order by size
    `;
	return {
		product: asJsonRow(product),
		variants: variants.map((row) => asJsonRow(row))
	};
});
var adminSaveProduct_createServerFn_handler = createServerRpc({
	id: "d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d",
	name: "adminSaveProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveProduct.__executeServer(opts));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveProduct_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	if (!data.name.trim() || !data.slug.trim()) throw new Error("Name and slug are required.");
	await (await getSql())`
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
var adminSaveVariantInventory_createServerFn_handler = createServerRpc({
	id: "db4ee78daf3fe4663b15bc3b7badebb0e1e8cfbea5e3c75d779cd95da8ddf541",
	name: "adminSaveVariantInventory",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveVariantInventory.__executeServer(opts));
var adminSaveVariantInventory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveVariantInventory_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
      update product_variants
      set inventory_quantity = ${Math.max(0, data.inventoryQuantity)}, status = ${data.status}
      where id = ${data.id}
    `;
	await audit(context.userId, "update_inventory", "product_variants", data.id);
	return { ok: true };
});
var adminListOrders_createServerFn_handler = createServerRpc({
	id: "588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e",
	name: "adminListOrders",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListOrders.__executeServer(opts));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListOrders_createServerFn_handler, async ({ context }) => {
	await requireStaff(context.userId);
	return (await (await getSql())`
      select * from orders order by created_at desc limit 80
    `).map((row) => asJsonRow(row));
});
var adminSetOrderStatus_createServerFn_handler = createServerRpc({
	id: "d06a2085b8985be9b44fcbcd5650878b527207e5da9ab4f784c8022dfc0d2c64",
	name: "adminSetOrderStatus",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSetOrderStatus.__executeServer(opts));
var adminSetOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSetOrderStatus_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`update orders set status = ${data.status} where id = ${data.id}`;
	await audit(context.userId, "update_order", "orders", data.id);
	return { ok: true };
});
var adminListContent_createServerFn_handler = createServerRpc({
	id: "272a7cc43c9a843d452eaef84432c367b26064af282a9df0af1ae2ed88396a35",
	name: "adminListContent",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListContent.__executeServer(opts));
var adminListContent = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListContent_createServerFn_handler, async ({ context }) => {
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
		audit: auditRows.map((row) => asJsonRow(row))
	};
});
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "4559ed6bf9a7b05c02163e5741d4be1b6008bb0bb52c25c4782cb2fe0f4383ca",
	name: "adminSaveSettings",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveSettings_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
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
var adminSaveSection_createServerFn_handler = createServerRpc({
	id: "3f599be4a71e5d5f4353973a95c4baabc8b542a9f1e2ed2e8666fad1708ac1e0",
	name: "adminSaveSection",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveSection.__executeServer(opts));
var adminSaveSection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveSection_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
      update homepage_sections set
        title = ${data.title ?? null},
        body = ${data.body ?? null},
        cta_label = ${data.ctaLabel ?? null},
        cta_href = ${data.ctaHref ?? null},
        enabled = ${data.enabled},
        content = ${data.content ?? "{}"}
      where id = ${data.id}
    `;
	await audit(context.userId, "update_section", "homepage_sections", data.id);
	return { ok: true };
});
var adminSaveFaq_createServerFn_handler = createServerRpc({
	id: "a3b6ccf6923a1cbfc48df269a1b943f3f1d80978a1bc6cea86967df55c4af210",
	name: "adminSaveFaq",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveFaq.__executeServer(opts));
var adminSaveFaq = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveFaq_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
      update faqs set question = ${data.question}, answer = ${data.answer}, published = ${data.published}
      where id = ${data.id}
    `;
	await audit(context.userId, "update_faq", "faqs", data.id);
	return { ok: true };
});
var adminSaveNav_createServerFn_handler = createServerRpc({
	id: "7bb4cc419eb72376ffb6d74ad0a75feaa6ce3525713214a73a8bc5496aa25270",
	name: "adminSaveNav",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveNav.__executeServer(opts));
var adminSaveNav = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveNav_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
      update navigation set label = ${data.label}, href = ${data.href}, visible = ${data.visible}
      where id = ${data.id}
    `;
	await audit(context.userId, "update_nav", "navigation", data.id);
	return { ok: true };
});
var adminSavePolicy_createServerFn_handler = createServerRpc({
	id: "5179a80b7064c5c2f8a8ca9da535294dcaa47ae267b6bbc71274d1ce71c94ffb",
	name: "adminSavePolicy",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSavePolicy.__executeServer(opts));
var adminSavePolicy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSavePolicy_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`
      update policies set title = ${data.title}, body = ${data.body}, published = ${data.published}, updated_at = now()
      where id = ${data.id}
    `;
	await audit(context.userId, "update_policy", "policies", data.id);
	return { ok: true };
});
var adminSaveMedia_createServerFn_handler = createServerRpc({
	id: "e39a5b83f58cfc803d396602f1bbc5179816d3ba7874f3ceb6a6473fc00453d5",
	name: "adminSaveMedia",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveMedia.__executeServer(opts));
var adminSaveMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSaveMedia_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	await (await getSql())`update media set url = ${data.url}, alt_text = ${data.altText} where id = ${data.id}`;
	await audit(context.userId, "update_media", "media", data.id);
	return { ok: true };
});
var adminAddMedia_createServerFn_handler = createServerRpc({
	id: "5faf31c818a0b8295ca023b283b1a43a7911e51ac93eb19d0dd2dbb4326e8a4e",
	name: "adminAddMedia",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminAddMedia.__executeServer(opts));
var adminAddMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminAddMedia_createServerFn_handler, async ({ context, data }) => {
	await requireStaff(context.userId);
	if (!data.url.trim()) throw new Error("Media URL is required.");
	const sql = await getSql();
	const id = uid("media");
	await sql`
      insert into media (id, kind, url, alt_text)
      values (${id}, ${data.kind ?? "image"}, ${data.url}, ${data.altText})
    `;
	await audit(context.userId, "add_media", "media", id);
	return { id };
});
//#endregion
export { adminAddMedia_createServerFn_handler, adminGetProduct_createServerFn_handler, adminListContent_createServerFn_handler, adminListOrders_createServerFn_handler, adminListProducts_createServerFn_handler, adminSaveFaq_createServerFn_handler, adminSaveMedia_createServerFn_handler, adminSaveNav_createServerFn_handler, adminSavePolicy_createServerFn_handler, adminSaveProduct_createServerFn_handler, adminSaveSection_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminSaveVariantInventory_createServerFn_handler, adminSetOrderStatus_createServerFn_handler, claimOwner_createServerFn_handler, getAdminContext_createServerFn_handler, getDashboard_createServerFn_handler };
