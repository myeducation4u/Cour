import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/shell";
import { money } from "@/lib/format";
import { getProductBySlug, getStorefront } from "@/lib/server/storefront";
import { toggleWishlist } from "@/lib/server/commerce";
import { useBag } from "@/lib/store/bag";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const [detail, store] = await Promise.all([
      getProductBySlug({ data: params.slug }),
      getStorefront(),
    ]);
    return { detail, store };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.detail?.product.seoTitle ?? loaderData?.detail?.product.name ?? "COUR",
      },
      {
        name: "description",
        content:
          loaderData?.detail?.product.seoDescription ??
          loaderData?.detail?.product.description ??
          "",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { detail, store } = Route.useLoaderData();
  const add = useBag((s) => s.add);
  const { user } = useCurrentUserState();
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState<string | null>(null);
  const variants = detail?.variants ?? [];
  const firstSize = variants.find((v) => v.availability !== "out")?.size ?? variants[0]?.size ?? "M";
  const [size, setSize] = useState(firstSize);
  const variant = useMemo(
    () => variants.find((v) => v.size === size) ?? variants[0],
    [variants, size],
  );

  if (!detail) {
    return (
      <SiteShell settings={store.settings} navigation={store.navigation}>
        <main className="px-6 py-24 text-center">
          <h1 className="cour-display text-3xl">NOT IN THE LINE.</h1>
          <Link to="/shop" className="cour-btn mt-6">
            RETURN TO SHOP
          </Link>
        </main>
      </SiteShell>
    );
  }

  const { product } = detail;
  const price = variant?.priceOverrideCents ?? product.priceCents;

  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="border border-line bg-surface p-6 [perspective:1200px]">
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={1120}
            fetchPriority="high"
            decoding="async"
            className="cour-inspect mx-auto h-[min(70vh,620px)] w-full object-contain"
          />
        </div>
        <div>
          <p className="cour-label">{product.colorName}</p>
          <h1 className="cour-display mt-3 text-[clamp(2rem,5vw,3.4rem)]">{product.name}</h1>
          <p className="mt-3 font-mono text-lg">{money(price)}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">{product.description}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-dim">{product.story}</p>

          <fieldset className="mt-8">
            <legend className="cour-label">SIZE</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  disabled={v.availability === "out"}
                  onClick={() => setSize(v.size)}
                  className={`min-h-11 min-w-11 border px-3 font-mono text-[0.7rem] ${
                    v.size === size ? "border-ink bg-ink text-void" : "border-line text-ink"
                  } disabled:opacity-30`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.58rem] tracking-[0.12em] text-dim">
              {variant
                ? variant.availability === "out"
                  ? "SOLD OUT"
                  : variant.availability === "low"
                    ? "LOW STOCK"
                    : "IN STUDIO"
                : "UNAVAILABLE"}
            </p>
          </fieldset>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="cour-btn cour-btn-solid"
              disabled={!variant || variant.availability === "out"}
              onClick={() => {
                if (!variant) return;
                add({
                  productId: product.id,
                  variantId: variant.id,
                  slug: product.slug,
                  name: product.name,
                  size: variant.size,
                  priceCents: price,
                  image: product.image,
                });
                setAdded(true);
              }}
            >
              {added ? "IN THE BAG" : "ADD TO BAG"}
            </button>
            <button
              type="button"
              className="cour-btn"
              onClick={async () => {
                if (!user) {
                  window.location.assign("/login");
                  return;
                }
                const res = await toggleWishlist({ data: product.id });
                setWish(res.saved ? "SAVED" : "REMOVED");
              }}
            >
              {wish ?? "WISHLIST"}
            </button>
          </div>

          <dl className="mt-10 grid gap-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="cour-label">FIT</dt>
              <dd className="mt-1 text-mist">{product.fit}</dd>
            </div>
            <div>
              <dt className="cour-label">MATERIAL</dt>
              <dd className="mt-1 text-mist">{product.material}</dd>
            </div>
            <div>
              <dt className="cour-label">CARE</dt>
              <dd className="mt-1 text-mist">{product.care}</dd>
            </div>
          </dl>
        </div>
      </main>
    </SiteShell>
  );
}
