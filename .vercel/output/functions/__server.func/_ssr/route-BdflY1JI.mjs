import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-4_bTDmXX.mjs";
import { n as useCurrentUserState } from "./use-current-user-DdU6lZVa.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { g as getAdminContext, h as claimOwner } from "./admin-xvpbBJfi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BdflY1JI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/admin",
		label: "DASHBOARD"
	},
	{
		to: "/admin/products",
		label: "PRODUCTS"
	},
	{
		to: "/admin/orders",
		label: "ORDERS"
	},
	{
		to: "/admin/content",
		label: "CONTENT"
	}
];
function AdminLayout() {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [ctx, setCtx] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getAdminContext().then(setCtx).catch((err) => setError(err instanceof Error ? err.message : "Could not load studio."));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-void font-mono text-sm text-mist",
		children: "LOADING"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (ctx?.needsClaim) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-void px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md border border-line p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.7rem] tracking-[0.2em]",
					children: "COUR STUDIO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-3xl",
					children: "CLAIM OWNER."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-mist",
					children: "No administrator exists yet. The first signed-in visitor who claims becomes the owner and can edit catalog, homepage and orders."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "cour-btn cour-btn-solid mt-6",
					onClick: async () => {
						await claimOwner();
						setCtx(await getAdminContext());
					},
					children: "BECOME OWNER"
				})
			]
		})
	});
	if (ctx && !ctx.isStaff) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-void px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "RESTRICTED."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mist",
				children: "This desk is for studio operators."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "cour-btn mt-6",
				children: "BACK TO SITE"
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-void text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-mono text-[0.7rem] tracking-[0.24em]",
					children: "COUR STUDIO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-wrap gap-3",
					children: LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						className: cn("font-mono text-[0.62rem] tracking-[0.16em] text-mist hover:text-ink", pathname === link.to && "text-ink"),
						children: link.label
					}, link.to))
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-3 text-sm text-mist",
				children: error
			}) : null,
			ctx?.isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 font-mono text-sm text-mist",
				children: "LOADING DESK"
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
