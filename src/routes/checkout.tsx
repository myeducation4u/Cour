import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { placeOrder } from "@/lib/server/commerce";
import { getStorefront } from "@/lib/server/storefront";
import { bagTotal, useBag } from "@/lib/store/bag";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { shippingCents } from "@/lib/commerce-rules";

export const Route = createFileRoute("/checkout")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Checkout — COUR" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const store = Route.useLoaderData();
  const user = useCurrentUser();
  const items = useBag((s) => s.items);
  const clear = useBag((s) => s.clear);
  const navigate = useNavigate();
  const total = bagTotal(items);
  const shipping = shippingCents(total);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());
  const [form, setForm] = useState({
    email: user?.primaryEmail ?? "",
    shippingName: "",
    shippingLine1: "",
    shippingCity: "",
    shippingRegion: "",
    shippingPostal: "",
    shippingCountry: "US",
  });

  if (items.length === 0) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center">
          <h1 className="cour-display text-3xl">NOTHING TO CHECK OUT.</h1>
          <Link to="/shop" className="cour-btn mt-6">
            SHOP
          </Link>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            setBusy(true);
            setError(null);
            try {
              const res = await placeOrder({
                data: {
                  ...form,
                  items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
                  idempotencyKey: idempotencyKey.current,
                },
              });
              clear();
              await navigate({ to: "/order/$token", params: { token: res.confirmToken } });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Checkout failed.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="cour-label">CHECKOUT</p>
          <h1 className="cour-display text-4xl">PLACE ORDER.</h1>
          <p className="text-sm text-mist">
            Orders are recorded against studio inventory. Payment is confirmed by the studio after
            placement — no card is charged in the browser.
          </p>
          {(
            [
              ["email", "EMAIL", "email"],
              ["shippingName", "NAME", "text"],
              ["shippingLine1", "ADDRESS", "text"],
              ["shippingCity", "CITY", "text"],
              ["shippingRegion", "REGION", "text"],
              ["shippingPostal", "POSTAL CODE", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="cour-label">{label}</span>
              <input
                className="cour-field mt-1"
                type={type}
                required={key !== "shippingRegion"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="block">
            <span className="cour-label">COUNTRY</span>
            <select
              className="cour-field mt-1"
              value={form.shippingCountry}
              onChange={(e) => setForm({ ...form, shippingCountry: e.target.value })}
            >
              <option value="US">UNITED STATES</option>
              <option value="CA">CANADA</option>
              <option value="GB">UNITED KINGDOM</option>
              <option value="DE">GERMANY</option>
              <option value="FR">FRANCE</option>
              <option value="AU">AUSTRALIA</option>
              <option value="JP">JAPAN</option>
            </select>
          </label>
          {error ? (
            <p className="text-sm text-mist" role="alert">
              {error}
            </p>
          ) : null}
          <button className="cour-btn cour-btn-solid" type="submit" disabled={busy}>
            {busy ? "PLACING" : "PLACE ORDER"}
          </button>
        </form>
        <aside className="border border-line p-4">
          {items.map((item) => (
            <div key={item.variantId} className="mb-3 flex justify-between gap-3 text-sm">
              <span>
                {item.name} / {item.size} × {item.quantity}
              </span>
              <span className="font-mono">{money(item.priceCents * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t border-line pt-3 font-mono text-sm">
            <span>SHIPPING</span>
            <span>{shipping === 0 ? "STUDIO COVERED" : money(shipping)}</span>
          </div>
          <div className="mt-2 flex justify-between font-mono">
            <span>TOTAL</span>
            <span>{money(total + shipping)}</span>
          </div>
        </aside>
      </main>
    </SiteShell>
  );
}
