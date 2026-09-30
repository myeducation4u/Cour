import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { bagCount, useBag } from "@/lib/store/bag";
import { BrandMark } from "@/components/site/brand-mark";
import type { CollectionCard, NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Site header.
 *
 * The reference's home chrome is deliberately sparse: brand, the four sections,
 * and the bag count. Account access is not part of that composition, so on the
 * stage it lives in the mobile sheet and on the account route itself — the
 * primary row stays exactly as the reference shows it.
 *
 * `COLLECTIONS` carries the reference's indicator, and that indicator is a real
 * affordance: it opens a menu of the live collections. A chevron that opens
 * nothing is worse than no chevron.
 */
export function SiteNav({
  items,
  collections = [],
  overlay = false,
  variant = "page",
}: {
  items: NavItem[];
  collections?: CollectionCard[];
  overlay?: boolean;
  variant?: "hero" | "page";
}) {
  const header = items.filter((i) => i.location === "header");
  const count = useBag((s) => bagCount(s.items));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLLIElement>(null);

  // A menu that ignores Escape, or that stays open after a navigation, is a
  // trap; both are handled here rather than left to the browser.
  useEffect(() => {
    setMenu(false);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  return (
    <header className={cn("cour-nav", overlay && "is-overlay", `cour-nav-${variant}`)}>
      <BrandMark />

      <nav className="cour-nav-links" aria-label="Primary">
        <ul className="cour-nav-list">
          {header.map((item) => {
            const hasMenu = /^\/collection/.test(item.href) && collections.length > 0;
            const on = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.id} className="cour-nav-item" ref={hasMenu ? menuRef : undefined}>
                {hasMenu ? (
                  <>
                    <button
                      type="button"
                      className={cn("cour-nav-link", on && "is-on")}
                      aria-expanded={menu}
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={() => setMenu((v) => !v)}
                    >
                      {item.label}
                      <span className="cour-chevron" aria-hidden="true" />
                    </button>
                    {menu ? (
                      <ul className="cour-nav-menu" id={menuId}>
                        <li>
                          <Link to={item.href as "/"} className="cour-nav-menu-link">
                            ALL JACKETS
                          </Link>
                        </li>
                        {collections.map((collection) => (
                          <li key={collection.id}>
                            <Link
                              to="/collection/$slug"
                              params={{ slug: collection.slug }}
                              className="cour-nav-menu-link"
                            >
                              {collection.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : (
                  <Link to={item.href as "/"} className={cn("cour-nav-link", on && "is-on")}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="cour-nav-actions">
        <Link to="/cart" className="cour-nav-link cour-nav-cart">
          CART <span className="cour-nav-cart-count">[ {count} ]</span>
        </Link>
        <button
          type="button"
          className="cour-nav-link cour-nav-burger"
          onClick={() => setSheet((v) => !v)}
          aria-expanded={sheet}
          aria-label={sheet ? "Close menu" : "Open menu"}
        >
          {sheet ? "CLOSE" : "MENU"}
        </button>
      </div>

      {sheet ? (
        <div className="cour-nav-sheet">
          {header.map((item) => (
            <Link key={item.id} to={item.href as "/"} className="cour-nav-sheet-link">
              {item.label}
            </Link>
          ))}
          <Link to="/cart" className="cour-nav-sheet-link">
            CART [ {count} ]
          </Link>
          <Link to="/search" className="cour-nav-sheet-link">
            SEARCH
          </Link>
          <Link to="/account" className="cour-nav-sheet-link">
            ACCOUNT
          </Link>
        </div>
      ) : null}
    </header>
  );
}
