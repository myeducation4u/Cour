import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as adminListProducts, n as adminGetProduct, p as adminSaveVariantInventory, u as adminSaveProduct } from "./admin-xvpbBJfi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-CAx9yVzN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		adminListProducts().then(setRows).catch(() => setRows([]));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		adminGetProduct({ data: active }).then(setDetail);
	}, [active]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[0.8fr_1.2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "cour-display text-3xl",
			children: "PRODUCTS."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 divide-y divide-line border border-line",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between p-3 text-left",
				onClick: () => setActive(String(row.id)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: String(row.name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[0.62rem] text-mist",
					children: String(row.status)
				})]
			}, String(row.id)))
		})] }), detail?.product ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
			detail,
			note,
			onSave: async (payload) => {
				await adminSaveProduct({ data: payload });
				setNote("Saved.");
				setRows(await adminListProducts());
			},
			onVariant: async (payload) => {
				await adminSaveVariantInventory({ data: payload });
				setDetail(await adminGetProduct({ data: String(detail.product.id) }));
				setNote("Inventory updated.");
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-mist",
			children: "Select a jacket."
		})]
	});
}
function ProductForm({ detail, note, onSave, onVariant }) {
	const p = detail.product;
	const [form, setForm] = (0, import_react.useState)({
		id: String(p.id),
		name: String(p.name),
		slug: String(p.slug),
		description: String(p.description ?? ""),
		story: String(p.story ?? ""),
		priceCents: Number(p.price_cents),
		status: String(p.status),
		featured: Boolean(p.featured),
		colorName: String(p.color_name ?? ""),
		colorHex: String(p.color_hex ?? ""),
		fit: String(p.fit ?? ""),
		material: String(p.material ?? ""),
		care: String(p.care ?? ""),
		seoTitle: String(p.seo_title ?? ""),
		seoDescription: String(p.seo_description ?? "")
	});
	(0, import_react.useEffect)(() => {
		const n = detail.product;
		setForm({
			id: String(n.id),
			name: String(n.name),
			slug: String(n.slug),
			description: String(n.description ?? ""),
			story: String(n.story ?? ""),
			priceCents: Number(n.price_cents),
			status: String(n.status),
			featured: Boolean(n.featured),
			colorName: String(n.color_name ?? ""),
			colorHex: String(n.color_hex ?? ""),
			fit: String(n.fit ?? ""),
			material: String(n.material ?? ""),
			care: String(n.care ?? ""),
			seoTitle: String(n.seo_title ?? ""),
			seoDescription: String(n.seo_description ?? "")
		});
	}, [detail]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			[
				["name", "NAME"],
				["slug", "SLUG"],
				["colorName", "COLOR"],
				["colorHex", "COLOR HEX"],
				["fit", "FIT"],
				["material", "MATERIAL"],
				["care", "CARE"],
				["seoTitle", "SEO TITLE"]
			].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "cour-field mt-1",
					value: form[key],
					onChange: (e) => setForm({
						...form,
						[key]: e.target.value
					})
				})]
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: "PRICE (CENTS)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "cour-field mt-1",
					type: "number",
					value: form.priceCents,
					onChange: (e) => setForm({
						...form,
						priceCents: Number(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: "DESCRIPTION"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "cour-field mt-1 min-h-24",
					value: form.description,
					onChange: (e) => setForm({
						...form,
						description: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: "STORY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "cour-field mt-1 min-h-24",
					value: form.story,
					onChange: (e) => setForm({
						...form,
						story: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 font-mono text-[0.7rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.featured,
					onChange: (e) => setForm({
						...form,
						featured: e.target.checked
					})
				}), "FEATURED"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: "STATUS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "cour-field mt-1",
					value: form.status,
					onChange: (e) => setForm({
						...form,
						status: e.target.value
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "published",
							children: "published"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "draft",
							children: "draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "archived",
							children: "archived"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn cour-btn-solid",
				type: "submit",
				children: "SAVE PRODUCT"
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mist",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "pt-4 font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "INVENTORY"
			}),
			detail.variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantRow, {
				variant: v,
				onSave: onVariant
			}, String(v.id)))
		]
	});
}
function VariantRow({ variant, onSave }) {
	const [qty, setQty] = (0, import_react.useState)(Number(variant.inventory_quantity));
	const [status, setStatus] = (0, import_react.useState)(String(variant.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end gap-2 border border-line p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "w-16 font-mono text-sm",
				children: String(variant.size)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field max-w-24",
				type: "number",
				value: qty,
				onChange: (e) => setQty(Number(e.target.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cour-field max-w-32",
				value: status,
				onChange: (e) => setStatus(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "active",
					children: "active"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "inactive",
					children: "inactive"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "cour-btn h-9 min-h-9",
				onClick: () => onSave({
					id: String(variant.id),
					inventoryQuantity: qty,
					status
				}),
				children: "UPDATE"
			})
		]
	});
}
//#endregion
export { AdminProducts as component };
