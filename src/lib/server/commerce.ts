import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed } from "./seed";
import { asJsonRow } from "@/lib/types";
import type { AddressCard, OrderSummary, WishlistCard } from "@/lib/types";
import { uid } from "@/lib/utils";
import {
  clampQty,
  isShippingCountry,
  isValidEmail,
  shippingCents,
  type ShippingCountry,
} from "@/lib/commerce-rules";

/**
 * Commerce server functions: cart-free checkout, order history, addresses and
 * the wishlist.
 *
 * Everything reachable here is treated as hostile input. Prices, shipping and
 * stock are always recomputed from the database inside the checkout
 * transaction — the client's numbers are a preview and nothing else.
 */

/** Input shapes are validated with plain predicates: this module has no zod
 * dependency in its import graph, and every field is a scalar or a small array
 * of scalars, so an explicit guard is both shorter and easier to audit than a
 * schema object. */

class InputError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

class ConflictError extends Error {
  readonly status = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * A validator that keeps the client-visible input type while still refusing a
 * non-object payload at runtime. The TS type is a convenience for the caller;
 * this check is the boundary.
 */
function requireShape<T>(label: string) {
  return (input: T): T => {
    if (!input || typeof input !== "object") throw new InputError(`${label} is required.`);
    return input;
  };
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalStr(value: unknown, max: number): string | null {
  const s = str(value, max);
  return s.length ? s : null;
}

/** A deliberate, pre-auth failure with a message safe to show a visitor. */
function fail(message: string, status = 400): Error {
  const err = new Error(message);
  (err as Error & { status?: number }).status = status;
  return err;
}

type OrderRow = {
  id: string;
  status: string;
  email: string | null;
  totalCents: number;
  shippingCents: number;
  createdAt: string;
  shippingName: string | null;
  shippingLine1: string | null;
  shippingCity: string | null;
  shippingRegion: string | null;
  shippingPostal: string | null;
  shippingCountry: string | null;
  items: {
    id: string;
    name: string;
    size: string;
    unitCents: number;
    quantity: number;
  }[];
};

function orderFromRow(row: object, items: unknown[]): OrderRow {
  const o = asJsonRow(row);
  return {
    id: String(o.id ?? ""),
    status: String(o.status ?? ""),
    email: o.email == null ? null : String(o.email),
    totalCents: Number(o.total_cents ?? 0),
    shippingCents: Number(o.shipping_cents ?? 0),
    createdAt: String(o.created_at ?? ""),
    shippingName: o.shipping_name == null ? null : String(o.shipping_name),
    shippingLine1: o.shipping_line1 == null ? null : String(o.shipping_line1),
    shippingCity: o.shipping_city == null ? null : String(o.shipping_city),
    shippingRegion: o.shipping_region == null ? null : String(o.shipping_region),
    shippingPostal: o.shipping_postal == null ? null : String(o.shipping_postal),
    shippingCountry: o.shipping_country == null ? null : String(o.shipping_country),
    items: items.map((it) => {
      const item = asJsonRow(it as object);
      return {
        id: String(item.id ?? ""),
        name: String(item.name ?? ""),
        size: String(item.size ?? ""),
        unitCents: Number(item.unit_cents ?? 0),
        quantity: Number(item.quantity ?? 0),
      };
    }),
  };
}

/** Order summary for lists — no address, which the account view does not show. */
function toSummary(order: OrderRow): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    email: order.email,
    totalCents: order.totalCents,
    shippingCents: order.shippingCents,
    createdAt: order.createdAt,
    items: order.items,
  };
}

/**
 * Load orders + their items in two queries rather than one per order.
 * The previous shape issued an `order_items` read inside the loop, which is an
 * N+1 that grows with order history length.
 */
async function loadOrders(
  sql: Sql,
  orders: object[],
): Promise<OrderRow[]> {
  if (!orders.length) return [];
  const ids = orders.map((o) => String(asJsonRow(o).id ?? ""));
  const itemRows = await sql`
    select * from order_items where order_id = any(${ids}::text[]) order by order_id, id
  `;
  const byOrder = new Map<string, object[]>();
  for (const row of itemRows) {
    const orderId = String(asJsonRow(row).order_id ?? "");
    const bucket = byOrder.get(orderId);
    if (bucket) bucket.push(row);
    else byOrder.set(orderId, [row]);
  }
  return orders.map((o) => {
    const id = String(asJsonRow(o).id ?? "");
    return orderFromRow(o, byOrder.get(id) ?? []);
  });
}

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OrderSummary[]> => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `;
    return (await loadOrders(sql, rows)).map(toSummary);
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => str(id, 64))
  .handler(async ({ context, data: id }) => {
    if (!id) return null;
    const sql = await getSql();
    // Ownership is part of the predicate, not a check that follows the read.
    const rows = await sql`
      select * from orders where id = ${id} and user_id = ${context.userId} limit 1
    `;
    if (!rows[0]) return null;
    const [order] = await loadOrders(sql, rows);
    return order ?? null;
  });

// ── addresses ───────────────────────────────────────────────────────────────

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

type AddressInput = {
  id?: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

export const saveAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(requireShape<AddressInput>("Address"))
  .handler(async ({ context, data }) => {
    const line1 = str(data.line1, 160);
    const city = str(data.city, 80);
    const line2 = optionalStr(data.line2, 160);
    const region = optionalStr(data.region, 80);
    const postalCode = optionalStr(data.postalCode, 24);
    const label = optionalStr(data.label, 40) ?? "Home";
    const id = optionalStr(data.id, 64);
    const country = (str(data.country, 2) || "US").toUpperCase();
    const isDefault = Boolean(data.isDefault);

    if (!line1 || !city) throw new InputError("Address is incomplete.");
    if (!isShippingCountry(country)) throw new InputError("Select a supported shipping country.");

    return withTransaction(async (sql) => {
      if (id) {
        // Ownership is proven before anything is mutated. An address that does
        // not belong to the caller is indistinguishable from one that does not
        // exist, so the id space cannot be probed.
        const owned = await sql`
          select id from addresses where id = ${id} and user_id = ${context.userId} limit 1
        `;
        if (!owned[0]) throw fail("Address not found.", 404);

        if (isDefault) {
          await sql`
            update addresses set is_default = false
            where user_id = ${context.userId} and id <> ${id}
          `;
        }
        await sql`
          update addresses set
            label = ${label},
            line1 = ${line1},
            line2 = ${line2},
            city = ${city},
            region = ${region},
            postal_code = ${postalCode},
            country = ${country},
            is_default = ${isDefault}
          where id = ${id} and user_id = ${context.userId}
        `;
        return { id };
      }

      const newId = uid("adr");
      if (isDefault) {
        await sql`update addresses set is_default = false where user_id = ${context.userId}`;
      }
      await sql`
        insert into addresses (id, user_id, label, line1, line2, city, region, postal_code, country, is_default)
        values (
          ${newId}, ${context.userId}, ${label}, ${line1}, ${line2},
          ${city}, ${region}, ${postalCode}, ${country}, ${isDefault}
        )
      `;
      return { id: newId };
    });
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => str(id, 64))
  .handler(async ({ context, data: id }) => {
    if (!id) throw new InputError("Address is required.");
    const sql = await getSql();
    const deleted = await sql`
      delete from addresses where id = ${id} and user_id = ${context.userId} returning id
    `;
    if (!deleted[0]) throw fail("Address not found.", 404);
    return { ok: true };
  });

export const setDefaultAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => str(id, 64))
  .handler(async ({ context, data: id }) => {
    if (!id) throw new InputError("Address is required.");
    return withTransaction(async (sql) => {
      const owned = await sql`
        select id from addresses where id = ${id} and user_id = ${context.userId} limit 1
      `;
      if (!owned[0]) throw fail("Address not found.", 404);
      await sql`update addresses set is_default = false where user_id = ${context.userId}`;
      await sql`
        update addresses set is_default = true
        where id = ${id} and user_id = ${context.userId}
      `;
      return { ok: true };
    });
  });

// ── wishlist ────────────────────────────────────────────────────────────────

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
      where w.user_id = ${context.userId} and p.status = 'published'
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
  .validator((productId: string) => str(productId, 64))
  .handler(async ({ context, data: productId }) => {
    if (!productId) throw new InputError("Product is required.");
    // The toggle is a read-then-write, so it runs in a transaction: two rapid
    // taps must not both observe "not saved" and insert, nor both observe
    // "saved" and delete a row they did not create.
    return withTransaction(async (sql) => {
      const exists = await sql`
        select id from products where id = ${productId} and status = 'published' limit 1
      `;
      if (!exists[0]) throw fail("Product not found.", 404);

      const removed = await sql`
        delete from wishlist_items
        where user_id = ${context.userId} and product_id = ${productId}
        returning product_id
      `;
      if (removed[0]) return { saved: false };

      await sql`
        insert into wishlist_items (user_id, product_id)
        values (${context.userId}, ${productId})
        on conflict (user_id, product_id) do nothing
      `;
      return { saved: true };
    });
  });

// ── order confirmation ──────────────────────────────────────────────────────

/**
 * Guest-safe order lookup by confirmation token.
 *
 * The token is a v4 UUID issued at checkout and stored uniquely, so an order is
 * only reachable by whoever holds the link the studio handed them — a
 * sequential or guessable order id never exposes another visitor's purchase.
 * The response deliberately omits nothing the buyer already knows (their own
 * address and email) but is never used for a signed-in lookup path.
 */
export const getOrderByToken = createServerFn({ method: "GET" })
  .validator((token: string) => str(token, 64))
  .handler(async ({ data: token }) => {
    // 16 hex characters is the floor of the generated v4 UUID format.
    if (!/^[0-9a-fA-F-]{16,64}$/.test(token)) return null;
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql`
      select * from orders where confirm_token = ${token} limit 1
    `;
    if (!rows[0]) return null;
    const [order] = await loadOrders(sql, rows);
    return order ?? null;
  });

type CheckoutItem = { variantId: string; quantity: unknown };

type CheckoutInput = {
  email: string;
  items: CheckoutItem[];
  shippingName: string;
  shippingLine1: string;
  shippingCity: string;
  shippingRegion?: string;
  shippingPostal?: string;
  shippingCountry?: string;
  idempotencyKey?: string;
};

export const placeOrder = createServerFn({ method: "POST" })
  .validator((input: CheckoutInput) => {
    if (!input || typeof input !== "object") throw new InputError("Checkout payload is required.");
    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new InputError("Bag is empty.");
    }
    if (input.items.length > 24) throw new InputError("Too many lines for one order.");
    return input;
  })
  .handler(async ({ data }) => {
    await ensureSeed();

    const email = str(data.email, 180).toLowerCase();
    if (!isValidEmail(email)) throw new InputError("Enter a valid email.");

    const shippingName = str(data.shippingName, 120);
    const shippingLine1 = str(data.shippingLine1, 160);
    const shippingCity = str(data.shippingCity, 80);
    const shippingRegion = optionalStr(data.shippingRegion, 80);
    const shippingPostal = optionalStr(data.shippingPostal, 24);
    if (!shippingName || !shippingLine1 || !shippingCity) {
      throw new InputError("Shipping address is incomplete.");
    }
    const countryInput = str(data.shippingCountry, 2).toUpperCase();
    if (!isShippingCountry(countryInput)) throw new InputError("Select a supported shipping country.");

    const idempotencyKey = optionalStr(data.idempotencyKey, 80);

    let userId: string | null = null;
    try {
      const { getSessionUser } = await import("@/lib/auth/verify.server");
      const user = await getSessionUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }
    // Scope keys to the actor. A key generated on another machine can never
    // resolve to somebody else's order.
    const idempotencyScope = userId ? `user:${userId}` : `guest:${email}`;

    return withTransaction(async (sql) => {
      if (idempotencyKey) {
        const existing = await sql`
          select id, confirm_token, total_cents, shipping_cents
          from orders
          where idempotency_key = ${idempotencyKey} and idempotency_scope = ${idempotencyScope}
          limit 1
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

      // Collapse duplicate variants in the payload so one cart line cannot be
      // split across two rows that each pass their own stock check.
      const wanted = new Map<string, number>();
      for (const item of data.items) {
        const variantId = str(item?.variantId, 64);
        if (!variantId) throw new InputError("A bag line is missing its size.");
        const qty = clampQty(item?.quantity);
        if (qty < 1) throw new InputError("Invalid quantity.");
        wanted.set(variantId, Math.min(8, (wanted.get(variantId) ?? 0) + qty));
      }

      type Line = {
        variantId: string;
        productId: string;
        name: string;
        size: string;
        unit: number;
        quantity: number;
      };
      const lines: Line[] = [];

      for (const [variantId, quantity] of wanted) {
        const rows = await sql`
          select v.id, v.product_id, v.size, v.inventory_quantity, v.price_override_cents,
                 p.name, p.price_cents
          from product_variants v
          join products p on p.id = v.product_id
          where v.id = ${variantId}
            and v.status = 'active'
            and p.status = 'published'
          limit 1
        `;
        const v = rows[0];
        if (!v) throw new ConflictError("A selected size is no longer available.");
        const row = asJsonRow(v);
        // Server-authoritative pricing: never the client's number.
        const unit =
          row.price_override_cents == null
            ? Number(row.price_cents ?? 0)
            : Number(row.price_override_cents);
        lines.push({
          variantId: String(row.id ?? ""),
          productId: String(row.product_id ?? ""),
          name: String(row.name ?? ""),
          size: String(row.size ?? ""),
          unit,
          quantity,
        });
      }

      // Reserve stock first. `inventory_quantity >= n` in the WHERE clause makes
      // the decrement conditional, and `returning` proves it applied — a row
      // that another checkout already drained simply does not come back, and
      // the whole transaction rolls back.
      for (const line of lines) {
        const taken = await sql`
          update product_variants
          set inventory_quantity = inventory_quantity - ${line.quantity}
          where id = ${line.variantId} and inventory_quantity >= ${line.quantity}
          returning inventory_quantity
        `;
        if (!taken[0]) {
          throw new ConflictError(
            `${line.name} / ${line.size} does not have enough inventory.`,
          );
        }
      }

      const subtotal = lines.reduce((n, l) => n + l.unit * l.quantity, 0);
      // Recomputed here, from the server's own subtotal, in the same
      // transaction — the client's preview is never the charged amount.
      const shipping = shippingCents(subtotal);
      const total = subtotal + shipping;
      const orderId = uid("ord");
      const confirmToken = crypto.randomUUID();

      await sql`
        insert into orders (
          id, user_id, status, email, total_cents, shipping_cents,
          shipping_name, shipping_line1, shipping_city, shipping_region,
          shipping_postal, shipping_country, confirm_token, idempotency_key,
          idempotency_scope
        ) values (
          ${orderId}, ${userId}, 'placed', ${email}, ${total}, ${shipping},
          ${shippingName}, ${shippingLine1}, ${shippingCity},
          ${shippingRegion}, ${shippingPostal}, ${countryInput},
          ${confirmToken}, ${idempotencyKey}, ${idempotencyKey ? idempotencyScope : null}
        )
      `;

      for (const line of lines) {
        await sql`
          insert into order_items (id, order_id, product_id, variant_id, name, size, unit_cents, quantity)
          values (${uid("itm")}, ${orderId}, ${line.productId}, ${line.variantId},
                  ${line.name}, ${line.size}, ${line.unit}, ${line.quantity})
        `;
      }

      // Only cleared after the order is fully written.
      if (userId) {
        await sql`delete from cart_items where user_id = ${userId}`;
      }

      return { orderId, confirmToken, totalCents: total, shippingCents: shipping };
    });
  });

/** Exported for the checkout preview and tests: the same table the server uses. */
export type { ShippingCountry };
