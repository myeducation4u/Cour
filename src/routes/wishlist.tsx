import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { listWishlist } from "@/lib/server/commerce";
import { getStorefront } from "@/lib/server/storefront";
import type { WishlistCard } from "@/lib/types";

export const Route = createFileRoute("/wishlist")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Wishlist — COUR" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const store = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<WishlistCard[]>([]);

  useEffect(() => {
    if (!user) return;
    listWishlist()
      .then(setRows)
      .catch(() => setRows([]));
  }, [user]);

  if (isPending) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center font-mono text-sm text-mist">LOADING</main>
      </SiteShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <h1 className="cour-display text-4xl">WISHLIST.</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {rows.map((w) => (
            <Link key={w.id} to="/product/$slug" params={{ slug: w.slug }} className="border border-line p-3">
              <img src={w.image} alt="" className="h-40 w-full object-contain" />
              <p className="mt-2 text-sm">{w.name}</p>
              <p className="font-mono">{money(w.priceCents)}</p>
            </Link>
          ))}
        </div>
        {rows.length === 0 ? <p className="mt-8 text-sm text-mist">Nothing saved yet.</p> : null}
      </main>
    </SiteShell>
  );
}
