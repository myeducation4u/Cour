import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CHoOEFfd.mjs";
import { i as parseSectionContent, n as createServerRpc, r as ensureSeed, t as asJsonRow } from "./types-BdVQSQmT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storefront-V3OvaFMl.js
function productFromRow(r) {
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
		seoDescription: row.seo_description == null ? null : String(row.seo_description)
	};
}
var getStorefront_createServerFn_handler = createServerRpc({
	id: "07049028cea290192cb92435ee37e6574b1c4a7be29433a4128aaa13276994a2",
	name: "getStorefront",
	filename: "src/lib/server/storefront.ts"
}, (opts) => getStorefront.__executeServer(opts));
var getStorefront = createServerFn({ method: "GET" }).handler(getStorefront_createServerFn_handler, async () => {
	await ensureSeed();
	const sql = await getSql();
	const settingsRows = await sql`
    select * from site_settings where id = 'default'
  `;
	const s = asJsonRow(settingsRows[0] ?? {});
	return {
		settings: {
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
			maintenanceMode: Boolean(s.maintenance_mode)
		},
		navigation: (await sql`
    select * from navigation where visible = true order by location, sort_order
  `).map((r) => {
			const row = asJsonRow(r);
			return {
				id: String(row.id ?? ""),
				label: String(row.label ?? ""),
				href: String(row.href ?? "/"),
				location: row.location === "footer" ? "footer" : "header",
				sortOrder: Number(row.sort_order ?? 0),
				visible: true
			};
		}),
		sections: (await sql`
    select * from homepage_sections where enabled = true order by sort_order
  `).map((r) => {
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
				content: parseSectionContent(row.content == null ? "{}" : String(row.content))
			};
		}),
		products: (await sql`
    select p.*, m.url as image_url
    from products p
    left join media m on m.id = p.primary_media_id
    where p.status = 'published'
    order by p.featured desc, p.name
  `).map(productFromRow),
		collections: (await sql`
    select c.*, m.url as cover_url
    from collections c
    left join media m on m.id = c.cover_media_id
    where c.visible = true
    order by c.sort_order
  `).map((r) => {
			const row = asJsonRow(r);
			return {
				id: String(row.id ?? ""),
				slug: String(row.slug ?? ""),
				name: String(row.name ?? ""),
				description: row.description == null ? null : String(row.description),
				cover: row.cover_url == null ? null : String(row.cover_url),
				visible: true
			};
		}),
		faqs: (await sql`
    select * from faqs where published = true order by sort_order
  `).map((r) => {
			const row = asJsonRow(r);
			return {
				id: String(row.id ?? ""),
				question: String(row.question ?? ""),
				answer: String(row.answer ?? ""),
				sortOrder: Number(row.sort_order ?? 0),
				published: true
			};
		}),
		policies: (await sql`
    select * from policies where published = true order by title
  `).map((r) => {
			const row = asJsonRow(r);
			return {
				id: String(row.id ?? ""),
				slug: String(row.slug ?? ""),
				title: String(row.title ?? ""),
				body: String(row.body ?? ""),
				published: true
			};
		})
	};
});
var getProductBySlug_createServerFn_handler = createServerRpc({
	id: "906f493e93192f7e545d8754695cadfe3f38347c9360f5e187f0214f0284084a",
	name: "getProductBySlug",
	filename: "src/lib/server/storefront.ts"
}, (opts) => getProductBySlug.__executeServer(opts));
var getProductBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getProductBySlug_createServerFn_handler, async ({ data: slug }) => {
	await ensureSeed();
	const sql = await getSql();
	const r = (await sql`
      select p.*, m.url as image_url
      from products p
      left join media m on m.id = p.primary_media_id
      where p.slug = ${slug} and p.status = 'published'
      limit 1
    `)[0];
	if (!r) return null;
	const product = productFromRow(r);
	const variants = (await sql`
      select * from product_variants
      where product_id = ${product.id} and status = 'active'
      order by size
    `).map((v) => {
		const row = asJsonRow(v);
		return {
			id: String(row.id ?? ""),
			productId: String(row.product_id ?? ""),
			sku: String(row.sku ?? ""),
			size: String(row.size ?? ""),
			priceOverrideCents: row.price_override_cents == null ? null : Number(row.price_override_cents),
			inventoryQuantity: Number(row.inventory_quantity ?? 0),
			status: String(row.status ?? "active")
		};
	});
	const sizeRank = {
		XS: 0,
		S: 1,
		M: 2,
		L: 3,
		XL: 4,
		XXL: 5
	};
	variants.sort((a, b) => (sizeRank[a.size] ?? 99) - (sizeRank[b.size] ?? 99));
	return {
		product,
		variants
	};
});
var getCollectionBySlug_createServerFn_handler = createServerRpc({
	id: "5b4f0578b8cbfed0da0c9299da2c8c0bb14f630689bd6876deae1d134582512a",
	name: "getCollectionBySlug",
	filename: "src/lib/server/storefront.ts"
}, (opts) => getCollectionBySlug.__executeServer(opts));
var getCollectionBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getCollectionBySlug_createServerFn_handler, async ({ data: slug }) => {
	await ensureSeed();
	const sql = await getSql();
	const c = (await sql`
      select c.*, m.url as cover_url
      from collections c
      left join media m on m.id = c.cover_media_id
      where c.slug = ${slug} and c.visible = true
      limit 1
    `)[0];
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
			visible: true
		},
		products: productRows.map(productFromRow)
	};
});
var searchProducts_createServerFn_handler = createServerRpc({
	id: "f7a566d81f28aff81fa140bcda849490ba681d47385e45736c24f8dc58eb76b1",
	name: "searchProducts",
	filename: "src/lib/server/storefront.ts"
}, (opts) => searchProducts.__executeServer(opts));
var searchProducts = createServerFn({ method: "GET" }).validator((q) => q).handler(searchProducts_createServerFn_handler, async ({ data: q }) => {
	await ensureSeed();
	const sql = await getSql();
	const like = `%${q.trim().toLowerCase()}%`;
	if (!q.trim()) return [];
	return (await sql`
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
    `).map(productFromRow);
});
var submitInquiry_createServerFn_handler = createServerRpc({
	id: "901109565effd9fa35babb70179531d41e7b81d45e5f3d9e59271393ff54ec87",
	name: "submitInquiry",
	filename: "src/lib/server/storefront.ts"
}, (opts) => submitInquiry.__executeServer(opts));
var submitInquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(submitInquiry_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	if (!email.includes("@")) throw new Error("Enter a valid email.");
	await (await getSql())`
      insert into inquiries (id, email, kind, message)
      values (${`inq_${crypto.randomUUID().slice(0, 10)}`}, ${email}, ${data.kind ?? "newsletter"}, ${data.message ?? null})
    `;
	return { ok: true };
});
//#endregion
export { getCollectionBySlug_createServerFn_handler, getProductBySlug_createServerFn_handler, getStorefront_createServerFn_handler, searchProducts_createServerFn_handler, submitInquiry_createServerFn_handler };
