import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { getOrderByToken } from "@/lib/server/commerce";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/order/$token")({
  loader: async ({ params }) => {
    const [order, store] = await Promise.all([getOrderByToken({ data: params.token }), getStorefront()]);
    return { order, store };
  },
  head: () => ({ meta: [{ title: "Order confirmed — COUR" }] }),
  component: OrderConfirm,
});

function OrderConfirm() {
  const { order, store } = Route.useLoaderData();
  if (!order) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center">
          <h1 className="cour-display text-3xl">ORDER NOT FOUND.</h1>
          <Link to="/shop" className="cour-btn mt-6">
            SHOP
          </Link>
        </main>
      </SiteShell>
    );
  }
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <p className="cour-label">CONFIRMED</p>
        <h1 className="cour-display mt-3 text-4xl">ORDER PLACED.</h1>
        <p className="mt-3 text-sm text-mist">
          Reference {order.id}. The studio will confirm payment and dispatch separately.
        </p>
        <dl className="mt-8 space-y-2 font-mono text-[0.7rem] tracking-[0.08em]">
          <div className="flex justify-between gap-4">
            <dt className="text-dim">STATUS</dt>
            <dd>{order.status.toUpperCase()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dim">SHIPPING</dt>
            <dd>{order.shippingCents === 0 ? "STUDIO COVERED" : money(order.shippingCents)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-dim">TOTAL</dt>
            <dd>{money(order.totalCents)}</dd>
          </div>
        </dl>
        <ul className="mt-8 border-t border-line pt-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 py-2 text-sm">
              <span>
                {item.name} / {item.size} × {item.quantity}
              </span>
              <span className="font-mono">{money(item.unitCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        {order.shippingLine1 ? (
          <p className="mt-6 text-sm text-mist">
            {order.shippingName}
            <br />
            {order.shippingLine1}
            <br />
            {order.shippingCity}
          </p>
        ) : null}
        <Link to="/shop" className="cour-btn mt-10">
          CONTINUE
        </Link>
      </main>
    </SiteShell>
  );
}
