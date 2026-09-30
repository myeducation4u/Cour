import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as submitInquiry } from "./router-PwxNvrjr.mjs";
import { t as cn } from "./utils-4_bTDmXX.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hud-CSbugAQe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ className, to = "/" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("cour-mark", className),
		"aria-label": "COUR home",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "cour-mark-badge",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1.2",
				y: "1.2",
				width: "29.6",
				height: "29.6",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M23.5 8.2 H11.2 V23.8 H23.5",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "4.4",
				strokeLinejoin: "miter"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "COUR" })]
	});
}
function SiteFooter({ settings, items }) {
	const footer = items.filter((i) => i.location === "footer");
	const [email, setEmail] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-line px-5 py-10 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-sm text-sm text-mist",
						children: settings.footerNote ?? "Technical outerwear, built as an object."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-mono text-[0.62rem] tracking-[0.16em] text-dim",
						children: "STAY AHEAD OF THE DROP."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex max-w-sm gap-2",
						onSubmit: async (e) => {
							e.preventDefault();
							try {
								await submitInquiry({ data: {
									email,
									kind: "newsletter"
								} });
								setStatus("ok");
								setEmail("");
							} catch {
								setStatus("err");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field",
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "EMAIL",
							"aria-label": "Email for drop notices"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cour-btn shrink-0",
							type: "submit",
							children: "JOIN"
						})]
					}),
					status === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[0.62rem] text-mist",
						children: "Recorded."
					}) : null,
					status === "err" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[0.62rem] text-mist",
						children: "Could not save that email."
					}) : null
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: footer.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.href,
						className: "font-mono text-[0.62rem] tracking-[0.16em] text-mist hover:text-ink",
						children: item.label
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[0.62rem] tracking-[0.14em] text-dim",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: settings.shippingNote }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4",
							children: settings.contactEmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-8",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" ",
								settings.brandName
							]
						})
					]
				})
			]
		})
	});
}
var useBag = create()(persist((set, get) => ({
	items: [],
	add: (item, quantity = 1) => {
		const items = [...get().items];
		const idx = items.findIndex((x) => x.variantId === item.variantId);
		if (idx >= 0) items[idx] = {
			...items[idx],
			quantity: Math.min(8, items[idx].quantity + quantity)
		};
		else items.push({
			...item,
			quantity: Math.min(8, quantity)
		});
		set({ items });
	},
	setQty: (variantId, quantity) => {
		if (quantity <= 0) {
			set({ items: get().items.filter((x) => x.variantId !== variantId) });
			return;
		}
		set({ items: get().items.map((x) => x.variantId === variantId ? {
			...x,
			quantity: Math.min(8, quantity)
		} : x) });
	},
	remove: (variantId) => set({ items: get().items.filter((x) => x.variantId !== variantId) }),
	clear: () => set({ items: [] })
}), { name: "cour-bag" }));
function bagCount(items) {
	return items.reduce((n, i) => n + i.quantity, 0);
}
function bagTotal(items) {
	return items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
}
function SiteNav({ items, overlay = false, variant = "page" }) {
	const header = items.filter((i) => i.location === "header");
	const count = useBag((s) => bagCount(s.items));
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("cour-nav", overlay && "is-overlay"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "cour-nav-links",
				children: header.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.href,
					className: cn("cour-nav-link", pathname === item.href && "is-on"),
					children: [item.label, item.label === "COLLECTIONS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cour-chevron",
						"aria-hidden": "true"
					}) : null]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					variant === "page" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "cour-nav-link hidden md:inline",
						children: "ACCOUNT"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						className: "cour-nav-link is-on",
						children: [
							"CART [ ",
							count,
							" ]"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cour-nav-link md:hidden",
						onClick: () => setOpen((v) => !v),
						"aria-expanded": open,
						"aria-label": "Open menu",
						children: "MENU"
					})
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cour-nav-sheet",
				children: [
					header.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.href,
						onClick: () => setOpen(false),
						children: item.label
					}, item.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cart",
						onClick: () => setOpen(false),
						children: "CART"
					}),
					variant === "page" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						onClick: () => setOpen(false),
						children: "ACCOUNT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/search",
						onClick: () => setOpen(false),
						children: "SEARCH"
					})] }) : null
				]
			}) : null
		]
	});
}
function Hud() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-hud",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cour-hud-mark top-2 left-2 border-t border-l" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cour-hud-mark top-2 right-2 border-t border-r" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cour-hud-mark bottom-2 left-2 border-b border-l" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cour-hud-mark bottom-2 right-2 border-b border-r" })
		]
	});
}
//#endregion
export { useBag as a, bagTotal as i, SiteFooter as n, SiteNav as r, Hud as t };
