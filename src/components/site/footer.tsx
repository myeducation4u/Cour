import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { submitInquiry } from "@/lib/server/storefront";
import { BrandMark } from "@/components/site/brand-mark";
import type { NavItem, SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  items,
}: {
  settings: SiteSettings;
  items: NavItem[];
}) {
  const footer = items.filter((i) => i.location === "footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");

  return (
    <footer className="border-t border-line px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm text-mist">
            {settings.footerNote ?? "Technical outerwear, built as an object."}
          </p>
          <p className="mt-6 font-mono text-[0.62rem] tracking-[0.16em] text-dim">
            STAY AHEAD OF THE DROP.
          </p>
          <form
            className="mt-3 flex max-w-sm gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (status === "busy") return;
              setStatus("busy");
              try {
                await submitInquiry({ data: { email, kind: "newsletter" } });
                setStatus("ok");
                setEmail("");
              } catch {
                setStatus("err");
              }
            }}
          >
            <input
              className="cour-field"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              aria-label="Email for drop notices"
              disabled={status === "busy"}
            />
            <button className="cour-btn shrink-0" type="submit" disabled={status === "busy"}>
              {status === "busy" ? "JOINING" : "JOIN"}
            </button>
          </form>
          <p className="mt-2 font-mono text-[0.62rem] text-mist" aria-live="polite">
            {status === "ok" ? "Recorded." : status === "err" ? "Could not save that email." : "\u00a0"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {footer.map((item) => (
            <Link
              key={item.id}
              to={item.href as "/"}
              className="font-mono text-[0.62rem] tracking-[0.16em] text-mist hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="font-mono text-[0.62rem] tracking-[0.14em] text-dim">
          <p>{settings.shippingNote}</p>
          <p className="mt-4">{settings.contactEmail}</p>
          <p className="mt-8">© {new Date().getFullYear()} {settings.brandName}</p>
        </div>
      </div>
    </footer>
  );
}
