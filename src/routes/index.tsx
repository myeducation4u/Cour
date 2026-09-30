import { createFileRoute } from "@tanstack/react-router";
import { HomeExperience } from "@/components/home/experience";
import { getStorefront } from "@/lib/server/storefront";

export const Route = createFileRoute("/")({
  loader: () => getStorefront(),
  head: () => ({
    meta: [
      { title: "COUR — Form / Surface / Motion" },
      {
        name: "description",
        content: "COUR technical outerwear. Inspect the garment, then select.",
      },
    ],
    links: [{ rel: "preload", as: "image", href: "/media/void-puffer.webp" }],
  }),
  component: Home,
});

function Home() {
  const store = Route.useLoaderData();
  return <HomeExperience store={store} />;
}
