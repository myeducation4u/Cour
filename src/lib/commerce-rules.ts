export const SHIPPING_THRESHOLD_CENTS = 40000;
export const SHIPPING_FLAT_CENTS = 1800;
export const MAX_LINE_QTY = 8;
export const MAX_INVENTORY = 9999;

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type StockAvailability = "in" | "low" | "out";

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export const VARIANT_STATUSES = ["active", "inactive"] as const;
export const MEDIA_KINDS = ["image", "video", "poster"] as const;
export const STAFF_ROLES = ["owner", "admin", "editor"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const PERMS = {
  settings: ["owner", "admin"],
  catalog: ["owner", "admin"],
  inventory: ["owner", "admin", "editor"],
  orders: ["owner", "admin"],
  content: ["owner", "admin", "editor"],
  media: ["owner", "admin", "editor"],
  customers: ["owner", "admin"],
  audit: ["owner", "admin"],
} as const;

export type Perm = keyof typeof PERMS;

export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const SHIPPING_COUNTRIES = ["US", "CA", "GB", "DE", "FR", "NL", "AU", "JP"] as const;
export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export function isShippingCountry(value: string): value is ShippingCountry {
  return (SHIPPING_COUNTRIES as readonly string[]).includes(value);
}

export function clampQty(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_LINE_QTY, Math.floor(v)));
}

export function clampInventory(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_INVENTORY, Math.floor(v)));
}

export function shippingCents(subtotalCents: number): number {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  return subtotalCents >= SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}

export function stockAvailability(quantity: number): StockAvailability {
  if (!Number.isFinite(quantity) || quantity <= 0) return "out";
  if (quantity <= 3) return "low";
  return "in";
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function canTransitionOrder(from: string, to: string): boolean {
  if (!isOrderStatus(from) || !isOrderStatus(to)) return false;
  return ORDER_TRANSITIONS[from].includes(to);
}

export function isStaffRole(value: string): value is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(value);
}

export function can(role: string, perm: Perm): boolean {
  return (PERMS[perm] as readonly string[]).includes(role);
}

export function isSafeInternalHref(href: string): boolean {
  return /^\/[a-zA-Z0-9/_-]*$/.test(href) && href.length <= 180;
}

export function isSafeMediaUrl(url: string): boolean {
  if (url.startsWith("/media/") && url.length <= 240) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && /\.(avif|webp|jpe?g|png|gif|svg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 180;
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 80;
}

export function isHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function isProductStatus(value: string): boolean {
  return (PRODUCT_STATUSES as readonly string[]).includes(value);
}

export function isVariantStatus(value: string): boolean {
  return (VARIANT_STATUSES as readonly string[]).includes(value);
}

export function isMediaKind(value: string): boolean {
  return (MEDIA_KINDS as readonly string[]).includes(value);
}

export function sanitizeSearchTerm(q: string): string {
  return q.trim().toLowerCase().replace(/[%_\\]/g, "").slice(0, 80);
}
