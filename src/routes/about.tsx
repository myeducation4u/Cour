import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/about")({
  loader: () => getStorefront(),
  head: () => ({
    meta: [
      { title: "About — COUR" },
      {
        name: "description",
        content: "COUR builds technical outerwear as objects to be inspected.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const store = Route.useLoaderData();
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="cour-label">STUDIO</p>
        <h1 className="cour-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">ABOUT.</h1>
        <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-mist">
          <p>
            COUR treats a jacket as a technical object. The site is an inspection surface: lattice,
            light, specification, then selection.
          </p>
          <p>
            The line is cropped outerwear with a lacquered shell, oversized pockets and an
            iridescent response to cold light. Colorways share one architecture so the garment
            remains identifiable while the surface changes.
          </p>
          <p>
            Nothing here invents a factory tour, a celebrity client or a sustainability score.
            Fit, material, care, inventory and shipping are listed as data, and can be revised from
            the studio CMS.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
