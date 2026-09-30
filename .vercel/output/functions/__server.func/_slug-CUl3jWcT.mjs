import { S as require_jsx_runtime, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$2 } from "./_ssr/router-PwxNvrjr.mjs";
import { t as SiteShell } from "./_ssr/shell-DPlW-Oc7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-CUl3jWcT.js
var import_jsx_runtime = require_jsx_runtime();
function PolicyPage() {
	const store = Route$2.useLoaderData();
	const { slug } = Route$2.useParams();
	const policy = store.policies.find((p) => p.slug === slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-16 md:px-8",
			children: policy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: "POLICY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-4xl",
					children: policy.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-mist",
					children: policy.body
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "NO POLICY."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "cour-btn mt-6",
				children: "HOME"
			})] })
		})
	});
}
//#endregion
export { PolicyPage as component };
