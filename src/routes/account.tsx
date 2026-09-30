import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { listMyOrders, saveAddress, listMyAddresses, listWishlist } from "@/lib/server/commerce";
import { getStorefront } from "@/lib/server/storefront";
import type { AddressCard, OrderSummary, WishlistCard } from "@/lib/types";

export const Route = createFileRoute("/account")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Account — COUR" }] }),
  component: AccountPage,
});

function AccountPage() {
  const store = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addresses, setAddresses] = useState<AddressCard[]>([]);
  const [wishes, setWishes] = useState<WishlistCard[]>([]);
  const [tab, setTab] = useState<"orders" | "addresses" | "saved">("orders");
  const [addr, setAddr] = useState({
    label: "Home",
    line1: "",
    city: "",
    region: "",
    postalCode: "",
    country: "US",
  });
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
    listMyAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]));
    listWishlist()
      .then(setWishes)
      .catch(() => setWishes([]));
  }, [user]);

  if (isPending) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center font-mono text-sm text-mist">LOADING SESSION</main>
      </SiteShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <p className="cour-label">CLIENT</p>
        <h1 className="cour-display mt-2 text-4xl">ACCOUNT.</h1>
        <p className="mt-2 text-sm text-mist">{user.primaryEmail ?? user.displayName}</p>
        <div className="mt-4 flex gap-2">
          <Link to="/admin" className="cour-btn h-9 min-h-9 text-[0.58rem]">
            STUDIO CMS
          </Link>
        </div>
        <div className="mt-8 flex gap-2">
          {(["orders", "addresses", "saved"] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`cour-btn h-9 min-h-9 ${tab === id ? "cour-btn-solid" : ""}`}
              onClick={() => setTab(id)}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "orders" ? (
          <div className="mt-8 space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-mist">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <article key={order.id} className="border border-line p-4">
                  <div className="flex flex-wrap justify-between gap-2 font-mono text-[0.7rem]">
                    <span>{order.id}</span>
                    <span className="text-mist">{order.status.toUpperCase()}</span>
                    <span>{money(order.totalCents)}</span>
                  </div>
                  <ul className="mt-3 text-sm text-mist">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} / {item.size} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </article>
              ))
            )}
          </div>
        ) : null}

        {tab === "addresses" ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <form
              className="space-y-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await saveAddress({ data: addr });
                setNote("Address saved.");
                setAddresses(await listMyAddresses());
              }}
            >
              {(["label", "line1", "city", "region", "postalCode"] as const).map((key) => (
                <input
                  key={key}
                  className="cour-field"
                  placeholder={key.toUpperCase()}
                  value={addr[key]}
                  onChange={(e) => setAddr({ ...addr, [key]: e.target.value })}
                  required={key === "line1" || key === "city"}
                />
              ))}
              <select
                className="cour-field"
                value={addr.country}
                onChange={(e) => setAddr({ ...addr, country: e.target.value })}
                aria-label="Country"
              >
                <option value="US">UNITED STATES</option>
                <option value="CA">CANADA</option>
                <option value="GB">UNITED KINGDOM</option>
                <option value="DE">GERMANY</option>
                <option value="FR">FRANCE</option>
                <option value="AU">AUSTRALIA</option>
                <option value="JP">JAPAN</option>
              </select>
              <button className="cour-btn" type="submit">
                SAVE ADDRESS
              </button>
              {note ? <p className="text-sm text-mist">{note}</p> : null}
            </form>
            <div className="space-y-2">
              {addresses.map((a) => (
                <div key={a.id} className="border border-line p-3 text-sm">
                  <p>{a.label ?? ""}</p>
                  <p className="text-mist">
                    {a.line1} / {a.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "saved" ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {wishes.map((w) => (
              <Link key={w.id} to="/product/$slug" params={{ slug: w.slug }} className="border border-line p-3">
                <img src={w.image} alt="" className="h-32 w-full object-contain" />
                <p className="mt-2 text-sm">{w.name}</p>
                <p className="font-mono text-sm">{money(w.priceCents)}</p>
              </Link>
            ))}
            {wishes.length === 0 ? <p className="text-sm text-mist">Nothing saved.</p> : null}
          </div>
        ) : null}
      </main>
    </SiteShell>
  );
}
