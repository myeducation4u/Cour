import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Route$13 } from "./router-PwxNvrjr.mjs";
import { a as useBag, i as bagTotal } from "./hud-CSbugAQe.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { t as useCurrentUser } from "./use-current-user-DdU6lZVa.mjs";
import { t as money } from "./format-BUKntx01.mjs";
import { i as placeOrder } from "./commerce-DRpAKHm0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BT1jx9kl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const store = Route$13.useLoaderData();
	const user = useCurrentUser();
	const items = useBag((s) => s.items);
	const clear = useBag((s) => s.clear);
	const navigate = useNavigate();
	const total = bagTotal(items);
	const shipping = total >= 4e4 || total === 0 ? 0 : 1800;
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		email: user?.primaryEmail ?? "",
		shippingName: "",
		shippingLine1: "",
		shippingCity: "",
		shippingRegion: "",
		shippingPostal: "",
		shippingCountry: "US"
	});
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-24 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "NOTHING TO CHECK OUT."
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
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					setBusy(true);
					setError(null);
					try {
						await placeOrder({ data: {
							...form,
							items: items.map((i) => ({
								variantId: i.variantId,
								quantity: i.quantity
							}))
						} });
						clear();
						await navigate({ to: "/account" });
					} catch (err) {
						setError(err instanceof Error ? err.message : "Checkout failed.");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "cour-label",
						children: "CHECKOUT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "cour-display text-4xl",
						children: "PLACE ORDER."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: "Orders are recorded against studio inventory. Payment is confirmed by the studio after placement — no card is charged in the browser."
					}),
					[
						[
							"email",
							"EMAIL",
							"email"
						],
						[
							"shippingName",
							"NAME",
							"text"
						],
						[
							"shippingLine1",
							"ADDRESS",
							"text"
						],
						[
							"shippingCity",
							"CITY",
							"text"
						],
						[
							"shippingRegion",
							"REGION",
							"text"
						],
						[
							"shippingPostal",
							"POSTAL CODE",
							"text"
						]
					].map(([key, label, type]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cour-label",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field mt-1",
							type,
							required: key !== "shippingRegion",
							value: form[key],
							onChange: (e) => setForm({
								...form,
								[key]: e.target.value
							})
						})]
					}, key)),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "cour-btn cour-btn-solid",
						type: "submit",
						disabled: busy,
						children: busy ? "PLACING" : "PLACE ORDER"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border border-line p-4",
				children: [
					items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							item.name,
							" / ",
							item.size,
							" × ",
							item.quantity
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: money(item.priceCents * item.quantity)
						})]
					}, item.variantId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-between border-t border-line pt-3 font-mono text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SHIPPING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shipping === 0 ? "STUDIO COVERED" : money(shipping) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex justify-between font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(total + shipping) })]
					})
				]
			})]
		})
	});
}
//#endregion
export { CheckoutPage as component };
