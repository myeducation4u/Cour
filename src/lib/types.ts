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
};

export type SectionContent = {
  leftTitle?: string;
  leftBody?: string;
  rightTitle?: string;
  rightBody?: string;
  ticker?: string;
  established?: string;
  establishedNote?: string;
  specs?: SpecItem[];
  layers?: LayerItem[];
};

function asTextList(value: unknown): SpecItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const rec = item && typeof item === "object" ? (item as { id?: unknown; title?: unknown; body?: unknown }) : {};
    return {
      id: String(rec.id ?? String(index + 1).padStart(2, "0")),
      title: String(rec.title ?? ""),
      body: String(rec.body ?? ""),
    };
  });
}

export function parseSectionContent(raw: string | null | undefined): SectionContent {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as {
      leftTitle?: unknown;
      leftBody?: unknown;
      rightTitle?: unknown;
      rightBody?: unknown;
      ticker?: unknown;
      established?: unknown;
      establishedNote?: unknown;
      specs?: unknown;
      layers?: unknown;
    };
    const content: SectionContent = {};
    if (typeof parsed.leftTitle === "string") content.leftTitle = parsed.leftTitle;
    if (typeof parsed.leftBody === "string") content.leftBody = parsed.leftBody;
    if (typeof parsed.rightTitle === "string") content.rightTitle = parsed.rightTitle;
    if (typeof parsed.rightBody === "string") content.rightBody = parsed.rightBody;
    if (typeof parsed.ticker === "string") content.ticker = parsed.ticker;
    if (typeof parsed.established === "string") content.established = parsed.established;
    if (typeof parsed.establishedNote === "string") content.establishedNote = parsed.establishedNote;
    if (Array.isArray(parsed.specs)) content.specs = asTextList(parsed.specs);
    if (Array.isArray(parsed.layers)) content.layers = asTextList(parsed.layers);
    return content;
  } catch {
    return {};
  }
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
