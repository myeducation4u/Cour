import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { getStorefront } from "@/lib/server/storefront";
import { bagTotal, useBag } from "@/lib/store/bag";

export const Route = createFileRoute("/cart")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Bag — COUR" }] }),
  component: CartPage,
});

function CartPage() {
  const store = Route.useLoaderData();
  const items = useBag((s) => s.items);
  const setQty = useBag((s) => s.setQty);
  const remove = useBag((s) => s.remove);
  const total = bagTotal(items);

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <p className="cour-label">BAG</p>
        <h1 className="cour-display mt-2 text-4xl">CART.</h1>
        {items.length === 0 ? (
          <div className="mt-10 border border-line p-8">
            <p className="text-mist">The bag is empty.</p>
            <Link to="/shop" className="cour-btn mt-6">
              INSPECT THE LINE
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-wrap items-center gap-4 border border-line p-3"
              >
                <img src={item.image} alt="" className="h-20 w-20 object-contain" />
                <div className="min-w-40 flex-1">
                  <p className="text-sm tracking-[0.06em]">{item.name}</p>
                  <p className="font-mono text-[0.62rem] text-mist">SIZE {item.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-9 w-9 border border-line"
                    onClick={() => setQty(item.variantId, item.quantity - 1)}
                  >
                    –
                  </button>
                  <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="h-9 w-9 border border-line"
                    onClick={() => setQty(item.variantId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right font-mono text-sm">
                  {money(item.priceCents * item.quantity)}
                </p>
                <button
                  type="button"
                  className="font-mono text-[0.58rem] tracking-[0.14em] text-mist"
                  onClick={() => remove(item.variantId)}
                >
                  REMOVE
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-line pt-4">
              <p className="cour-label">TOTAL</p>
              <p className="font-mono text-lg">{money(total)}</p>
            </div>
            <Link to="/checkout" className="cour-btn cour-btn-solid">
              CHECKOUT
            </Link>
          </div>
        )}
      </main>
    </SiteShell>
  );
}
