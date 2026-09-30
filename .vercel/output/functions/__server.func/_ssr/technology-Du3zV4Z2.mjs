import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$9 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/technology-Du3zV4Z2.js
var import_jsx_runtime = require_jsx_runtime();
function TechnologyPage() {
	const store = Route$9.useLoaderData();
	const section = store.sections.find((s) => s.sectionKey === "construction");
	const layers = section?.content.layers ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "CONSTRUCTION"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-[clamp(2rem,5vw,3.6rem)]",
					children: section?.title ?? "TECHNOLOGY ENGINEERED TO ENDURE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-sm leading-relaxed text-mist",
					children: section?.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3",
					children: layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border border-line p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[0.58rem] tracking-[0.16em] text-dim",
								children: layer.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-sm tracking-[0.08em]",
								children: layer.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mist",
								children: layer.body
							})
						]
					}, layer.id))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-line bg-void p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/media/construction.jpg",
					alt: "Exploded COUR material layers",
					className: "h-full w-full object-contain"
				})
			})]
		})
	});
}
//#endregion
export { TechnologyPage as component };
