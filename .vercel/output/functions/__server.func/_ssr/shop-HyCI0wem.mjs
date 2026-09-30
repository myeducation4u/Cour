import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Route$10 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { t as ProductTile } from "./product-card-D3uw9fCO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-HyCI0wem.js
var import_jsx_runtime = require_jsx_runtime();
function Shop() {
	const store = Route$10.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-10 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "CATALOG"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-[clamp(2.4rem,6vw,4.2rem)]",
					children: "SHOP."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm text-mist",
					children: "Five jackets. Same inspection language. Choose a colorway, a size, then the bag."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: store.products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTile, {
						product: p,
						index: i
					}, p.id))
				})
			]
		})
	});
}
//#endregion
export { Shop as component };
