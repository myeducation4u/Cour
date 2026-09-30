import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { bagCount, useBag } from "@/lib/store/bag";
import { BrandMark } from "@/components/site/brand-mark";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SiteNav({
  items,
  overlay = false,
  variant = "page",
}: {
  items: NavItem[];
  overlay?: boolean;
  variant?: "hero" | "page";
}) {
  const header = items.filter((i) => i.location === "header");
  const count = useBag((s) => bagCount(s.items));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("cour-nav", overlay && "is-overlay")}>
      <BrandMark />

      <nav className="cour-nav-links">
        {header.map((item) => (
          <Link
            key={item.id}
            to={item.href as "/"}
            className={cn("cour-nav-link", pathname === item.href && "is-on")}
          >
            {item.label}
            {item.label === "COLLECTIONS" ? <span className="cour-chevron" aria-hidden="true" /> : null}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {variant === "page" ? (
          <Link to="/account" className="cour-nav-link hidden md:inline">
            ACCOUNT
          </Link>
        ) : null}
        <Link to="/cart" className="cour-nav-link is-on">
          CART [ {count} ]
        </Link>
        <button
          type="button"
          className="cour-nav-link md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Open menu"
        >
          MENU
        </button>
      </div>

      {open ? (
        <div className="cour-nav-sheet">
          {header.map((item) => (
            <Link key={item.id} to={item.href as "/"} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setOpen(false)}>
            CART
          </Link>
          {variant === "page" ? (
            <>
              <Link to="/account" onClick={() => setOpen(false)}>
                ACCOUNT
              </Link>
              <Link to="/search" onClick={() => setOpen(false)}>
                SEARCH
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
