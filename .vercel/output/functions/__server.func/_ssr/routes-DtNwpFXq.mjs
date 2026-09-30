import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as Route$18 } from "./router-PwxNvrjr.mjs";
import { t as cn } from "./utils-4_bTDmXX.mjs";
import { n as SiteFooter, r as SiteNav, t as Hud } from "./hud-CSbugAQe.mjs";
import { t as ProductTile } from "./product-card-D3uw9fCO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DtNwpFXq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpecIcon({ name }) {
	const common = {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.4,
		className: "h-4 w-4 text-mist",
		"aria-hidden": true
	};
	switch (name) {
		case "weather": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 16h11a3.5 3.5 0 0 0 .2-7 5 5 0 0 0-9.6-1.4A3.8 3.8 0 0 0 7 16Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 19v1M12 19v2M15 19v1" })]
		});
		case "thermal": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 13.5V6.2a2 2 0 1 1 4 0v7.3a3.2 3.2 0 1 1-4 0Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8.5v5" })]
		});
		case "stitch": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 19c4-1 6-7 4-12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "6",
					r: "1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5h8M12 9h6M4 19h7" })
			]
		});
		case "pocket": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 8h12v10H6z" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 12h12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 12v6" })
			]
		});
		case "fit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			...common,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 12h16M8 8 4 12l4 4M16 8l4 4-4 4" })
		});
		default: return null;
	}
}
var SPEC_ICON = [
	"weather",
	"thermal",
	"stitch",
	"pocket",
	"fit"
];
var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function DecodeText({ text, active, className, as: Tag = "span" }) {
	const [out, setOut] = (0, import_react.useState)(text);
	(0, import_react.useEffect)(() => {
		if (!active) {
			setOut(text);
			return;
		}
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setOut(text);
			return;
		}
		let frame = 0;
		const total = 14;
		const id = window.setInterval(() => {
			frame += 1;
			const t = Math.min(1, frame / total);
			setOut(text.split("").map((ch, i) => {
				if (ch === " " || ch === "." || ch === "/" || ch === "-") return ch;
				if (i / text.length < t) return text[i];
				return GLYPHS[Math.floor(Math.random() * 36)] ?? ch;
			}).join(""));
			if (t >= 1) window.clearInterval(id);
		}, 32);
		return () => window.clearInterval(id);
	}, [active, text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className,
		children: out
	});
}
var JACKET = [
	[0, {
		x: 0,
		y: 0,
		s: 1,
		o: 1
	}],
	[.1, {
		x: 0,
		y: 0,
		s: 1,
		o: 1
	}],
	[.2, {
		x: -11,
		y: 3,
		s: 1.16,
		o: 1
	}],
	[.34, {
		x: -11,
		y: 3,
		s: 1.16,
		o: 1
	}],
	[.44, {
		x: 0,
		y: -20,
		s: .4,
		o: .38
	}],
	[.56, {
		x: 0,
		y: -22,
		s: .36,
		o: .2
	}],
	[.66, {
		x: 4,
		y: -4,
		s: .72,
		o: .06
	}],
	[.8, {
		x: -16,
		y: 16,
		s: .58,
		o: .38
	}],
	[1, {
		x: -16,
		y: 18,
		s: .58,
		o: .42
	}]
];
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function sample(keys, p) {
	if (p <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [p1, b] = keys[i];
		const [p0, a] = keys[i - 1];
		if (p <= p1) {
			const t = (p - p0) / Math.max(1e-4, p1 - p0);
			return {
				x: lerp(a.x, b.x, t),
				y: lerp(a.y, b.y, t),
				s: lerp(a.s, b.s, t),
				o: lerp(a.o, b.o, t)
			};
		}
	}
	return keys[keys.length - 1][1];
}
function gate(p, a, b, c, d) {
	if (p <= a || p >= d) return 0;
	if (p < b) return (p - a) / Math.max(1e-4, b - a);
	if (p > c) return 1 - (p - c) / Math.max(1e-4, d - c);
	return 1;
}
function chapterOf(p) {
	if (p < .18) return "form";
	if (p < .4) return "surface";
	if (p < .62) return "line";
	if (p < .82) return "build";
	return "know";
}
function useStageProgress(stageRef, onChapter) {
	(0, import_react.useEffect)(() => {
		const stage = stageRef.current;
		if (!stage) return;
		let raf = 0;
		let last = "";
		const chapterCb = onChapter;
		const apply = () => {
			raf = 0;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const p = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
			const j = sample(JACKET, p);
			stage.style.setProperty("--jx", `${j.x}%`);
			stage.style.setProperty("--jy", `${j.y}%`);
			stage.style.setProperty("--js", j.s.toFixed(3));
			stage.style.setProperty("--jo", j.o.toFixed(3));
			stage.style.setProperty("--form-o", gate(p, -.05, 0, .1, .22).toFixed(3));
			stage.style.setProperty("--surf-o", gate(p, .1, .2, .34, .46).toFixed(3));
			stage.style.setProperty("--line-o", gate(p, .34, .44, .56, .68).toFixed(3));
			stage.style.setProperty("--build-o", gate(p, .54, .64, .76, .88).toFixed(3));
			stage.style.setProperty("--know-o", gate(p, .74, .84, 1.05, 1.2).toFixed(3));
			stage.style.setProperty("--rail", p.toFixed(4));
			const ch = chapterOf(p);
			if (ch !== last) {
				last = ch;
				stage.dataset.act = ch;
				chapterCb(ch);
			}
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(apply);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		apply();
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	}, [stageRef, onChapter]);
}
function useStagePointer(stageRef, tiltRef) {
	(0, import_react.useEffect)(() => {
		const stage = stageRef.current;
		const tilt = tiltRef.current;
		if (!stage || !tilt) return;
		const coarse = window.matchMedia("(pointer: coarse)").matches;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (coarse || reduced) return;
		const hot = stage.querySelector(".cour-grid-hot");
		let mx = 0;
		let my = 0;
		let tx = 0;
		let ty = 0;
		let raf = 0;
		const tick = () => {
			mx += (tx - mx) * .16;
			my += (ty - my) * .16;
			tilt.style.transform = `rotateY(${(mx * 14).toFixed(2)}deg) rotateX(${(-my * 8).toFixed(2)}deg)`;
			if (hot) {
				const r = stage.getBoundingClientRect();
				hot.style.transform = `translate3d(${((mx * .5 + .5) * r.width).toFixed(1)}px, ${((my * .5 + .5) * r.height).toFixed(1)}px, 0)`;
			}
			if (Math.abs(tx - mx) > .002 || Math.abs(ty - my) > .002) raf = requestAnimationFrame(tick);
			else raf = 0;
		};
		const onMove = (e) => {
			const r = stage.getBoundingClientRect();
			if (!r.width || !r.height) return;
			tx = (e.clientX - r.left) / r.width * 2 - 1;
			ty = (e.clientY - r.top) / r.height * 2 - 1;
			if (!raf) raf = requestAnimationFrame(tick);
		};
		const reset = () => {
			tx = 0;
			ty = 0;
			if (!raf) raf = requestAnimationFrame(tick);
		};
		stage.addEventListener("pointermove", onMove, { passive: true });
		stage.addEventListener("pointerleave", reset, { passive: true });
		return () => {
			if (raf) cancelAnimationFrame(raf);
			stage.removeEventListener("pointermove", onMove);
			stage.removeEventListener("pointerleave", reset);
		};
	}, [stageRef, tiltRef]);
}
var CHAPTERS = [
	{
		id: "form",
		n: "01",
		label: "FORM",
		at: 0
	},
	{
		id: "surface",
		n: "02",
		label: "SURFACE",
		at: .24
	},
	{
		id: "line",
		n: "03",
		label: "LINE",
		at: .48
	},
	{
		id: "build",
		n: "04",
		label: "BUILD",
		at: .7
	},
	{
		id: "know",
		n: "05",
		label: "KNOW",
		at: .9
	}
];
function section(store, key) {
	return store.sections.find((s) => s.sectionKey === key);
}
function HomeExperience({ store }) {
	const stageRef = (0, import_react.useRef)(null);
	const tiltRef = (0, import_react.useRef)(null);
	const [chapter, setChapter] = (0, import_react.useState)("form");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [openFaq, setOpenFaq] = (0, import_react.useState)(store.faqs[0]?.id ?? null);
	useStageProgress(stageRef, (0, import_react.useCallback)((id) => setChapter(id), []));
	useStagePointer(stageRef, tiltRef);
	(0, import_react.useEffect)(() => {
		const id = window.setTimeout(() => setReady(true), 1400);
		return () => window.clearTimeout(id);
	}, []);
	const hero = section(store, "hero");
	const details = section(store, "details");
	const collections = section(store, "collections");
	const tech = section(store, "construction");
	const know = section(store, "know");
	const specs = details?.content.specs ?? [];
	const layers = tech?.content.layers ?? [];
	const featured = [
		"shadow-puffer",
		"tactical-hooded",
		"thermal-bomber",
		"tech-shell"
	].map((slug) => store.products.find((p) => p.slug === slug)).filter((p) => Boolean(p));
	const heroImg = store.products.find((p) => p.slug === "void-puffer")?.image ?? "/media/void-puffer.webp";
	const content = hero?.content ?? {};
	function go(at) {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({
			top: max * at,
			behavior: reduced ? "auto" : "smooth"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-app",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-pin",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: stageRef,
				className: "cour-stage",
				"data-act": chapter,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cour-grid" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cour-grid-hot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, { hide: ready }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {
						items: store.navigation,
						overlay: true,
						variant: "hero"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "cour-index",
						children: CHAPTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("cour-index-btn", chapter === c.id && "is-on"),
							onClick: () => go(c.at),
							children: [
								c.n,
								" ",
								c.label
							]
						}) }, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cour-slot",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: tiltRef,
							className: "cour-tilt",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: heroImg,
								alt: "COUR Void Puffer",
								width: 1200,
								height: 1600,
								fetchPriority: "high",
								decoding: "async",
								className: "cour-jacket",
								onLoad: () => setReady(true)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLayer, {
						hero,
						content,
						active: chapter === "form"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurfaceLayer, {
						section: details,
						specs
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineLayer, {
						section: collections,
						products: featured
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildLayer, {
						section: tech,
						layers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowLayer, {
						section: know,
						faqs: store.faqs,
						openFaq,
						setOpenFaq
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cour-rail",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cour-rail-thumb" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cour-track",
				"aria-hidden": "true"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {
			settings: store.settings,
			items: store.navigation
		})]
	});
}
function Loader({ hide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("cour-loader", hide && "is-gone"),
		"aria-hidden": hide,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 32 32",
				className: "h-10 w-10 text-ink",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "1.2",
					y: "1.2",
					width: "29.6",
					height: "29.6",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M23.5 8.2 H11.2 V23.8 H23.5",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "4.4"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "cour-wordmark mt-3",
				children: "COUR"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-mono text-[0.62rem] tracking-[0.22em] text-mist",
				children: "PLEASE WAIT"
			})
		]
	});
}
function FormLayer({ hero, content, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-layer cour-layer-form",
		style: { opacity: "var(--form-o)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "cour-edge cour-edge-l",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecodeText, {
						text: content.leftTitle ?? "ENGINEERED FOR MOTION.",
						active
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecodeText, {
						text: content.leftBody ?? "BUILT TO ENDURE.",
						active
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "cour-edge cour-edge-r",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecodeText, {
						text: content.rightTitle ?? "DESIGNED FOR THE UNKNOWN.",
						active
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecodeText, {
						text: content.rightBody ?? "READY FOR ANYTHING.",
						active
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "cour-chip cour-chip-l",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockIcon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [content.established === "EST. 2020" ? "EST. 2022" : content.established ?? "EST. 2022", " COUR."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: content.establishedNote ?? "BUILT FOR CONTINUAL WEATHER, MOTION AND FOCUS IN USE." })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "cour-chip cour-chip-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinIcon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "WORLDWIDE SHIPPING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "SECURE GLOBAL DELIVERY" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cour-hero-foot",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cour-ticker",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecodeText, {
						text: content.ticker ?? "WEATHER-RESISTANT. THERMAL INSULATION. OVERSIZED FIT. LIMITED QUANTITY.",
						active
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "cour-btn cour-btn-ghost",
					children: [
						hero?.ctaLabel ?? "SHOP NOW",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})
					]
				})]
			})
		]
	});
}
function SurfaceLayer({ section, specs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-layer cour-layer-split cour-layer-surf",
		style: { opacity: "var(--surf-o)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-readout",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cour-display text-[clamp(2rem,5vw,3.6rem)]",
					children: section?.title ?? "DETAILS MATTER."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-[34ch] text-[0.82rem] leading-relaxed text-mist",
					children: section?.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/product/$slug",
					params: { slug: "void-puffer" },
					className: "cour-btn cour-btn-ghost mt-6",
					children: [
						section?.ctaLabel ?? "EXPLORE THE JACKET",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "cour-spec-col",
			children: specs.map((spec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "cour-spec",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[0.58rem] tracking-[0.16em] text-dim",
							children: spec.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecIcon, { name: SPEC_ICON[i] ?? "fit" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[0.72rem] tracking-[0.08em]",
						children: spec.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[0.7rem] leading-relaxed text-mist",
						children: spec.body
					})
				]
			}, spec.id))
		})]
	});
}
function LineLayer({ section, products }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-layer cour-layer-line",
		style: { opacity: "var(--line-o)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cour-line-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "cour-display text-[clamp(2rem,5vw,3.6rem)]",
					children: section?.title ?? "COLLECTIONS."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-[0.78rem] leading-relaxed text-mist",
					children: section?.body
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cour-film",
				children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTile, {
					product: p,
					index: i
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center pb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "cour-btn cour-btn-ghost",
					children: [
						section?.ctaLabel ?? "VIEW ALL JACKETS",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "→"
						})
					]
				})
			})
		]
	});
}
function BuildLayer({ section, layers }) {
	const title = (section?.title ?? "TECHNOLOGY ENGINEERED TO ENDURE").replace("TECHNOLOGY ENGINEERED TO ENDURE", "TECHNOLOGY\nENGINEERED\nTO ENDURE");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cour-layer cour-layer-split cour-layer-build",
		style: { opacity: "var(--build-o)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-readout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cour-display whitespace-pre-line text-[clamp(1.7rem,4.2vw,3rem)]",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-[40ch] text-[0.8rem] leading-relaxed text-mist",
				children: section?.body
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-build-art",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/construction.jpg",
				alt: "Exploded COUR material layers",
				width: 1400,
				height: 1400,
				loading: "lazy",
				decoding: "async"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "cour-layer-list",
				children: layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: layer.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: layer.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: layer.body })
				] }, layer.id))
			})]
		})]
	});
}
function KnowLayer({ section, faqs, openFaq, setOpenFaq }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cour-layer cour-layer-know",
		style: { opacity: "var(--know-o)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cour-readout ml-auto w-full max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "cour-display text-[clamp(1.8rem,4.6vw,3.2rem)]",
				children: section?.title ?? "NEED TO KNOW."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cour-faq",
				children: faqs.map((faq) => {
					const open = openFaq === faq.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-expanded": open,
						onClick: () => setOpenFaq(open ? null : faq.id),
						className: "cour-faq-item",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-4",
							children: [faq.question, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-dim",
								children: open ? "–" : "+"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("cour-faq-body", open && "is-open"),
							children: faq.answer
						})]
					}, faq.id);
				})
			})]
		})
	});
}
function ClockIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "h-8 w-8 shrink-0 text-mist",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.3",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8v4l3 2" })]
	});
}
function PinIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "h-8 w-8 shrink-0 text-mist",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.3",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "11",
			r: "2"
		})]
	});
}
function Home() {
	const store = Route$18.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeExperience, { store });
}
//#endregion
export { Home as component };
