import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as money } from "./format-BUKntx01.mjs";
import { i as adminListOrders, m as adminSetOrderStatus } from "./admin-xvpbBJfi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-foRd45lx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrders() {
	const [rows, setRows] = (0, import_react.useState)([]);
	async function reload() {
		setRows(await adminListOrders());
	}
	(0, import_react.useEffect)(() => {
		reload().catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "cour-display text-3xl",
			children: "ORDERS."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 divide-y divide-line border border-line",
			children: [rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm",
						children: String(row.id)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: String(row.email ?? "")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono",
						children: money(Number(row.total_cents ?? 0))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "cour-field max-w-40",
						value: String(row.status ?? "placed"),
						onChange: async (e) => {
							await adminSetOrderStatus({ data: {
								id: String(row.id),
								status: e.target.value
							} });
							await reload();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "placed",
								children: "placed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "paid",
								children: "paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fulfilled",
								children: "fulfilled"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cancelled",
								children: "cancelled"
							})
						]
					})
				]
			}, String(row.id))), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-sm text-mist",
				children: "No orders yet."
			}) : null]
		})]
	});
}
//#endregion
export { AdminOrders as component };
