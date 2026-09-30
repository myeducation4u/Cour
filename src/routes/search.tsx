import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductTile } from "@/components/site/product-card";
import { SiteShell } from "@/components/site/shell";
import { getStorefront, searchProducts } from "@/lib/server/storefront";
import type { ProductCard } from "@/lib/types";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = typeof search.q === "string" ? search.q.slice(0, 80) : "";
    return q ? { q } : {};
  },
  loaderDeps: ({ search }) => ({ q: search.q ?? "" }),
  loader: async ({ deps: { q } }): Promise<{ store: Awaited<ReturnType<typeof getStorefront>>; results: ProductCard[]; q: string }> => {
    const store = await getStorefront();
    const results = q.trim() ? await searchProducts({ data: q }) : store.products;
    return { store, results, q };
  },
  head: () => ({ meta: [{ title: "Search — COUR" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { store, results, q: urlQ } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/search" });
  const [q, setQ] = useState(urlQ);

  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (q === urlQ) return;
      void navigate({ search: q.trim() ? { q } : {}, replace: true });
    }, 220);
    return () => window.clearTimeout(id);
  }, [q, urlQ, navigate]);

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h1 className="cour-display text-4xl">SEARCH.</h1>
        <input
          className="cour-field mt-6 max-w-xl"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="JACKET / COLOR / MATERIAL"
          aria-label="Search jackets"
        />
        {urlQ.trim() && results.length === 0 ? (
          <p className="mt-8 text-sm text-mist" role="status">
            No jackets match that search.
          </p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <ProductTile key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
