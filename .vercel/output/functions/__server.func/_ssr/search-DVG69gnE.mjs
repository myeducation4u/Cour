import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Route$11 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { t as ProductTile } from "./product-card-D3uw9fCO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DVG69gnE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const store = Route$11.useLoaderData();
	const [q, setQ] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const n = q.trim().toLowerCase();
		if (!n) return store.products;
		return store.products.filter((p) => p.name.toLowerCase().includes(n) || (p.colorName ?? "").toLowerCase().includes(n) || (p.description ?? "").toLowerCase().includes(n));
	}, [q, store.products]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-12 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display text-4xl",
					children: "SEARCH."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "cour-field mt-6 max-w-xl",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "JACKET / COLOR / MATERIAL",
					"aria-label": "Search jackets"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: results.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTile, {
						product: p,
						index: i
					}, p.id))
				})
			]
		})
	});
}
//#endregion
export { SearchPage as component };
