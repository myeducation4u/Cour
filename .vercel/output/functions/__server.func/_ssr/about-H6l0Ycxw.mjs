import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Route$17 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-H6l0Ycxw.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	const store = Route$17.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-16 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "STUDIO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]",
					children: "ABOUT."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-5 text-[1.05rem] leading-relaxed text-mist",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "COUR treats a jacket as a technical object. The site is an inspection surface: lattice, light, specification, then selection." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The line is cropped outerwear with a lacquered shell, oversized pockets and an iridescent response to cold light. Colorways share one architecture so the garment remains identifiable while the surface changes." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nothing here invents a factory tour, a celebrity client or a sustainability score. Fit, material, care, inventory and shipping are listed as data, and can be revised from the studio CMS." })
					]
				})
			]
		})
	});
}
//#endregion
export { AboutPage as component };
