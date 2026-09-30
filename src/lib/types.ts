import { validateSectionContent } from "@/lib/section-schema";
import type { StockAvailability } from "@/lib/commerce-rules";

export type JsonScalar = string | number | boolean | null;
export type JsonRow = Record<string, JsonScalar>;

export function asJsonRow(row: object): JsonRow {
  const out: JsonRow = {};
  for (const [key, value] of Object.entries(row)) {
    if (/^\d+$/.test(key)) continue;
    if (value == null) out[key] = null;
    else if (typeof value === "string" || typeof value === "boolean") out[key] = value;
    else if (typeof value === "number") out[key] = Number.isFinite(value) ? value : String(value);
    else if (typeof value === "bigint") out[key] = Number(value);
    else if (value instanceof Date) out[key] = value.toISOString();
    else out[key] = String(value);
  }
  return out;
}

export type NavItem = {
  id: string;
  label: string;
  href: string;
  location: "header" | "footer";
  sortOrder: number;
  visible: boolean;
};

export type SpecItem = {
  id: string;
  title: string;
  body: string;
};

export type LayerItem = {
  id: string;
  title: string;
  body: string;
  /** Transparent layer plate for the exploded stack, when authored. */
  asset?: string;
};

export type SectionContent = {
  leftTitle?: string;
  leftBody?: string;
  rightTitle?: string;
  rightBody?: string;
  ticker?: string;
  established?: string;
  establishedNote?: string;
  shippingLabel?: string;
  shippingDetail?: string;
  ctaLabel?: string;
  heading?: string;
  body?: string;
  specs?: SpecItem[];
  layers?: LayerItem[];
  productSlugs?: string[];
};

/**
 * Read-path parse of `homepage_sections.content`.
 *
 * Validated against the section's own schema (see `@/lib/section-schema`) so a
 * row written by hand in SQL, or left behind by an older schema, degrades to
 * the renderer's defaults instead of crashing the homepage. The write path uses
 * the throwing `serializeSectionContent()` — invalid content never gets in;
 * this only makes sure bad content that is already in cannot take the stage
 * down.
 */
export function parseSectionContent(
  raw: string | null | undefined,
  sectionKey?: string,
): SectionContent {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  if (!sectionKey || !(sectionKey in SECTION_SCHEMA_KEYS)) {
    return pickKnownFields(parsed as Record<string, unknown>);
  }
  const result = validateSectionContent(sectionKey, parsed);
  if (!result.ok) {
    if (typeof console !== "undefined") {
      console.warn(`[cour] invalid ${sectionKey} section content: ${result.error}`);
    }
    return pickKnownFields(parsed as Record<string, unknown>);
  }
  return pickKnownFields(result.data);
}

const SECTION_SCHEMA_KEYS: Record<string, true> = {
  hero: true,
  details: true,
  collections: true,
  construction: true,
  know: true,
};

const STRING_FIELDS = [
  "leftTitle",
  "leftBody",
  "rightTitle",
  "rightBody",
  "ticker",
  "established",
  "establishedNote",
  "shippingLabel",
  "shippingDetail",
  "ctaLabel",
  "heading",
  "body",
] as const;

/** Narrow an already-validated bag of values to the fields the stage reads. */
function pickKnownFields(source: Record<string, unknown>): SectionContent {
  const content: SectionContent = {};
  for (const key of STRING_FIELDS) {
    const value = source[key];
    if (typeof value === "string" && value.length) content[key] = value;
  }
  if (Array.isArray(source.specs)) content.specs = asTextList(source.specs);
  if (Array.isArray(source.layers)) content.layers = asLayerList(source.layers);
  if (Array.isArray(source.productSlugs)) {
    content.productSlugs = source.productSlugs.filter((s): s is string => typeof s === "string");
  }
  return content;
}

function asTextList(value: unknown): SpecItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const rec =
      item && typeof item === "object"
        ? (item as { id?: unknown; title?: unknown; body?: unknown })
        : {};
    return {
      id: String(rec.id ?? String(index + 1).padStart(2, "0")),
      title: String(rec.title ?? ""),
      body: String(rec.body ?? ""),
    };
  });
}

function asLayerList(value: unknown): LayerItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const rec =
      item && typeof item === "object"
        ? (item as { id?: unknown; title?: unknown; body?: unknown; asset?: unknown })
        : {};
    const layer: LayerItem = {
      id: String(rec.id ?? String(index + 1).padStart(2, "0")),
      title: String(rec.title ?? ""),
      body: String(rec.body ?? ""),
    };
    if (typeof rec.asset === "string") layer.asset = rec.asset;
    return layer;
  });
}

export type HomeSection = {
  id: string;
  sectionKey: string;
  title: string | null;
  eyebrow: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  enabled: boolean;
  sortOrder: number;
  content: SectionContent;
};

export type MediaAsset = {
  id: string;
  kind: string;
  url: string;
  altText: string;
  posterUrl: string | null;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  story: string | null;
  priceCents: number;
  status: string;
  featured: boolean;
  image: string;
  colorName: string | null;
  colorHex: string | null;
  fit: string | null;
  material: string | null;
  care: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  /**
   * Semantic stock state across the product's active variants. Never the exact
   * unit count — that is operator data and is only returned by the studio API.
   */
  availability: StockAvailability;
};

export type Variant = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  priceOverrideCents: number | null;
  availability: "in" | "low" | "out";
  status: string;
};

export type CollectionCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover: string | null;
  visible: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
};

export type Policy = {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
};

export type SiteSettings = {
  id: string;
  brandName: string;
  tagline: string | null;
  contactEmail: string | null;
  currency: string;
  announcement: string | null;
  announcementEnabled: boolean;
  footerNote: string | null;
  socialInstagram: string | null;
  socialX: string | null;
  shippingNote: string | null;
  maintenanceMode: boolean;
};

export type Storefront = {
  settings: SiteSettings;
  navigation: NavItem[];
  sections: HomeSection[];
  products: ProductCard[];
  collections: CollectionCard[];
  faqs: Faq[];
  policies: Policy[];
};

export type BagItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  size: string;
  priceCents: number;
  image: string;
  quantity: number;
};

export type OrderSummary = {
  id: string;
  status: string;
  email: string | null;
  totalCents: number;
  shippingCents: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    size: string;
    unitCents: number;
    quantity: number;
  }[];
};

export type AddressCard = {
  id: string;
  label: string | null;
  line1: string;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
};

export type WishlistCard = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
};

export type LowStockRow = {
  sku: string;
  size: string;
  inventoryQuantity: number;
  name: string;
};

export type RecentOrderRow = {
  id: string;
  email: string | null;
  status: string;
  totalCents: number;
  createdAt: string;
};
