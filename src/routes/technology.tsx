import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/technology")({
  loader: () => getStorefront(),
  head: () => ({ meta: [{ title: "Technology — COUR" }] }),
  component: TechnologyPage,
});

function TechnologyPage() {
  const store = Route.useLoaderData();
  const section = store.sections.find((s) => s.sectionKey === "construction");
  const layers =
    (section?.content.layers as Array<{ id: string; title: string; body: string }> | undefined) ??
    [];
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <p className="cour-label">CONSTRUCTION</p>
          <h1 className="cour-display cour-tech-title mt-3 whitespace-pre-line text-[clamp(2rem,5vw,3.6rem)]">
            {section?.title ?? "TECHNOLOGY\nENGINEERED\nTO ENDURE"}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mist">{section?.body}</p>
          <div className="mt-8 space-y-3">
            {layers.map((layer) => (
              <article key={layer.id} className="border border-line p-3">
                <p className="font-mono text-[0.58rem] tracking-[0.16em] text-dim">{layer.id}</p>
                <h2 className="mt-1 text-sm tracking-[0.08em]">{layer.title}</h2>
                <p className="mt-2 text-sm text-mist">{layer.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="border border-line bg-void p-6">
          <img
            src="/media/construction.jpg"
            alt="Exploded COUR material layers"
            className="h-full w-full object-contain"
          />
        </div>
      </main>
    </SiteShell>
  );
}
