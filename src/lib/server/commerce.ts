import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed } from "./seed";
import { asJsonRow } from "@/lib/types";
import type { AddressCard, OrderSummary, WishlistCard } from "@/lib/types";
import { uid } from "@/lib/utils";
import { clampQty, isShippingCountry, isValidEmail, shippingCents } from "@/lib/commerce-rules";

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OrderSummary[]> => {
    await ensureSeed();
    const sql = await getSql();
    const orders = await sql`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `;
    const result: OrderSummary[] = [];
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
            quantity: Number(item.quantity ?? 0),
          };
        }),
      });
    }
    return result;
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const orders = await sql`
      select * from orders where id = ${id} and user_id = ${context.userId} limit 1
    `;
    const o = orders[0];
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
          quantity: Number(item.quantity ?? 0),
        };
      }),
    };
  });

export const listMyAddresses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AddressCard[]> => {
    const sql = await getSql();
    const rows = await sql`
      select * from addresses where user_id = ${context.userId} order by is_default desc, label
    `;
    return rows.map((row) => {
      const r = asJsonRow(row);
      return {
        id: String(r.id ?? ""),
        label: r.label == null ? null : String(r.label),
        line1: String(r.line1 ?? ""),
        city: String(r.city ?? ""),
        region: r.region == null ? null : String(r.region),
        postalCode: r.postal_code == null ? null : String(r.postal_code),
        country: String(r.country ?? "US"),
        isDefault: Boolean(r.is_default),
      };
    });
  });

export const saveAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id?: string;
      label?: string;
      line1: string;
      line2?: string;
      city: string;
      region?: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const line1 = data.line1.trim();
    const city = data.city.trim();
    if (!line1 || !city) throw new Error("Address is incomplete.");
    const sql = await getSql();
    const country = (data.country ?? "US").trim().toUpperCase();
    if (!isShippingCountry(country)) throw new Error("Select a supported shipping country.");
    if (data.isDefault) {
      await sql`update addresses set is_default = false where user_id = ${context.userId}`;
    }
    if (data.id) {
      const updated = await sql`
        update addresses set
          label = ${data.label ?? "Home"},
          line1 = ${line1},
          line2 = ${data.line2 ?? null},
          city = ${city},
          region = ${data.region ?? null},
          postal_code = ${data.postalCode ?? null},
          country = ${country},
          is_default = ${Boolean(data.isDefault)}
        where id = ${data.id} and user_id = ${context.userId}
        returning id
      `;
      if (!updated[0]) throw new Error("Address not found.");
      return { id: String(asJsonRow(updated[0]).id ?? data.id) };
    }
    const id = uid("adr");
    await sql`
      insert into addresses (id, user_id, label, line1, line2, city, region, postal_code, country, is_default)
      values (
        ${id}, ${context.userId}, ${data.label ?? "Home"}, ${line1}, ${data.line2 ?? null},
        ${city}, ${data.region ?? null}, ${data.postalCode ?? null}, ${country},
        ${Boolean(data.isDefault)}
      )
    `;
    return { id };
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from addresses where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const listWishlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<WishlistCard[]> => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql`
      select p.id, p.slug, p.name, p.price_cents, m.url as image
      from wishlist_items w
      join products p on p.id = w.product_id
      left join media m on m.id = p.primary_media_id
      where w.user_id = ${context.userId}
      order by w.created_at desc
    `;
    return rows.map((row) => {
      const r = asJsonRow(row);
      return {
        id: String(r.id ?? ""),
        slug: String(r.slug ?? ""),
        name: String(r.name ?? ""),
        priceCents: Number(r.price_cents ?? 0),
        image: String(r.image ?? "/media/void-puffer.webp"),
      };
    });
  });

export const toggleWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((productId: string) => productId)
  .handler(async ({ context, data: productId }) => {
    const sql = await getSql();
    const existing = await sql<{ product_id: string }>`
      select product_id from wishlist_items
      where user_id = ${context.userId} and product_id = ${productId}
    `;
    if (existing.length) {
      await sql`delete from wishlist_items where user_id = ${context.userId} and product_id = ${productId}`;
      return { saved: false };
    }
    await sql`
      insert into wishlist_items (user_id, product_id) values (${context.userId}, ${productId})
    `;
    return { saved: true };
  });

type CheckoutItem = {
  variantId: string;
  quantity: number;
};

export const getOrderByToken = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    if (!token || token.length < 16) return null;
    await ensureSeed();
    const sql = await getSql();
    const orders = await sql`
      select * from orders where confirm_token = ${token} limit 1
    `;
    const o = orders[0];
    if (!o) return null;
    const order = asJsonRow(o);
    const items = await sql`
      select * from order_items where order_id = ${String(order.id)}
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
          quantity: Number(item.quantity ?? 0),
        };
      }),
    };
  });

export const placeOrder = createServerFn({ method: "POST" })
  .validator(
    (input: {
      email: string;
      items: CheckoutItem[];
      shippingName: string;
      shippingLine1: string;
      shippingCity: string;
      shippingRegion?: string;
      shippingPostal?: string;
      shippingCountry?: string;
      idempotencyKey?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    await ensureSeed();
    const email = data.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new Error("Enter a valid email.");
    if (!data.items.length) throw new Error("Bag is empty.");
    if (!data.shippingName.trim() || !data.shippingLine1.trim() || !data.shippingCity.trim()) {
      throw new Error("Shipping address is incomplete.");
    }
    const country = (data.shippingCountry ?? "US").trim().toUpperCase();
    if (!isShippingCountry(country)) throw new Error("Select a supported shipping country.");
    const idempotencyKey = data.idempotencyKey?.trim() || null;

    let userId: string | null = null;
    try {
      const { getSessionUser } = await import("@/lib/auth/verify.server");
      const user = await getSessionUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    return withTransaction(async (sql) => {
      if (idempotencyKey) {
        const existing = await sql`
          select id, confirm_token, total_cents, shipping_cents
          from orders where idempotency_key = ${idempotencyKey} limit 1
        `;
        if (existing[0]) {
          const row = asJsonRow(existing[0]);
          return {
            orderId: String(row.id ?? ""),
            confirmToken: String(row.confirm_token ?? ""),
            totalCents: Number(row.total_cents ?? 0),
            shippingCents: Number(row.shipping_cents ?? 0),
          };
        }
      }

      const lines: Array<{
        variantId: string;
        productId: string;
        name: string;
        size: string;
        unit: number;
        quantity: number;
      }> = [];

      for (const item of data.items) {
        const qty = clampQty(item.quantity);
        if (qty < 1) throw new Error("Invalid quantity.");
        const rows = await sql`
          select v.id, v.product_id, v.size, v.inventory_quantity, v.price_override_cents,
                 p.name, p.price_cents
          from product_variants v
          join products p on p.id = v.product_id
          where v.id = ${item.variantId} and v.status = 'active' and p.status = 'published'
          limit 1
        `;
        const v = rows[0];
        if (!v) throw new Error("A selected size is no longer available.");
        const row = asJsonRow(v);
        const unit = row.price_override_cents == null ? Number(row.price_cents ?? 0) : Number(row.price_override_cents);
        lines.push({
          variantId: String(row.id ?? ""),
          productId: String(row.product_id ?? ""),
          name: String(row.name ?? ""),
          size: String(row.size ?? ""),
          unit,
          quantity: qty,
        });
      }

      for (const line of lines) {
        const taken = await sql`
          update product_variants
          set inventory_quantity = inventory_quantity - ${line.quantity}
          where id = ${line.variantId} and inventory_quantity >= ${line.quantity}
          returning id
        `;
        if (!taken[0]) {
          throw new Error(`${line.name} / ${line.size} does not have enough inventory.`);
        }
      }

      const subtotal = lines.reduce((n, l) => n + l.unit * l.quantity, 0);
      const shipping = shippingCents(subtotal);
      const total = subtotal + shipping;
      const orderId = uid("ord");
      const confirmToken = crypto.randomUUID();

      await sql`
        insert into orders (
          id, user_id, status, email, total_cents, shipping_cents,
          shipping_name, shipping_line1, shipping_city, shipping_region,
          shipping_postal, shipping_country, confirm_token, idempotency_key
        ) values (
          ${orderId}, ${userId}, 'placed', ${email}, ${total}, ${shipping},
          ${data.shippingName}, ${data.shippingLine1}, ${data.shippingCity},
          ${data.shippingRegion ?? null}, ${data.shippingPostal ?? null},
          ${country}, ${confirmToken}, ${idempotencyKey}
        )
      `;

      for (const line of lines) {
        await sql`
          insert into order_items (id, order_id, product_id, variant_id, name, size, unit_cents, quantity)
          values (${uid("itm")}, ${orderId}, ${line.productId}, ${line.variantId}, ${line.name}, ${line.size}, ${line.unit}, ${line.quantity})
        `;
      }

      if (userId) {
        await sql`delete from cart_items where user_id = ${userId}`;
      }

      return { orderId, confirmToken, totalCents: total, shippingCents: shipping };
    });
  });
