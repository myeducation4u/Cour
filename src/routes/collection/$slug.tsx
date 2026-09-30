import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductTile } from "@/components/site/product-card";
import { SiteShell } from "@/components/site/shell";
import { getCollectionBySlug, getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/collection/$slug")({
  loader: async ({ params }) => {
    const [collection, store] = await Promise.all([
      getCollectionBySlug({ data: params.slug }),
      getStorefront(),
    ]);
    return { collection, store };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.collection?.collection.name ?? "Collection"} — COUR` }],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, store } = Route.useLoaderData();
  if (!collection) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center">
          <h1 className="cour-display text-3xl">NO COLLECTION.</h1>
          <Link to="/shop" className="cour-btn mt-6">
            SHOP
          </Link>
        </main>
      </SiteShell>
    );
  }
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="cour-label">COLLECTION</p>
          <h1 className="cour-display mt-3 text-[clamp(2.4rem,6vw,4.2rem)]">
            {collection.collection.name}.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-mist">{collection.collection.description}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collection.products.map((p, i) => (
              <ProductTile key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
