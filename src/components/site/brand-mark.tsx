import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * The COUR mark.
 *
 * Reconstructed from the reference frames rather than substituted from an icon
 * set. The observable geometry is a dense condensed wordmark sitting on a thin
 * rule, led by an angular mitered "C" that is drawn as a path — the letterform
 * is the one piece of the mark the display face cannot supply, because the
 * reference C is squared off rather than round.
 *
 * Two variants:
 *   - default: the full mark, for the header and the footer
 *   - `compact`: glyph + rule only, for tight chrome
 *
 * The rule is drawn at `em` scale so the whole mark scales as one object and
 * cannot drift out of alignment at small sizes.
 */
export function BrandMark({
  className,
  to = "/",
  compact = false,
}: {
  className?: string;
  to?: "/";
  compact?: boolean;
}) {
  return (
    <Link to={to} className={cn("cour-mark", className)} aria-label="COUR — home">
      <span className="cour-mark-row">
        <svg
          className="cour-mark-glyph"
          viewBox="0 0 12 18"
          aria-hidden="true"
          focusable="false"
        >
          {/* Mitered C: two horizontal arms and a left stem, cut on the bias. */}
          <path d="M11.2 0.9 -0.2 0.9 2.2 4.3 8.1 4.3 8.1 13.7 2.2 13.7 -0.2 17.1 11.2 17.1Z" />
          {/* The diagonal accent that crosses the mark in the reference. */}
          <path d="M9.6 4.3 6.4 13.7 8.9 13.7 12 4.3Z" className="cour-mark-slash" />
        </svg>
        {compact ? null : <span className="cour-mark-word">COUR</span>}
      </span>
      <span className="cour-mark-rule" aria-hidden="true" />
    </Link>
  );
}

/** The wordmark alone, for places that already show the glyph. */
export function BrandWord({ className }: { className?: string }) {
  return <span className={cn("cour-wordmark", className)}>COUR</span>;
}
