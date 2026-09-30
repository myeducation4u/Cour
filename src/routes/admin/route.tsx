import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimOwner, getAdminContext } from "@/lib/server/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "DASHBOARD" },
  { to: "/admin/products", label: "PRODUCTS" },
  { to: "/admin/orders", label: "ORDERS" },
  { to: "/admin/content", label: "CONTENT" },
] as const;

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ctx, setCtx] = useState<Awaited<ReturnType<typeof getAdminContext>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getAdminContext()
      .then(setCtx)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load studio."));
  }, [user]);

  if (isPending) {
    return <div className="grid min-h-dvh place-items-center bg-void font-mono text-sm text-mist">LOADING</div>;
  }
  if (!user) return <RedirectToSignIn />;

  if (ctx?.needsClaim) {
    return (
      <main className="grid min-h-dvh place-items-center bg-void px-4">
        <div className="max-w-md border border-line p-6">
          <p className="font-mono text-[0.7rem] tracking-[0.2em]">COUR STUDIO</p>
          <h1 className="cour-display mt-3 text-3xl">CLAIM OWNER.</h1>
          <p className="mt-3 text-sm text-mist">
            No administrator exists yet. The first signed-in visitor who claims becomes the owner
            and can edit catalog, homepage and orders.
          </p>
          <button
            type="button"
            className="cour-btn cour-btn-solid mt-6"
            onClick={async () => {
              await claimOwner();
              setCtx(await getAdminContext());
            }}
          >
            BECOME OWNER
          </button>
        </div>
      </main>
    );
  }

  if (ctx && !ctx.isStaff) {
    return (
      <main className="grid min-h-dvh place-items-center bg-void px-4 text-center">
        <div>
          <h1 className="cour-display text-3xl">RESTRICTED.</h1>
          <p className="mt-3 text-sm text-mist">This desk is for studio operators.</p>
          <Link to="/" className="cour-btn mt-6">
            BACK TO SITE
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-void text-ink">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <Link to="/" className="font-mono text-[0.7rem] tracking-[0.24em]">
          COUR STUDIO
        </Link>
        <nav className="flex flex-wrap gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "font-mono text-[0.62rem] tracking-[0.16em] text-mist hover:text-ink",
                pathname === link.to && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      {error ? <p className="px-4 py-3 text-sm text-mist">{error}</p> : null}
      {ctx?.isStaff ? <Outlet /> : <div className="p-8 font-mono text-sm text-mist">LOADING DESK</div>}
    </div>
  );
}
