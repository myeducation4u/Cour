import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-4_bTDmXX.mjs";
import { n as SiteFooter, r as SiteNav, t as Hud } from "./hud-CSbugAQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DPlW-Oc7.js
var import_jsx_runtime = require_jsx_runtime();
function SiteShell({ settings, navigation, children, overlayNav = false, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("cour-app", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-stage cour-stage-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cour-grid" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
				settings.announcementEnabled && settings.announcement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative z-20 border-b border-line px-4 py-2 text-center font-mono text-[0.58rem] tracking-[0.16em] text-mist",
					children: settings.announcement
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {
					items: navigation,
					overlay: overlayNav,
					variant: "page"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {
					settings,
					items: navigation
				})
			]
		})
	});
}
//#endregion
export { SiteShell as t };
