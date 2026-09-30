import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/policies/$slug")({
  loader: () => getStorefront(),
  head: ({ params, loaderData }) => {
    const policy = loaderData?.policies.find((p) => p.slug === params.slug);
    return { meta: [{ title: `${policy?.title ?? "Policy"} — COUR` }] };
  },
  component: PolicyPage,
});

function PolicyPage() {
  const store = Route.useLoaderData();
  const { slug } = Route.useParams();
  const policy = store.policies.find((p) => p.slug === slug);
  return (
    <SiteShell settings={store.settings} navigation={store.navigation}>
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        {policy ? (
          <>
            <p className="cour-label">POLICY</p>
            <h1 className="cour-display mt-3 text-4xl">{policy.title}</h1>
            <p className="mt-6 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-mist">
              {policy.body}
            </p>
          </>
        ) : (
          <>
            <h1 className="cour-display text-3xl">NO POLICY.</h1>
            <Link to="/" className="cour-btn mt-6">
              HOME
            </Link>
          </>
        )}
      </main>
    </SiteShell>
  );
}
