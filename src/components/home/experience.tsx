import { useCallback, useMemo, useRef, useState } from "react";
import { ProductTile } from "@/components/site/product-card";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Hud } from "@/components/site/hud";
import { BrandWord } from "@/components/site/brand-mark";
import {
  BuildLayer,
  FormLayer,
  KnowLayer,
  LineLayer,
  SurfaceLayer,
} from "@/components/home/sections";
import { scrollPinTo, useStagePointer, useStageProgress, useStageReadiness } from "@/components/home/use-stage";
import { CHAPTERS, chapterStop, type ChapterId } from "@/lib/stage/timeline";
import type { HomeSection, ProductCard, Storefront } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The COUR homepage: one immersive stage with five chapters.
 *
 * Structural contract:
 *
 *   .cour-pin            — the sticky track; owns the scrollable height
 *     .cour-stage        — the rounded viewport, sticky at the top
 *       .cour-grid       — the technical grid, clipped by the stage radius
 *       .cour-jacket     — the specimen, driven by `--jx/--jy/--js/--jo`
 *       .cour-layer-*    — the five chapter bodies, driven by `--<id>-o/-y/-z/-v/-p`
 *     [the layer bodies]
 *     .cour-track        — the spacer that gives the pin its scroll range
 *   footer               — OUTSIDE the pin: ordinary page content, never
 *                          stretched by, or stretching, the timeline
 *
 * The footer deliberately sits outside the sticky track. It used to be nested
 * with the stage, which both made the document height depend on footer copy and
 * left the footer subject to the stage's own scroll styling.
 */

const DEFAULT_LINE_ORDER = ["shadow-puffer", "tactical-hooded", "thermal-bomber", "tech-shell"];

function section(store: Storefront, key: string): HomeSection | undefined {
  return store.sections.find((s) => s.sectionKey === key);
}

export function HomeExperience({ store }: { store: Storefront }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<ChapterId>("form");
  const [openFaq, setOpenFaq] = useState<string | null>(store.faqs[0]?.id ?? null);

  const hero = section(store, "hero");
  const details = section(store, "details");
  const collections = section(store, "collections");
  const tech = section(store, "construction");
  const know = section(store, "know");

  const order = collections?.content.productSlugs?.length
    ? collections.content.productSlugs
    : DEFAULT_LINE_ORDER;
  const featured = useMemo(
    () =>
      order
        .map((slug) => store.products.find((p) => p.slug === slug))
        .filter((p): p is ProductCard => Boolean(p)),
    [order, store.products],
  );

  const heroImg = useMemo(
    () => store.products.find((p) => p.slug === "void-puffer")?.image ?? "/media/void-puffer.webp",
    [store.products],
  );

  // The only assets the first visible frame needs. Everything else (the four
  // product plates, the material stack) is lazy — the loader must not wait on
  // images the visitor cannot see yet.
  const criticalAssets = useMemo(() => [heroImg], [heroImg]);
  const { ready, show: showLoader } = useStageReadiness(criticalAssets);

  const onChapter = useCallback((id: ChapterId) => setChapter(id), []);
  // The stage does not animate until the critical frame is decoded, so the
  // first painted frame is the composed FORM chapter rather than a half-arrived
  // one.
  useStageProgress(stageRef, onChapter, ready);
  useStagePointer(stageRef, tiltRef, ready);

  const go = useCallback((id: ChapterId) => {
    const stage = stageRef.current;
    const pin = stage?.closest(".cour-pin");
    if (!(pin instanceof HTMLElement)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollPinTo(pin, chapterStop(id), !reduced);
  }, []);

  const toggleFaq = useCallback((id: string) => {
    setOpenFaq((current) => (current === id ? null : id));
  }, []);

  return (
    <div className="cour-app">
      <div className="cour-pin">
        {/* The sticky window. The stage is a fixed-aspect band centred inside it,
            which is what the reference frame shows: an inset rounded frame with
            the page's black around it, not a full-bleed viewport. */}
        <div className="cour-viewport">
        <div
          ref={stageRef}
          className="cour-stage"
          data-stage-ready={ready ? "true" : "false"}
          data-stage-progress="0.0000"
          data-stage-chapter="form"
          data-act="form"
          aria-busy={ready ? undefined : true}
        >
          <div className="cour-grid" />
          <div className="cour-stage-frame" aria-hidden="true" />
          <Hud />
          {showLoader && !ready ? <Loader /> : null}

          <SiteNav items={store.navigation} collections={store.collections} overlay variant="hero" />

          <ol className="cour-index" aria-label="Chapters">
            {CHAPTERS.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={cn("cour-index-btn", chapter === entry.id && "is-on")}
                  aria-current={chapter === entry.id ? "true" : undefined}
                  onClick={() => go(entry.id)}
                >
                  <span className="cour-index-n">{entry.n}</span> {entry.label}
                </button>
              </li>
            ))}
          </ol>

          <div className="cour-slot">
            <div ref={tiltRef} className="cour-tilt">
              {/* The specimen. `data-specimen` is the stable hook the visual
                  regression suite measures against. */}
              <img
                data-specimen="hero"
                src={heroImg}
                alt="COUR Void Puffer: dark iridescent cropped technical jacket"
                width={900}
                height={1051}
                fetchPriority="high"
                decoding="sync"
                className="cour-jacket"
              />
            </div>
          </div>

          <FormLayer hero={hero} active={chapter === "form"} />
          <SurfaceLayer
            section={details}
            specs={details?.content.specs ?? []}
            active={chapter === "surface"}
          />
          <LineLayer section={collections} products={featured} active={chapter === "line"} />
          <BuildLayer
            section={tech}
            layers={tech?.content.layers ?? []}
            active={chapter === "build"}
          />
          <KnowLayer
            section={know}
            faqs={store.faqs}
            openFaq={openFaq}
            onToggle={toggleFaq}
            currency={store.settings.currency}
            active={chapter === "know"}
          />

          <div className="cour-rail" aria-hidden="true">
            <span className="cour-rail-thumb" />
          </div>
        </div>
        </div>

        <div className="cour-track" aria-hidden="true" />
      </div>

      {/* A plain index of the collection follows the stage: it makes the four
          jackets reachable without scrolling through the cinematic, which is
          also what keeps the page usable when motion is reduced. */}
      <section className="cour-after" aria-label="Collection">
        <div className="cour-after-inner">
          <h2 className="cour-display cour-after-title">{collections?.title ?? "COLLECTIONS."}</h2>
          <div className="cour-after-grid">
            {featured.map((product, index) => (
              <ProductTile key={product.id} product={product} index={index} variant="page" />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter settings={store.settings} items={store.navigation} />
    </div>
  );
}

/**
 * The loader shown before the critical frame is decoded.
 *
 * It appears only when readiness is still pending after a short delay, and it
 * always reports the same wordmark the stage opens with — the visual match to
 * the reference is limited to what is observable, so this stays a static
 * mark-and-caption rather than an invented sequence.
 */
function Loader() {
  return (
    <div className="cour-loader" role="status" aria-live="polite">
      <BrandWord className="cour-loader-word" />
      <p className="cour-loader-note">PREPARING INSPECTION</p>
    </div>
  );
}
