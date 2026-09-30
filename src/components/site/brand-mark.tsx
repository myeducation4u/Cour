import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  to = "/",
}: {
  className?: string;
  to?: "/";
}) {
  return (
    <Link to={to} className={cn("cour-mark", className)} aria-label="COUR home">
      <svg viewBox="0 0 32 32" className="cour-mark-badge" aria-hidden="true">
        <rect x="1.2" y="1.2" width="29.6" height="29.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M23.5 8.2 H11.2 V23.8 H23.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinejoin="miter"
        />
      </svg>
      <span>COUR</span>
    </Link>
  );
}
