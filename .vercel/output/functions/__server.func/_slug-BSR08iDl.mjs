import { o as __toESM } from "./_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route$1 } from "./_ssr/router-PwxNvrjr.mjs";
import { a as useBag } from "./_ssr/hud-CSbugAQe.mjs";
import { t as SiteShell } from "./_ssr/shell-DPlW-Oc7.mjs";
import { n as useCurrentUserState } from "./_ssr/use-current-user-DdU6lZVa.mjs";
import { t as money } from "./_ssr/format-BUKntx01.mjs";
import { o as toggleWishlist } from "./_ssr/commerce-DRpAKHm0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-BSR08iDl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { detail, store } = Route$1.useLoaderData();
	const add = useBag((s) => s.add);
	const { user } = useCurrentUserState();
	const [added, setAdded] = (0, import_react.useState)(false);
	const [wish, setWish] = (0, import_react.useState)(null);
	const variants = detail?.variants ?? [];
	const firstSize = variants.find((v) => v.inventoryQuantity > 0)?.size ?? variants[0]?.size ?? "M";
	const [size, setSize] = (0, import_react.useState)(firstSize);
	const variant = (0, import_react.useMemo)(() => variants.find((v) => v.size === size) ?? variants[0], [variants, size]);
	if (!detail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-24 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "NOT IN THE LINE."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "cour-btn mt-6",
				children: "RETURN TO SHOP"
			})]
		})
	});
	const { product } = detail;
	const price = variant?.priceOverrideCents ?? product.priceCents;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, {
		settings: store.settings,
		navigation: store.navigation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-line bg-surface p-6 [perspective:1200px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image,
					alt: product.name,
					width: 900,
					height: 1120,
					fetchPriority: "high",
					decoding: "async",
					className: "cour-inspect mx-auto h-[min(70vh,620px)] w-full object-contain"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-label",
					children: product.colorName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "cour-display mt-3 text-[clamp(2rem,5vw,3.4rem)]",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-mono text-lg",
					children: money(price)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-sm leading-relaxed text-mist",
					children: product.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-sm leading-relaxed text-dim",
					children: product.story
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "cour-label",
							children: "SIZE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: v.inventoryQuantity <= 0,
								onClick: () => setSize(v.size),
								className: `min-h-11 min-w-11 border px-3 font-mono text-[0.7rem] ${v.size === size ? "border-ink bg-ink text-void" : "border-line text-ink"} disabled:opacity-30`,
								children: v.size
							}, v.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-[0.58rem] tracking-[0.12em] text-dim",
							children: variant ? `${variant.inventoryQuantity} IN STUDIO` : "UNAVAILABLE"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cour-btn cour-btn-solid",
						disabled: !variant || variant.inventoryQuantity <= 0,
						onClick: () => {
							if (!variant) return;
							add({
								productId: product.id,
								variantId: variant.id,
								slug: product.slug,
								name: product.name,
								size: variant.size,
								priceCents: price,
								image: product.image
							});
							setAdded(true);
						},
						children: added ? "IN THE BAG" : "ADD TO BAG"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cour-btn",
						onClick: async () => {
							if (!user) {
								window.location.assign("/login");
								return;
							}
							const res = await toggleWishlist({ data: product.id });
							setWish(res.saved ? "SAVED" : "REMOVED");
						},
						children: wish ?? "WISHLIST"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-10 grid gap-4 border-t border-line pt-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "cour-label",
							children: "FIT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-mist",
							children: product.fit
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "cour-label",
							children: "MATERIAL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-mist",
							children: product.material
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "cour-label",
							children: "CARE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-mist",
							children: product.care
						})] })
					]
				})
			] })]
		})
	});
}
//#endregion
export { ProductPage as component };
