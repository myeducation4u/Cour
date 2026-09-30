import { Link } from "@tanstack/react-router";
import { DecodeText } from "@/components/site/decode-text";
import { SpecIcon } from "@/components/site/spec-icons";
import { ProductTile } from "@/components/site/product-card";
import type { Faq, HomeSection, LayerItem, ProductCard, SpecItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The five chapter bodies of the homepage stage.
 *
 * Each one renders inside a `.cour-layer` whose opacity, offset, z-index and
 * interactivity come from `@/lib/stage/timeline` via CSS custom properties set
 * on `.cour-stage`. Nothing here decides when it is visible — that is the
 * timeline's job — so a chapter body can never invent its own timing and fall
 * out of sync with the rail.
 */

type ChapterProps = {
  /** True while this chapter is in its hold — gates decorative motion only. */
  active: boolean;
};

const IDENTITY = {
  /* Fallbacks mirror the seed. The database is canonical; these only keep the
     stage renderable if a section row is disabled or missing. */
  leftTitle: "ENGINEERED FOR MOTION.",
  leftBody: "BUILT TO ENDURE.",
  rightTitle: "DESIGNED FOR THE UNKNOWN.",
  rightBody: "READY FOR ANYTHING.",
  ticker: "WEATHER-RESISTANT. THERMAL INSULATION. OVERSIZED FIT. LIMITED QUANTITY.",
  established: "EST. 2022",
  establishedNote: "BUILT FOR CONTINUAL WEATHER, MOTION AND FOCUS IN USE.",
  shippingLabel: "WORLDWIDE SHIPPING",
  shippingDetail: "FAST & SECURE DELIVERY",
  ctaLabel: "SHOP NOW",
} as const;

export function FormLayer({ hero, active }: { hero?: HomeSection } & ChapterProps) {
  const content = hero?.content ?? {};
  const href = hero?.ctaHref ?? "/shop";

  return (
    <div className="cour-layer cour-layer-form">
      <p className="cour-edge cour-edge-l">
        <DecodeText text={content.leftTitle ?? IDENTITY.leftTitle} active={active} />
        <br />
        <DecodeText text={content.leftBody ?? IDENTITY.leftBody} active={active} />
      </p>

      <p className="cour-edge cour-edge-r">
        <DecodeText text={content.rightTitle ?? IDENTITY.rightTitle} active={active} />
        <br />
        <DecodeText text={content.rightBody ?? IDENTITY.rightBody} active={active} />
      </p>

      <aside className="cour-chip cour-chip-l">
        <ClockIcon />
        <span>
          <strong>{content.established ?? IDENTITY.established} COUR.</strong>
          <em>{content.establishedNote ?? IDENTITY.establishedNote}</em>
        </span>
      </aside>

      <aside className="cour-chip cour-chip-r">
        <PinIcon />
        <span>
          <strong>{content.shippingLabel ?? IDENTITY.shippingLabel}</strong>
          <em>{content.shippingDetail ?? IDENTITY.shippingDetail}</em>
        </span>
      </aside>

      <div className="cour-hero-foot">
        <p className="cour-ticker">
          <DecodeText text={content.ticker ?? IDENTITY.ticker} active={active} />
        </p>
        <Link
          to={href}
          className="cour-btn cour-btn-ghost"
          tabIndex={active ? undefined : -1}
          aria-hidden={active ? undefined : true}
        >
          {hero?.ctaLabel ?? content.ctaLabel ?? IDENTITY.ctaLabel}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export function SurfaceLayer({
  section,
  specs,
  active,
}: { section?: HomeSection; specs: SpecItem[] } & ChapterProps) {
  return (
    <div className="cour-layer cour-layer-surface">
      <div className="cour-readout">
        <h2 className="cour-display cour-details-title">
          {section?.title ?? "DETAILS MATTER."}
        </h2>
        <p className="cour-details-body">{section?.body}</p>
        <Link
          to={section?.ctaHref ?? "/product/void-puffer"}
          className="cour-btn cour-btn-ghost cour-details-cta"
          tabIndex={active ? undefined : -1}
        >
          {section?.ctaLabel ?? "EXPLORE THE JACKET"} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="cour-spec-col">
        {specs.map((spec, index) => (
          <li
            key={spec.id}
            className="cour-spec"
            /* Stagger is a CSS animation keyed off the chapter's own opacity, so
               the five cards arrive in sequence rather than as one block. */
            style={{ ["--i" as string]: String(index) }}
          >
            <div className="cour-spec-head">
              <p className="cour-spec-id">{spec.id}</p>
              <SpecIcon name={SPEC_ORDER[index] ?? "fit"} />
            </div>
            <p className="cour-spec-title">{spec.title}</p>
            <p className="cour-spec-body">{spec.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Icon order for the five reference specs. The stored content carries an
 * optional per-card `icon`; when it is absent the canonical order applies so
 * the column never renders five identical glyphs.
 */
const SPEC_ORDER = ["weather", "thermal", "stitch", "pocket", "fit"] as const;

export function LineLayer({
  section,
  products,
  active,
}: { section?: HomeSection; products: ProductCard[] } & ChapterProps) {
  return (
    <div className="cour-layer cour-layer-line">
      <div className="cour-line-head">
        <h2 className="cour-display cour-line-title">{section?.title ?? "COLLECTIONS."}</h2>
        <p className="cour-line-body">{section?.body}</p>
      </div>

      <div className="cour-film">
        {products.map((product, index) => (
          <ProductTile
            key={product.id}
            product={product}
            index={index}
            interactive={active}
            variant="stage"
          />
        ))}
      </div>

      <div className="cour-line-foot">
        <Link
          to={section?.ctaHref ?? "/shop"}
          className="cour-btn cour-btn-ghost"
          tabIndex={active ? undefined : -1}
        >
          {section?.ctaLabel ?? "VIEW ALL JACKETS"} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/**
 * TECHNOLOGY: the exploded material stack.
 *
 * The reference shows one jacket separated into four physical layers with the
 * labels tied to the plates. There is no 3D model in the workspace, so this is
 * the 2.5D strategy the brief ranks above a fabricated CGI object: the four
 * plates are four horizontally-cropped bands of the real `construction.jpg`
 * (which is exactly this exploded stack, photographed on black), each lifted on
 * its own transform against `--sep`.
 *
 * Because the plates are cropped from one photograph, the assembly is
 * impossible to get wrong — the layers are the actual garment, in the actual
 * order, and they cannot drift out of register with the labels.
 */
export function BuildLayer({
  section,
  layers,
  active,
}: { section?: HomeSection; layers: LayerItem[] } & ChapterProps) {
  const heading = section?.title ?? "TECHNOLOGY\nENGINEERED\nTO ENDURE";
  const plates = layers.length ? layers : FALLBACK_LAYERS;

  return (
    <div className="cour-layer cour-layer-build">
      <div className="cour-readout">
        <h2 className="cour-display cour-tech-title">{heading}</h2>
        <p className="cour-tech-body">{section?.body}</p>
      </div>

      <div className="cour-build-art">
        <div className="cour-stack" aria-hidden="true">
          {plates.map((layer, index) => (
            <img
              key={layer.id}
              className="cour-stack-plate"
              src={layer.asset ?? STACK_PLATES[index] ?? STACK_PLATES[0]}
              alt=""
              width={900}
              height={1208}
              loading="lazy"
              decoding="async"
              style={{ ["--i" as string]: String(index), ["--n" as string]: String(plates.length) }}
            />
          ))}
        </div>

        <ol className="cour-layer-list">
          {/* Labels are absolutely positioned against the chapter on a wide
              stage and flow under the stack on a narrow one; both are the same
              list, so the numbering can never differ between the two. */}
          {plates.map((layer, index) => (
            <li
              key={layer.id}
              className={cn("cour-layer-item", active && "is-on")}
              style={{ ["--i" as string]: String(index), ["--n" as string]: String(plates.length) }}
            >
              <span className="cour-layer-idx">{layer.id}</span>
              <div className="cour-layer-copy">
                <strong>{layer.title}</strong>
                <em>{layer.body}</em>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {section?.ctaHref ? (
        <div className="cour-build-foot">
          <Link to={section.ctaHref} className="cour-btn cour-btn-ghost" tabIndex={active ? undefined : -1}>
            {section.ctaLabel ?? "SHOP THE JACKET"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Plate sources, in stack order.
 *
 * Four transparent PNGs derived from `public/media/construction.jpg` by
 * `scripts/build-stack-layers.sh` — one photograph of this exact garment
 * separated into its four layers, keyed apart so each can move independently.
 * Because they all come from one source image on one canvas, the assembly can
 * never fall out of register.
 */
const STACK_PLATES = [
  "/media/layers/shell.png",
  "/media/layers/membrane.png",
  "/media/layers/thermal.png",
  "/media/layers/lining.png",
] as const;

const FALLBACK_LAYERS: LayerItem[] = [
  {
    id: "01",
    title: "OUTER SHELL",
    body: "Durable outer layer that repels water and protects against wind and rain.",
  },
  {
    id: "02",
    title: "BREATHABLE MEMBRANE",
    body: "Moisture-managing membrane that keeps the silhouette clean in changing weather.",
  },
  {
    id: "03",
    title: "THERMAL INSULATION",
    body: "Aligned thermal fill that traps heat without adding unnecessary weight.",
  },
  {
    id: "04",
    title: "COMFORT LINING",
    body: "Soft inner layer for motion without surface friction.",
  },
];

export function KnowLayer({
  section,
  faqs,
  openFaq,
  onToggle,
  currency,
  active,
}: {
  section?: HomeSection;
  faqs: Faq[];
  openFaq: string | null;
  onToggle: (id: string) => void;
  currency: string;
} & ChapterProps) {
  return (
    <div className="cour-layer cour-layer-know">
      <div className="cour-know-head">
        <h2 className="cour-display cour-know-title">{section?.title ?? "NEED TO KNOW."}</h2>
      </div>

      <div className="cour-know-body">
        {section?.body ? <p className="cour-know-copy">{section.body}</p> : null}
        <div className="cour-faq">
          {faqs.map((faq) => {
            const open = openFaq === faq.id;
            return (
              <div key={faq.id} className={cn("cour-faq-item", open && "is-open")}>
                <h3>
                  <button
                    type="button"
                    className="cour-faq-trigger"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    tabIndex={active ? undefined : -1}
                    onClick={() => onToggle(faq.id)}
                  >
                    <span className="cour-faq-q">{faq.question}</span>
                    <span className="cour-faq-mark" aria-hidden="true" />
                  </button>
                </h3>
                {/*
                  The panel is always in the DOM so the height can animate and so
                  screen readers get a stable relationship, but it is hidden from
                  assistive tech and from the tab order while collapsed.
                */}
                <div
                  className="cour-faq-panel"
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  hidden={!open}
                >
                  <p className="cour-faq-a">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="cour-know-note">
          Prices are shown in {currency}. The studio confirms every order before dispatch.
        </p>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="cour-chip-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6V12l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="cour-chip-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.1" />
    </svg>
  );
}
