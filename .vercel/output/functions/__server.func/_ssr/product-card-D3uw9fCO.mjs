import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as money } from "./format-BUKntx01.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-D3uw9fCO.js
var import_jsx_runtime = require_jsx_runtime();
var TAGS = {
	"shadow-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"],
	"tactical-hooded": ["LAYERING PIECE", "UTILITY"],
	"thermal-bomber": ["THERMAL INSULATION", "WINDPROOF"],
	"tech-shell": ["WATER-RESISTANT", "BREATHABLE"],
	"void-puffer": ["OVERSIZED FIT", "LIMITED QUANTITY"]
};
function ProductTile({ product, index }) {
	const tags = TAGS[product.slug] ?? ["OVERSIZED FIT", "LIMITED QUANTITY"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "cour-tile group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-tile-idx",
					children: String(index + 1).padStart(2, "0")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "cour-tile-name",
					children: product.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[0.68rem] tracking-[0.04em] text-ink",
						children: money(product.priceCents)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: product.slug },
						className: "cour-plus",
						"aria-label": `Open ${product.name}`,
						children: "+"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/product/$slug",
				params: { slug: product.slug },
				className: "cour-tile-shot",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image,
					alt: product.name,
					width: 640,
					height: 800,
					loading: "lazy",
					decoding: "async"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cour-tile-foot",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "cour-tile-tags",
					children: [
						tags[0],
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						tags[1]
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					className: "cour-tile-shop",
					children: "SHOP NOW"
				})]
			})
		]
	});
}
//#endregion
export { ProductTile as t };
