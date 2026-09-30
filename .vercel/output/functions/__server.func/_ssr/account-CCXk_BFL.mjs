import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Route$16 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { n as useCurrentUserState } from "./use-current-user-DdU6lZVa.mjs";
import { t as money } from "./format-BUKntx01.mjs";
import { a as saveAddress, n as listMyOrders, r as listWishlist, t as listMyAddresses } from "./commerce-DRpAKHm0.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-CCXk_BFL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const store = Route$16.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const [wishes, setWishes] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("orders");
	const [addr, setAddr] = (0, import_react.useState)({
		label: "Home",
		line1: "",
		city: "",
		region: "",
		postalCode: ""
	});
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		listMyOrders().then(setOrders).catch(() => setOrders([]));
		listMyAddresses().then(setAddresses).catch(() => setAddresses([]));
		listWishlist().then(setWishes).catch(() => setWishes([]));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "px-6 py-24 text-center font-mono text-sm text-mist",
			children: "LOADING SESSION"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-12 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "CLIENT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-2 text-4xl",
					children: "ACCOUNT."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-mist",
					children: user.primaryEmail ?? user.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "cour-btn h-9 min-h-9 text-[0.58rem]",
						children: "STUDIO CMS"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex gap-2",
					children: [
						"orders",
						"addresses",
						"saved"
					].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `cour-btn h-9 min-h-9 ${tab === id ? "cour-btn-solid" : ""}`,
						onClick: () => setTab(id),
						children: id.toUpperCase()
					}, id))
				}),
				tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3",
					children: orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: "No orders yet."
					}) : orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border border-line p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-between gap-2 font-mono text-[0.7rem]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.id }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-mist",
									children: order.status.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(order.totalCents) })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 text-sm text-mist",
							children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								item.name,
								" / ",
								item.size,
								" × ",
								item.quantity
							] }, item.id))
						})]
					}, order.id))
				}) : null,
				tab === "addresses" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-2",
						onSubmit: async (e) => {
							e.preventDefault();
							await saveAddress({ data: addr });
							setNote("Address saved.");
							setAddresses(await listMyAddresses());
						},
						children: [
							[
								"label",
								"line1",
								"city",
								"region",
								"postalCode"
							].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "cour-field",
								placeholder: key.toUpperCase(),
								value: addr[key],
								onChange: (e) => setAddr({
									...addr,
									[key]: e.target.value
								}),
								required: key === "line1" || key === "city"
							}, key)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cour-btn",
								type: "submit",
								children: "SAVE ADDRESS"
							}),
							note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mist",
								children: note
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-line p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: a.label ?? "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-mist",
								children: [
									a.line1,
									" / ",
									a.city
								]
							})]
						}, a.id))
					})]
				}) : null,
				tab === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: [wishes.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/product/$slug",
						params: { slug: w.slug },
						className: "border border-line p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: w.image,
								alt: "",
								className: "h-32 w-full object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: w.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm",
								children: money(w.priceCents)
							})
						]
					}, w.id)), wishes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mist",
						children: "Nothing saved."
					}) : null]
				}) : null
			]
		})
	});
}
//#endregion
export { AccountPage as component };
