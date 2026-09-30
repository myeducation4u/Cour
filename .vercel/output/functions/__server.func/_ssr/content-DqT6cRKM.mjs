import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as adminSaveNav, d as adminSaveSection, f as adminSaveSettings, l as adminSavePolicy, o as adminSaveFaq, r as adminListContent, s as adminSaveMedia, t as adminAddMedia } from "./admin-xvpbBJfi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-DqT6cRKM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminContent() {
	const [data, setData] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	const [mediaUrl, setMediaUrl] = (0, import_react.useState)("");
	const [mediaAlt, setMediaAlt] = (0, import_react.useState)("");
	async function reload() {
		setData(await adminListContent());
	}
	(0, import_react.useEffect)(() => {
		reload().catch(() => setData(null));
	}, []);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-6 font-mono text-sm text-mist",
		children: "LOADING CONTENT"
	});
	const settings = data.settings;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-4xl space-y-12 px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "cour-display text-3xl",
				children: "CONTENT."
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mist",
				children: note
			}) : null,
			settings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsBlock, {
				settings,
				onSave: async (payload) => {
					await adminSaveSettings({ data: payload });
					setNote("Settings saved.");
					await reload();
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "HOMEPAGE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-4",
				children: data.sections.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBlock, {
					row,
					onSave: async (payload) => {
						await adminSaveSection({ data: payload });
						setNote("Section saved.");
						await reload();
					}
				}, String(row.id)))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "NAVIGATION"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-3",
				children: data.navigation.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBlock, {
					row,
					onSave: async (payload) => {
						await adminSaveNav({ data: payload });
						setNote("Navigation saved.");
						await reload();
					}
				}, String(row.id)))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "FAQS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-3",
				children: data.faqs.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqBlock, {
					row,
					onSave: async (payload) => {
						await adminSaveFaq({ data: payload });
						setNote("FAQ saved.");
						await reload();
					}
				}, String(row.id)))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "POLICIES"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-3",
				children: data.policies.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyBlock, {
					row,
					onSave: async (payload) => {
						await adminSavePolicy({ data: payload });
						setNote("Policy saved.");
						await reload();
					}
				}, String(row.id)))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
					children: "MEDIA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 flex flex-wrap gap-2",
					onSubmit: async (e) => {
						e.preventDefault();
						await adminAddMedia({ data: {
							url: mediaUrl,
							altText: mediaAlt
						} });
						setMediaUrl("");
						setMediaAlt("");
						setNote("Media added.");
						await reload();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field max-w-sm",
							placeholder: "IMAGE URL",
							value: mediaUrl,
							onChange: (e) => setMediaUrl(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "cour-field max-w-sm",
							placeholder: "ALT TEXT",
							value: mediaAlt,
							onChange: (e) => setMediaAlt(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cour-btn",
							type: "submit",
							children: "ADD"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: data.media.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaBlock, {
						row,
						onSave: async (payload) => {
							await adminSaveMedia({ data: payload });
							setNote("Media saved.");
							await reload();
						}
					}, String(row.id)))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "INQUIRIES"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 divide-y divide-line border border-line",
				children: [data.inquiries.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "p-3 font-mono text-sm",
					children: [
						String(row.email),
						" — ",
						String(row.kind)
					]
				}, String(row.id))), data.inquiries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-sm text-mist",
					children: "No inquiries yet."
				}) : null]
			})] })
		]
	});
}
function SettingsBlock({ settings, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		brandName: String(settings.brand_name ?? "COUR"),
		tagline: String(settings.tagline ?? ""),
		contactEmail: String(settings.contact_email ?? ""),
		announcement: String(settings.announcement ?? ""),
		announcementEnabled: Boolean(settings.announcement_enabled),
		footerNote: String(settings.footer_note ?? ""),
		shippingNote: String(settings.shipping_note ?? ""),
		socialInstagram: String(settings.social_instagram ?? ""),
		socialX: String(settings.social_x ?? "")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[0.7rem] tracking-[0.16em] text-mist",
				children: "SITE SETTINGS"
			}),
			Object.entries(form).map(([key, value]) => key === "announcementEnabled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 font-mono text-[0.7rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.announcementEnabled,
					onChange: (e) => setForm({
						...form,
						announcementEnabled: e.target.checked
					})
				}), "ANNOUNCEMENT ENABLED"]
			}, key) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cour-label",
					children: key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "cour-field mt-1",
					value: String(value),
					onChange: (e) => setForm({
						...form,
						[key]: e.target.value
					})
				})]
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn",
				type: "submit",
				children: "SAVE SETTINGS"
			})
		]
	});
}
function SectionBlock({ row, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		id: String(row.id),
		title: String(row.title ?? ""),
		body: String(row.body ?? ""),
		ctaLabel: String(row.cta_label ?? ""),
		ctaHref: String(row.cta_href ?? ""),
		enabled: Boolean(row.enabled),
		content: String(row.content ?? "{}")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2 border border-line p-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[0.62rem] tracking-[0.16em] text-dim",
				children: String(row.section_key)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.title,
				onChange: (e) => setForm({
					...form,
					title: e.target.value
				}),
				placeholder: "TITLE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "cour-field min-h-20",
				value: form.body,
				onChange: (e) => setForm({
					...form,
					body: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.ctaLabel,
				onChange: (e) => setForm({
					...form,
					ctaLabel: e.target.value
				}),
				placeholder: "CTA LABEL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.ctaHref,
				onChange: (e) => setForm({
					...form,
					ctaHref: e.target.value
				}),
				placeholder: "CTA HREF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "cour-field min-h-24 font-mono text-xs",
				value: form.content,
				onChange: (e) => setForm({
					...form,
					content: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 font-mono text-[0.7rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.enabled,
					onChange: (e) => setForm({
						...form,
						enabled: e.target.checked
					})
				}), "ENABLED"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn",
				type: "submit",
				children: "SAVE SECTION"
			})
		]
	});
}
function NavBlock({ row, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		id: String(row.id),
		label: String(row.label),
		href: String(row.href),
		visible: Boolean(row.visible)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "flex flex-wrap items-center gap-2",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field max-w-40",
				value: form.label,
				onChange: (e) => setForm({
					...form,
					label: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field max-w-56",
				value: form.href,
				onChange: (e) => setForm({
					...form,
					href: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "font-mono text-[0.62rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.visible,
						onChange: (e) => setForm({
							...form,
							visible: e.target.checked
						})
					}),
					" ",
					"VISIBLE"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn h-9 min-h-9",
				type: "submit",
				children: "SAVE"
			})
		]
	});
}
function FaqBlock({ row, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		id: String(row.id),
		question: String(row.question),
		answer: String(row.answer),
		published: Boolean(row.published)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2 border border-line p-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.question,
				onChange: (e) => setForm({
					...form,
					question: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "cour-field min-h-20",
				value: form.answer,
				onChange: (e) => setForm({
					...form,
					answer: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn",
				type: "submit",
				children: "SAVE FAQ"
			})
		]
	});
}
function PolicyBlock({ row, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		id: String(row.id),
		title: String(row.title),
		body: String(row.body),
		published: Boolean(row.published)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2 border border-line p-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.title,
				onChange: (e) => setForm({
					...form,
					title: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "cour-field min-h-24",
				value: form.body,
				onChange: (e) => setForm({
					...form,
					body: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn",
				type: "submit",
				children: "SAVE POLICY"
			})
		]
	});
}
function MediaBlock({ row, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		id: String(row.id),
		url: String(row.url),
		altText: String(row.alt_text ?? "")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2 border border-line p-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: form.url,
				alt: form.altText,
				className: "h-28 w-full object-contain bg-void"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.url,
				onChange: (e) => setForm({
					...form,
					url: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cour-field",
				value: form.altText,
				onChange: (e) => setForm({
					...form,
					altText: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "cour-btn",
				type: "submit",
				children: "SAVE MEDIA"
			})
		]
	});
}
//#endregion
export { AdminContent as component };
