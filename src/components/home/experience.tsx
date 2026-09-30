import { Link } from "@tanstack/react-router";
import { useCallback, useLayoutEffect, useState, useRef } from "react";
import { ProductTile } from "@/components/site/product-card";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Hud } from "@/components/site/hud";
import { SpecIcon, SPEC_ICON } from "@/components/site/spec-icons";
import { DecodeText } from "@/components/site/decode-text";
import { scrollPinTo, useStagePointer, useStageProgress } from "@/components/home/use-stage";
import type { HomeSection, ProductCard, Storefront } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "form", n: "01", label: "FORM", at: 0 },
  { id: "surface", n: "02", label: "SURFACE", at: 0.2 },
  { id: "line", n: "03", label: "LINE", at: 0.42 },
  { id: "build", n: "04", label: "BUILD", at: 0.64 },
  { id: "know", n: "05", label: "KNOW", at: 0.84 },
] as const;

function section(store: Storefront, key: string): HomeSection | undefined {
  return store.sections.find((s) => s.sectionKey === key);
}

export function HomeExperience({ store }: { store: Storefront }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState("form");
  const [ready, setReady] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(store.faqs[0]?.id ?? null);
  const onChapter = useCallback((id: string) => setChapter(id), []);
  useStageProgress(stageRef, onChapter);
  useStagePointer(stageRef, tiltRef);

  const hero = section(store, "hero");
  const details = section(store, "details");
  const collections = section(store, "collections");
  const tech = section(store, "construction");
  const know = section(store, "know");
  const specs = details?.content.specs ?? [];
  const layers = tech?.content.layers ?? [];
  const lineOrder = ["shadow-puffer", "tactical-hooded", "thermal-bomber", "tech-shell"];
  const featured = lineOrder
    .map((slug) => store.products.find((p) => p.slug === slug))
    .filter((p): p is ProductCard => Boolean(p));
  const heroImg =
    store.products.find((p) => p.slug === "void-puffer")?.image ?? "/media/void-puffer.webp";
  const content = hero?.content ?? {};

  useLayoutEffect(() => {
    let cancelled = false;
    const mark = () => {
      if (!cancelled) setReady(true);
    };
    const img = new Image();
    img.src = heroImg;
    const fallback = window.setTimeout(mark, 2800);
    const done = () => {
      window.clearTimeout(fallback);
      mark();
    };
    if (img.complete && img.naturalWidth > 0) {
      done();
      return () => {
        cancelled = true;
        window.clearTimeout(fallback);
      };
    }
    void img.decode?.().then(done).catch(done);
    img.onload = done;
    img.onerror = done;
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [heroImg]);

  function go(at: number) {
    const pin = stageRef.current?.closest(".cour-pin");
    if (!(pin instanceof HTMLElement)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollPinTo(pin, at, !reduced);
  }

  return (
    <div className="cour-app" data-ready={ready ? "true" : "false"} data-stage-ready={ready ? "true" : "false"}>
      <div className="cour-pin">
        <div
          ref={stageRef}
          className="cour-stage"
          data-act={chapter}
          aria-busy={!ready}
        >
          <div className="cour-grid" />
          <div className="cour-grid-hot" />
          <Hud />
          <Loader hide={ready} />
          <SiteNav items={store.navigation} overlay variant="hero" />

          <ol className="cour-index">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={cn("cour-index-btn", chapter === c.id && "is-on")}
                  onClick={() => go(c.at)}
                >
                  {c.n} {c.label}
                </button>
              </li>
            ))}
          </ol>

          <div className="cour-slot">
            <div ref={tiltRef} className="cour-tilt">
              <img
                src={heroImg}
                alt="COUR Void Puffer"
                width={1200}
                height={1600}
                fetchPriority="high"
                decoding="async"
                className="cour-jacket"
                onLoad={() => setReady(true)}
              />
            </div>
          </div>

          <FormLayer hero={hero} content={content} active={chapter === "form"} />
          <SurfaceLayer section={details} specs={specs} />
          <LineLayer section={collections} products={featured} />
          <BuildLayer section={tech} layers={layers} />
          <KnowLayer
            section={know}
            faqs={store.faqs}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
          />
          <div className="cour-rail" aria-hidden="true">
            <span className="cour-rail-thumb" />
          </div>
        </div>
        <div className="cour-track" aria-hidden="true" />
      </div>
      <SiteFooter settings={store.settings} items={store.navigation} />
    </div>
  );
}

function Loader({ hide }: { hide: boolean }) {
  return (
    <div className={cn("cour-loader", hide && "is-gone")} aria-hidden={hide} role="status">
      <svg viewBox="0 0 32 32" className="h-10 w-10 text-ink" aria-hidden="true">
        <rect x="1.2" y="1.2" width="29.6" height="29.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M23.5 8.2 H11.2 V23.8 H23.5" fill="none" stroke="currentColor" strokeWidth="4.4" />
      </svg>
      <p className="cour-wordmark mt-3">COUR</p>
      <p className="mt-4 font-mono text-[0.62rem] tracking-[0.22em] text-mist">PLEASE WAIT</p>
    </div>
  );
}

function FormLayer({
  hero,
  content,
  active,
}: {
  hero?: HomeSection;
  content: HomeSection["content"];
  active: boolean;
}) {
  return (
    <div className="cour-layer cour-layer-form" style={{ opacity: "var(--form-o)" }}>
      <p className="cour-edge cour-edge-l">
        <DecodeText text={content.leftTitle ?? "ENGINEERED FOR MOTION."} active={active} />
        <br />
        <DecodeText text={content.leftBody ?? "BUILT TO ENDURE."} active={active} />
      </p>
      <p className="cour-edge cour-edge-r">
        <DecodeText text={content.rightTitle ?? "DESIGNED FOR THE UNKNOWN."} active={active} />
        <br />
        <DecodeText text={content.rightBody ?? "READY FOR ANYTHING."} active={active} />
      </p>
      <aside className="cour-chip cour-chip-l">
        <ClockIcon />
        <span>
          <strong>{content.established ?? "EST. 2022"} COUR.</strong>
          <em>{content.establishedNote ?? "BUILT FOR CONTINUAL WEATHER, MOTION AND FOCUS IN USE."}</em>
        </span>
      </aside>
      <aside className="cour-chip cour-chip-r">
        <PinIcon />
        <span>
          <strong>WORLDWIDE SHIPPING</strong>
          <em>SECURE GLOBAL DELIVERY</em>
        </span>
      </aside>
      <div className="cour-hero-foot">
        <p className="cour-ticker">
          <DecodeText
            text={
              content.ticker ??
              "WEATHER-RESISTANT. THERMAL INSULATION. OVERSIZED FIT. LIMITED QUANTITY."
            }
            active={active}
          />
        </p>
        <Link to="/shop" className="cour-btn cour-btn-ghost">
          {hero?.ctaLabel ?? "SHOP NOW"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function SurfaceLayer({
  section,
  specs,
}: {
  section?: HomeSection;
  specs: Array<{ id: string; title: string; body: string }>;
}) {
  return (
    <div className="cour-layer cour-layer-split cour-layer-surf" style={{ opacity: "var(--surf-o)" }}>
      <div className="cour-readout">
        <h2 className="cour-display text-[clamp(2rem,5vw,3.6rem)]">
          {section?.title ?? "DETAILS MATTER."}
        </h2>
        <p className="mt-4 max-w-[34ch] text-[0.82rem] leading-relaxed text-mist">{section?.body}</p>
        <Link to="/product/$slug" params={{ slug: "void-puffer" }} className="cour-btn cour-btn-ghost mt-6">
          {section?.ctaLabel ?? "EXPLORE THE JACKET"} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="cour-spec-col">
        {specs.map((spec, i) => (
          <li key={spec.id} className="cour-spec">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[0.58rem] tracking-[0.16em] text-dim">{spec.id}</p>
              <SpecIcon name={SPEC_ICON[i] ?? "fit"} />
            </div>
            <p className="mt-2 text-[0.72rem] tracking-[0.08em]">{spec.title}</p>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-mist">{spec.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineLayer({
  section,
  products,
}: {
  section?: HomeSection;
  products: ProductCard[];
}) {
  return (
    <div className="cour-layer cour-layer-line" style={{ opacity: "var(--line-o)" }}>
      <div className="cour-line-head">
        <h2 className="cour-display text-[clamp(2rem,5vw,3.6rem)]">
          {section?.title ?? "COLLECTIONS."}
        </h2>
        <p className="max-w-sm text-[0.78rem] leading-relaxed text-mist">{section?.body}</p>
      </div>
      <div className="cour-film">
        {products.map((p, i) => (
          <ProductTile key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="flex justify-center pb-5">
        <Link to="/shop" className="cour-btn cour-btn-ghost">
          {section?.ctaLabel ?? "VIEW ALL JACKETS"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function BuildLayer({
  section,
  layers,
}: {
  section?: HomeSection;
  layers: Array<{ id: string; title: string; body: string }>;
}) {
  return (
    <div className="cour-layer cour-layer-split cour-layer-build" style={{ opacity: "var(--build-o)" }}>
      <div className="cour-readout">
        <h2 className="cour-display cour-tech-title whitespace-pre-line text-[clamp(1.7rem,4.2vw,3rem)]">
          {section?.title ?? "TECHNOLOGY\nENGINEERED\nTO ENDURE"}
        </h2>
        <p className="mt-5 max-w-[40ch] text-[0.8rem] leading-relaxed text-mist">{section?.body}</p>
      </div>
      <div className="cour-build-art">
        <img
          src="/media/construction.jpg"
          alt="Exploded COUR material layers"
          width={1400}
          height={1400}
          loading="lazy"
          decoding="async"
        />
        <ul className="cour-layer-list">
          {layers.map((layer) => (
            <li key={layer.id}>
              <span>{layer.id}</span>
              <strong>{layer.title}</strong>
              <em>{layer.body}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KnowLayer({
  section,
  faqs,
  openFaq,
  setOpenFaq,
}: {
  section?: HomeSection;
  faqs: Storefront["faqs"];
  openFaq: string | null;
  setOpenFaq: (id: string | null) => void;
}) {
  return (
    <div className="cour-layer cour-layer-know" style={{ opacity: "var(--know-o)" }}>
      <div className="cour-readout ml-auto w-full max-w-lg">
        <h2 className="cour-display text-[clamp(1.8rem,4.6vw,3.2rem)]">
          {section?.title ?? "NEED TO KNOW."}
        </h2>
        <div className="cour-faq">
          {faqs.map((faq) => {
            const open = openFaq === faq.id;
            return (
              <button
                key={faq.id}
                type="button"
                aria-expanded={open}
                onClick={() => setOpenFaq(open ? null : faq.id)}
                className="cour-faq-item"
              >
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-dim" aria-hidden="true">
                    {open ? "–" : "+"}
                  </span>
                </span>
                <span className={cn("cour-faq-body", open && "is-open")}>
                  <span className="cour-faq-inner">{faq.answer}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-mist" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-mist" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}
