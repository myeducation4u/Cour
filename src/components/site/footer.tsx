import { Link } from "@tanstack/react-router";
import { BrandWord } from "@/components/site/brand-mark";
import type { NavItem, SiteSettings } from "@/lib/types";

const POLICY_LINKS = [
  { label: "SHIPPING", slug: "shipping" },
  { label: "RETURNS", slug: "returns" },
  { label: "PRIVACY", slug: "privacy" },
  { label: "TERMS", slug: "terms" },
] as const;

/**
 * Footer.
 *
 * Sits outside the homepage's sticky stage track on purpose — see the structural
 * note in `home/experience.tsx`. The reference recording never scrolls past the
 * KNOW chapter, so the footer's composition follows the *existing* workspace
 * conventions (the same grid, the same mono scale) rather than an invented one.
 */
export function SiteFooter({
  settings,
  items,
}: {
  settings: SiteSettings;
  items: NavItem[];
}) {
  const links = items.filter((i) => i.location === "footer");
  const year = new Date().getFullYear();

  return (
    <footer className="cour-footer">
      <div className="cour-footer-inner">
        <div className="cour-footer-brand">
          <BrandWord className="cour-footer-word" />
          <p className="cour-footer-blurb">
            {settings.tagline ??
              "Technical outerwear built in small runs. Engineered for motion, finished by hand, and shipped worldwide from the studio."}
          </p>
          <p className="cour-footer-coords" aria-hidden="true">
            40.7128° N / 74.0060° W
          </p>
        </div>

        <nav className="cour-footer-col" aria-label="Shop">
          <h2 className="cour-footer-h">SHOP</h2>
          <ul>
            <li>
              <Link to="/shop">ALL JACKETS</Link>
            </li>
            {links.map((item) => (
              <li key={item.id}>
                <Link to={item.href as "/"}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="cour-footer-col" aria-label="Policies">
          <h2 className="cour-footer-h">POLICIES</h2>
          <ul>
            {POLICY_LINKS.map((policy) => (
              <li key={policy.slug}>
                <Link to="/policies/$slug" params={{ slug: policy.slug }}>
                  {policy.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="cour-footer-col">
          <h2 className="cour-footer-h">CONTACT</h2>
          <ul>
            <li>
              <a href={`mailto:${settings.contactEmail ?? ""}`}>{(settings.contactEmail ?? "STUDIO@COUR.STUDIO").toUpperCase()}</a>
            </li>
            <li>
              <Link to="/about">ABOUT THE STUDIO</Link>
            </li>
            <li>
              <Link to="/account">ACCOUNT</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="cour-footer-base">
        <p>
          © {year} {settings.brandName.toUpperCase()}
        </p>
        <p>{settings.currency} / WORLDWIDE</p>
        <p className="cour-footer-note">{settings.footerNote ?? "ALL RIGHTS RESERVED"}</p>
      </div>
    </footer>
  );
}
