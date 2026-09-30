import type { ReactNode } from "react";
import type { NavItem, SiteSettings } from "@/lib/types";
import { SiteFooter } from "./footer";
import { SiteNav } from "./nav";
import { Hud } from "./hud";
import { cn } from "@/lib/utils";

export function SiteShell({
  settings,
  navigation,
  children,
  overlayNav = false,
  className,
}: {
  settings: SiteSettings;
  navigation: NavItem[];
  children: ReactNode;
  overlayNav?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("cour-app", className)} data-ready="true">
      <div className="cour-stage cour-stage-page">
        <div className="cour-grid" />
        <Hud />
        {settings.announcementEnabled && settings.announcement ? (
          <p className="relative z-20 border-b border-line px-4 py-2 text-center font-mono text-[0.58rem] tracking-[0.16em] text-mist">
            {settings.announcement}
          </p>
        ) : null}
        <SiteNav items={navigation} overlay={overlayNav} variant="page" />
        <div className="relative z-10">{children}</div>
      </div>
      <SiteFooter settings={settings} items={navigation} />
    </div>
  );
}
