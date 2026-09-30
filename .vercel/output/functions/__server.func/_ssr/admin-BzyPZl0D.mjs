import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as money } from "./format-BUKntx01.mjs";
import { _ as getDashboard } from "./admin-xvpbBJfi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BzyPZl0D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getDashboard().then(setData).catch((err) => setError(err instanceof Error ? err.message : "Dashboard unavailable."));
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-6 text-sm text-mist",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-6 font-mono text-sm text-mist",
		children: "LOADING METRICS"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "DASHBOARD."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "ORDERS",
						value: String(data.orderCount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "REVENUE",
						value: money(data.revenueCents)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "PRODUCTS",
						value: String(data.productCount)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "LOW STOCK"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-line border border-line",
				children: data.lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-sm text-mist",
					children: "No low-stock variants."
				}) : data.lowStock.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex justify-between p-3 font-mono text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						row.name,
						" / ",
						row.size
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.inventoryQuantity })]
				}, `${row.sku}-${row.size}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "RECENT ORDERS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 divide-y divide-line border border-line",
				children: data.recentOrders.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex justify-between gap-3 p-3 font-mono text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.id }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: row.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(row.totalCents) })
					]
				}, row.id))
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "cour-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-mono text-2xl",
			children: value
		})]
	});
}
//#endregion
export { AdminHome as component };
