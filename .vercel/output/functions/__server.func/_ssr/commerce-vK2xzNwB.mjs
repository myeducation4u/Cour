import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CHoOEFfd.mjs";
import { n as uid } from "./utils-4_bTDmXX.mjs";
import { t as authMiddleware } from "./middleware-DA70zXJk.mjs";
import { n as createServerRpc, r as ensureSeed, t as asJsonRow } from "./types-BdVQSQmT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-vK2xzNwB.js
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "3d504ad47cf26f6058e8d5f7055d28aafb29ac9b3324490542dad038cc9237e6",
	name: "listMyOrders",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	await ensureSeed();
	const sql = await getSql();
	const orders = await sql`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `;
	const result = [];
	for (const o of orders) {
		const order = asJsonRow(o);
		const items = await sql`
        select * from order_items where order_id = ${String(order.id)}
      `;
		result.push({
			id: String(order.id ?? ""),
			status: String(order.status ?? ""),
			email: order.email == null ? null : String(order.email),
			totalCents: Number(order.total_cents ?? 0),
			shippingCents: Number(order.shipping_cents ?? 0),
			createdAt: String(order.created_at ?? ""),
			items: items.map((it) => {
				const item = asJsonRow(it);
				return {
					id: String(item.id ?? ""),
					name: String(item.name ?? ""),
					size: String(item.size ?? ""),
					unitCents: Number(item.unit_cents ?? 0),
					quantity: Number(item.quantity ?? 0)
				};
			})
		});
	}
	return result;
});
var getMyOrder_createServerFn_handler = createServerRpc({
	id: "31ee80267b1463c290fbb93f3dfcc83c8c9fb449cc7b3995c82f1a1d2bc24140",
	name: "getMyOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => getMyOrder.__executeServer(opts));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getMyOrder_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const o = (await sql`
      select * from orders where id = ${id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!o) return null;
	const order = asJsonRow(o);
	const items = await sql`
      select * from order_items where order_id = ${id}
    `;
	return {
		id: String(order.id ?? ""),
		status: String(order.status ?? ""),
		email: order.email == null ? null : String(order.email),
		totalCents: Number(order.total_cents ?? 0),
		shippingCents: Number(order.shipping_cents ?? 0),
		createdAt: String(order.created_at ?? ""),
		shippingName: order.shipping_name == null ? null : String(order.shipping_name),
		shippingLine1: order.shipping_line1 == null ? null : String(order.shipping_line1),
		shippingCity: order.shipping_city == null ? null : String(order.shipping_city),
		items: items.map((it) => {
			const item = asJsonRow(it);
			return {
				id: String(item.id ?? ""),
				name: String(item.name ?? ""),
				size: String(item.size ?? ""),
				unitCents: Number(item.unit_cents ?? 0),
				quantity: Number(item.quantity ?? 0)
			};
		})
	};
});
var listMyAddresses_createServerFn_handler = createServerRpc({
	id: "36dcab8cc1a06d7e71106dff705d1fcf1e3bada5136e6e7193d2b217aaeef43f",
	name: "listMyAddresses",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listMyAddresses.__executeServer(opts));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyAddresses_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select * from addresses where user_id = ${context.userId} order by is_default desc, label
    `).map((row) => {
		const r = asJsonRow(row);
		return {
			id: String(r.id ?? ""),
			label: r.label == null ? null : String(r.label),
			line1: String(r.line1 ?? ""),
			city: String(r.city ?? ""),
			region: r.region == null ? null : String(r.region),
			postalCode: r.postal_code == null ? null : String(r.postal_code),
			country: String(r.country ?? "US"),
			isDefault: Boolean(r.is_default)
		};
	});
});
var saveAddress_createServerFn_handler = createServerRpc({
	id: "118760e18905b9f60eb2b0fad82e5b7b27a3af82f24de61165d99fdc2703c3f3",
	name: "saveAddress",
	filename: "src/lib/server/commerce.ts"
}, (opts) => saveAddress.__executeServer(opts));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAddress_createServerFn_handler, async ({ context, data }) => {
	if (!data.line1.trim() || !data.city.trim()) throw new Error("Address is incomplete.");
	const sql = await getSql();
	const id = data.id ?? uid("adr");
	if (data.isDefault) await sql`update addresses set is_default = false where user_id = ${context.userId}`;
	await sql`
      insert into addresses (id, user_id, label, line1, line2, city, region, postal_code, country, is_default)
      values (
        ${id}, ${context.userId}, ${data.label ?? "Home"}, ${data.line1}, ${data.line2 ?? null},
        ${data.city}, ${data.region ?? null}, ${data.postalCode ?? null}, ${data.country ?? "US"},
        ${Boolean(data.isDefault)}
      )
      on conflict (id) do update set
        label = excluded.label,
        line1 = excluded.line1,
        line2 = excluded.line2,
        city = excluded.city,
        region = excluded.region,
        postal_code = excluded.postal_code,
        country = excluded.country,
        is_default = excluded.is_default
    `;
	return { id };
});
var deleteAddress_createServerFn_handler = createServerRpc({
	id: "9948bfb51ecb067a70b814031ef10de5a66044c1fabade56ffff63e04dab8c28",
	name: "deleteAddress",
	filename: "src/lib/server/commerce.ts"
}, (opts) => deleteAddress.__executeServer(opts));
var deleteAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteAddress_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`delete from addresses where id = ${id} and user_id = ${context.userId}`;
	return { ok: true };
});
var listWishlist_createServerFn_handler = createServerRpc({
	id: "4b645835d28d4ddb96759bbccf83508fb31d715eb81bcd47741d207154715ecc",
	name: "listWishlist",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listWishlist.__executeServer(opts));
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listWishlist_createServerFn_handler, async ({ context }) => {
	await ensureSeed();
	return (await (await getSql())`
      select p.id, p.slug, p.name, p.price_cents, m.url as image
      from wishlist_items w
      join products p on p.id = w.product_id
      left join media m on m.id = p.primary_media_id
      where w.user_id = ${context.userId}
      order by w.created_at desc
    `).map((row) => {
		const r = asJsonRow(row);
		return {
			id: String(r.id ?? ""),
			slug: String(r.slug ?? ""),
			name: String(r.name ?? ""),
			priceCents: Number(r.price_cents ?? 0),
			image: String(r.image ?? "/media/void-puffer.webp")
		};
	});
});
var toggleWishlist_createServerFn_handler = createServerRpc({
	id: "903e3c45616728bef2bdf44aad337f49c5029e0c98ed9997e7a4b92aa36218f1",
	name: "toggleWishlist",
	filename: "src/lib/server/commerce.ts"
}, (opts) => toggleWishlist.__executeServer(opts));
var toggleWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((productId) => productId).handler(toggleWishlist_createServerFn_handler, async ({ context, data: productId }) => {
	const sql = await getSql();
	if ((await sql`
      select product_id from wishlist_items
      where user_id = ${context.userId} and product_id = ${productId}
    `).length) {
		await sql`delete from wishlist_items where user_id = ${context.userId} and product_id = ${productId}`;
		return { saved: false };
	}
	await sql`
      insert into wishlist_items (user_id, product_id) values (${context.userId}, ${productId})
    `;
	return { saved: true };
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "20b040908bc9c9520b9c9b9e6ba18ced100adfac598cf962ecb813cd10188e1d",
	name: "placeOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	await ensureSeed();
	const email = data.email.trim().toLowerCase();
	if (!email.includes("@")) throw new Error("Enter a valid email.");
	if (!data.items.length) throw new Error("Bag is empty.");
	if (!data.shippingName.trim() || !data.shippingLine1.trim() || !data.shippingCity.trim()) throw new Error("Shipping address is incomplete.");
	const sql = await getSql();
	let userId = null;
	try {
		const { getSessionUser } = await import("./verify.server-ClGL_F1n.mjs");
		userId = (await getSessionUser())?.id ?? null;
	} catch {
		userId = null;
	}
	const lines = [];
	for (const item of data.items) {
		const qty = Math.max(1, Math.min(8, Math.floor(item.quantity)));
		const v = (await sql`
        select v.id, v.product_id, v.size, v.inventory_quantity, v.price_override_cents,
               p.name, p.price_cents
        from product_variants v
        join products p on p.id = v.product_id
        where v.id = ${item.variantId} and v.status = 'active' and p.status = 'published'
        limit 1
      `)[0];
		if (!v) throw new Error("A selected size is no longer available.");
		const row = asJsonRow(v);
		if (Number(row.inventory_quantity ?? 0) < qty) throw new Error(`${String(row.name)} / ${String(row.size)} does not have enough inventory.`);
		const unit = row.price_override_cents == null ? Number(row.price_cents ?? 0) : Number(row.price_override_cents);
		lines.push({
			variantId: String(row.id ?? ""),
			productId: String(row.product_id ?? ""),
			name: String(row.name ?? ""),
			size: String(row.size ?? ""),
			unit,
			quantity: qty
		});
	}
	const subtotal = lines.reduce((n, l) => n + l.unit * l.quantity, 0);
	const shipping = subtotal >= 4e4 ? 0 : 1800;
	const total = subtotal + shipping;
	const orderId = uid("ord");
	await sql`
      insert into orders (
        id, user_id, status, email, total_cents, shipping_cents,
        shipping_name, shipping_line1, shipping_city, shipping_region,
        shipping_postal, shipping_country
      ) values (
        ${orderId}, ${userId}, 'placed', ${email}, ${total}, ${shipping},
        ${data.shippingName}, ${data.shippingLine1}, ${data.shippingCity},
        ${data.shippingRegion ?? null}, ${data.shippingPostal ?? null},
        ${data.shippingCountry ?? "US"}
      )
    `;
	for (const line of lines) {
		await sql`
        insert into order_items (id, order_id, product_id, variant_id, name, size, unit_cents, quantity)
        values (${uid("itm")}, ${orderId}, ${line.productId}, ${line.variantId}, ${line.name}, ${line.size}, ${line.unit}, ${line.quantity})
      `;
		await sql`
        update product_variants
        set inventory_quantity = inventory_quantity - ${line.quantity}
        where id = ${line.variantId} and inventory_quantity >= ${line.quantity}
      `;
	}
	if (userId) await sql`delete from cart_items where user_id = ${userId}`;
	return {
		orderId,
		totalCents: total,
		shippingCents: shipping
	};
});
//#endregion
export { deleteAddress_createServerFn_handler, getMyOrder_createServerFn_handler, listMyAddresses_createServerFn_handler, listMyOrders_createServerFn_handler, listWishlist_createServerFn_handler, placeOrder_createServerFn_handler, saveAddress_createServerFn_handler, toggleWishlist_createServerFn_handler };
