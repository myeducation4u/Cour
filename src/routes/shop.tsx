import { createFileRoute } from "@tanstack/react-router";
import { ProductTile } from "@/components/site/product-card";
import { SiteShell } from "@/components/site/shell";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/shop")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Shop — COUR" }] }),
  component: Shop,
});

function Shop() {
  const store = Route.useLoaderData();
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <p className="cour-label">CATALOG</p>
        <h1 className="cour-display mt-3 text-[clamp(2.4rem,6vw,4.2rem)]">SHOP.</h1>
        <p className="mt-3 max-w-xl text-sm text-mist">
          Five jackets. Same inspection language. Choose a colorway, a size, then the bag.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {store.products.map((p, i) => (
            <ProductTile key={p.id} product={p} index={i} />
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
