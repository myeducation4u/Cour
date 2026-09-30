import { Link } from "@tanstack/react-router";
import { money } from "@/lib/format";
import type { ProductCard } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The product tile, used by the shop, the collection page, search and the
 * homepage's COLLECTIONS rail.
 *
 * Two presentations share one component so the catalogue never drifts into a
 * different visual language than the stage:
 *
 *   - `stage` — the homepage rail. Tighter, image-led, hover swaps the tag block
 *     for the SHOP NOW control in place (the foot is a fixed-height box, so the
 *     reveal never reflows the card).
 *   - `page` — the shop/search grid. Adds the stock state and a description.
 */

const TAGS: Record<string, [string, string]> = {
  "shadow-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"],
  "tactical-hooded": ["LAYERING PIECE", "UTILITY"],
  "thermal-bomber": ["THERMAL INSULATION", "WINDPROOF"],
  "tech-shell": ["WATER-RESISTANT", "BREATHABLE"],
  "void-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"],
};

const STOCK_LABEL: Record<ProductCard["availability"], string> = {
  in: "IN STUDIO",
  low: "LOW STOCK",
  out: "SOLD OUT",
};

export function ProductTile({
  product,
  index,
  interactive = true,
  variant = "page",
}: {
  product: ProductCard;
  index: number;
  /** False while the homepage layer is mid-transition: hover affordances and
   *  the tab stop follow the timeline, not the DOM's static order. */
  interactive?: boolean;
  variant?: "stage" | "page";
}) {
  const tags = TAGS[product.slug] ?? ["OVERSIZED FIT", "LIMITED QUANTITY"];
  const soldOut = product.availability === "out";

  return (
    <article className={cn("cour-tile", `cour-tile-${variant}`, soldOut && "is-out")}>
      <div className="cour-tile-head">
        <div>
          <p className="cour-tile-idx">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="cour-tile-name">{product.name}</h3>
        </div>
        <div className="cour-tile-buy">
          <p className="cour-tile-price">{money(product.priceCents)}</p>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="cour-plus"
            aria-label={`View ${product.name}`}
            tabIndex={interactive ? undefined : -1}
          >
            <span aria-hidden="true">+</span>
          </Link>
        </div>
      </div>

      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="cour-tile-shot"
        tabIndex={interactive ? undefined : -1}
      >
        <img
          src={product.image}
          alt={product.name}
          width={640}
          height={800}
          loading={variant === "stage" ? "lazy" : "eager"}
          decoding="async"
        />
      </Link>

      <div className="cour-tile-foot">
        <p className="cour-tile-tags">
          {tags[0]}
          <br />
          {tags[1]}
        </p>
        <span className="cour-tile-shop" aria-hidden="true">
          {soldOut ? "SOLD OUT" : "SHOP NOW"} <span aria-hidden="true">→</span>
        </span>
      </div>

      {variant === "page" ? (
        <p className={cn("cour-tile-stock", `is-${product.availability}`)}>
          <span className="cour-tile-dot" aria-hidden="true" />
          {STOCK_LABEL[product.availability]}
        </p>
      ) : null}
    </article>
  );
}
