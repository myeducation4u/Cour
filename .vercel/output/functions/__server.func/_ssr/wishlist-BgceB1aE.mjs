import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$8 } from "./router-PwxNvrjr.mjs";
import { t as SiteShell } from "./shell-DPlW-Oc7.mjs";
import { n as useCurrentUserState } from "./use-current-user-DdU6lZVa.mjs";
import { t as money } from "./format-BUKntx01.mjs";
import { r as listWishlist } from "./commerce-DRpAKHm0.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-BgceB1aE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const store = Route$8.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		listWishlist().then(setRows).catch(() => setRows([]));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "px-6 py-24 text-center font-mono text-sm text-mist",
			children: "LOADING"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-12 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display text-4xl",
					children: "WISHLIST."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: rows.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/product/$slug",
						params: { slug: w.slug },
						className: "border border-line p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: w.image,
								alt: "",
								className: "h-40 w-full object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: w.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono",
								children: money(w.priceCents)
							})
						]
					}, w.id))
				}),
				rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-mist",
					children: "Nothing saved yet."
				}) : null
			]
		})
	});
}
//#endregion
export { WishlistPage as component };
