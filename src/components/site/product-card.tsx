import { Link } from "@tanstack/react-router";
import { money } from "@/lib/format";
import type { ProductCard } from "@/lib/types";

const TAGS: Record<string, [string, string]> = {
  "shadow-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"],
  "tactical-hooded": ["LAYERING PIECE", "UTILITY"],
  "thermal-bomber": ["THERMAL INSULATION", "WINDPROOF"],
  "tech-shell": ["WATER-RESISTANT", "BREATHABLE"],
  "void-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"],
};

export function ProductTile({
  product,
  index,
}: {
  product: ProductCard;
  index: number;
}) {
  const tags = TAGS[product.slug] ?? ["OVERSIZED FIT", "LIMITED QUANTITY"];
  return (
    <article className="cour-tile group">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="cour-tile-idx">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="cour-tile-name">{product.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-mono text-[0.68rem] tracking-[0.04em] text-ink">{money(product.priceCents)}</p>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="cour-plus"
            aria-label={`Open ${product.name}`}
          >
            +
          </Link>
        </div>
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="cour-tile-shot">
        <img
          src={product.image}
          alt={product.name}
          width={640}
          height={800}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="cour-tile-foot">
        <p className="cour-tile-tags">
          {tags[0]}
          <br />
          {tags[1]}
        </p>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="cour-tile-shop">
          SHOP NOW
        </Link>
      </div>
    </article>
  );
}
