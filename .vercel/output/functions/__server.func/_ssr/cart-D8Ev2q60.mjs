import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Route$14 } from "./router-PwxNvrjr.mjs";
import { a as useBag, i as bagTotal } from "./hud-CSbugAQe.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { t as money } from "./format-BUKntx01.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-D8Ev2q60.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const store = Route$14.useLoaderData();
	const items = useBag((s) => s.items);
	const setQty = useBag((s) => s.setQty);
	const remove = useBag((s) => s.remove);
	const total = bagTotal(items);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-12 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "BAG"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-2 text-4xl",
					children: "CART."
				}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 border border-line p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-mist",
						children: "The bag is empty."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "cour-btn mt-6",
						children: "INSPECT THE LINE"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-4",
					children: [
						items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4 border border-line p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: "",
									className: "h-20 w-20 object-contain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-40 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm tracking-[0.06em]",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[0.62rem] text-mist",
										children: ["SIZE ", item.size]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-9 w-9 border border-line",
											onClick: () => setQty(item.variantId, item.quantity - 1),
											children: "–"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-center font-mono text-sm",
											children: item.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-9 w-9 border border-line",
											onClick: () => setQty(item.variantId, item.quantity + 1),
											children: "+"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "w-20 text-right font-mono text-sm",
									children: money(item.priceCents * item.quantity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "font-mono text-[0.58rem] tracking-[0.14em] text-mist",
									onClick: () => remove(item.variantId),
									children: "REMOVE"
								})
							]
						}, item.variantId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-line pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "cour-label",
								children: "TOTAL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg",
								children: money(total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							className: "cour-btn cour-btn-solid",
							children: "CHECKOUT"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CartPage as component };
