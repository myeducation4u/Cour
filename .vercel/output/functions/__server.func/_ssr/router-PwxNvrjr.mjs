import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-TCUao-yz.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B2Izd0c7.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/storefront-D00vzGGe.js
var getStorefront = createServerFn({ method: "GET" }).handler(createSsrRpc("07049028cea290192cb92435ee37e6574b1c4a7be29433a4128aaa13276994a2"));
var getProductBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("906f493e93192f7e545d8754695cadfe3f38347c9360f5e187f0214f0284084a"));
var getCollectionBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("5b4f0578b8cbfed0da0c9299da2c8c0bb14f630689bd6876deae1d134582512a"));
createServerFn({ method: "GET" }).validator((q) => q).handler(createSsrRpc("f7a566d81f28aff81fa140bcda849490ba681d47385e45736c24f8dc58eb76b1"));
var submitInquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("901109565effd9fa35babb70179531d41e7b81d45e5f3d9e59271393ff54ec87"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-PwxNvrjr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-B8iItDkh.css";
var APP_NAME = "COUR";
var Route$19 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "COUR — technical outerwear inspected as an object. Form, surface, motion."
			},
			{
				name: "theme-color",
				content: "#070708"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-void text-ink antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$17 = () => import("./routes-DtNwpFXq.mjs");
var Route$18 = createFileRoute("/")({
	loader: () => getStorefront(),
	head: () => ({
		meta: [{ title: "COUR — Form / Surface / Motion" }, {
			name: "description",
			content: "COUR technical outerwear. Inspect the garment, then select."
		}],
		links: [{
			rel: "preload",
			as: "image",
			href: "/media/void-puffer.webp"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./about-H6l0Ycxw.mjs");
var Route$17 = createFileRoute("/about")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "About — COUR" }, {
		name: "description",
		content: "COUR builds technical outerwear as objects to be inspected."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./account-CCXk_BFL.mjs");
var Route$16 = createFileRoute("/account")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Account — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./route-BdflY1JI.mjs");
var Route$15 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./cart-D8Ev2q60.mjs");
var Route$14 = createFileRoute("/cart")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Bag — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./checkout-BT1jx9kl.mjs");
var Route$13 = createFileRoute("/checkout")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Checkout — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./login-D4O_d_Ry.mjs");
var Route$12 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: () => ({ meta: [{ title: "Sign in — COUR" }] })
});
var $$splitComponentImporter$10 = () => import("./search-DVG69gnE.mjs");
var Route$11 = createFileRoute("/search")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Search — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./shop-HyCI0wem.mjs");
var Route$10 = createFileRoute("/shop")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Shop — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./technology-Du3zV4Z2.mjs");
var Route$9 = createFileRoute("/technology")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Technology — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./wishlist-BgceB1aE.mjs");
var Route$8 = createFileRoute("/wishlist")({
	loader: () => getStorefront(),
	head: () => ({ meta: [{ title: "Wishlist — COUR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin-BzyPZl0D.mjs");
var Route$7 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./content-DqT6cRKM.mjs");
var Route$6 = createFileRoute("/admin/content")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./orders-foRd45lx.mjs");
var Route$5 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./products-CAx9yVzN.mjs");
var Route$4 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_slug-CcrnG645.mjs");
var Route$3 = createFileRoute("/collection/$slug")({
	loader: async ({ params }) => {
		const [collection, store] = await Promise.all([getCollectionBySlug({ data: params.slug }), getStorefront()]);
		return {
			collection,
			store
		};
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.collection?.collection.name ?? "Collection"} — COUR` }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_slug-CUl3jWcT.mjs");
var Route$2 = createFileRoute("/policies/$slug")({
	loader: () => getStorefront(),
	head: ({ params, loaderData }) => {
		return { meta: [{ title: `${(loaderData?.policies.find((p) => p.slug === params.slug))?.title ?? "Policy"} — COUR` }] };
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_slug-BSR08iDl.mjs");
var Route$1 = createFileRoute("/product/$slug")({
	loader: async ({ params }) => {
		const [detail, store] = await Promise.all([getProductBySlug({ data: params.slug }), getStorefront()]);
		return {
			detail,
			store
		};
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData?.detail?.product.seoTitle ?? loaderData?.detail?.product.name ?? "COUR" }, {
		name: "description",
		content: loaderData?.detail?.product.seoDescription ?? loaderData?.detail?.product.description ?? ""
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$17.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var AccountRoute = Route$16.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$19
});
var AdminRouteRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$19
});
var CartRoute = Route$14.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$19
});
var CheckoutRoute = Route$13.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$19
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$19
});
var SearchRoute = Route$11.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$19
});
var ShopRoute = Route$10.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$19
});
var TechnologyRoute = Route$9.update({
	id: "/technology",
	path: "/technology",
	getParentRoute: () => Route$19
});
var WishlistRoute = Route$8.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$19
});
var AdminIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var AdminContentRoute = Route$6.update({
	id: "/content",
	path: "/content",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrdersRoute = Route$5.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRouteRoute
});
var AdminProductsRoute = Route$4.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRouteRoute
});
var CollectionSlugRoute = Route$3.update({
	id: "/collection/$slug",
	path: "/collection/$slug",
	getParentRoute: () => Route$19
});
var PoliciesSlugRoute = Route$2.update({
	id: "/policies/$slug",
	path: "/policies/$slug",
	getParentRoute: () => Route$19
});
var ProductSlugRoute = Route$1.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$19
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$19
});
var AdminRouteRouteChildren = {
	AdminContentRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRoute._addFileChildren(AdminRouteRouteChildren),
	AboutRoute,
	AccountRoute,
	CartRoute,
	CheckoutRoute,
	LoginRoute,
	SearchRoute,
	ShopRoute,
	TechnologyRoute,
	WishlistRoute,
	CollectionSlugRoute,
	PoliciesSlugRoute,
	ProductSlugRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$8 as a, Route$11 as c, Route$16 as d, Route$17 as f, createSsrRpc as h, Route$3 as i, Route$13 as l, submitInquiry as m, Route$1 as n, Route$9 as o, Route$18 as p, Route$2 as r, Route$10 as s, router_exports as t, Route$14 as u };
