import { S as require_jsx_runtime, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as Route$3 } from "./_ssr/router-PwxNvrjr.mjs";
import { t as SiteShell } from "./_ssr/shell-DPlW-Oc7.mjs";
import { t as ProductTile } from "./_ssr/product-card-D3uw9fCO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-CcrnG645.js
var import_jsx_runtime = require_jsx_runtime();
function CollectionPage() {
	const { collection, store } = Route$3.useLoaderData();
	if (!collection) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-24 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "NO COLLECTION."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "cour-btn mt-6",
				children: "SHOP"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "px-4 py-10 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "cour-label",
						children: "COLLECTION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "cour-display mt-3 text-[clamp(2.4rem,6vw,4.2rem)]",
						children: [collection.collection.name, "."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-mist",
						children: collection.collection.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: collection.products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTile, {
							product: p,
							index: i
						}, p.id))
					})
				]
			})
		})
	});
}
//#endregion
export { CollectionPage as component };
