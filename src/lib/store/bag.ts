import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BagItem } from "@/lib/types";
import { clampQty } from "@/lib/commerce-rules";

type BagState = {
  items: BagItem[];
  add: (item: Omit<BagItem, "quantity">, quantity?: number) => void;
  setQty: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

function asItem(row: unknown): BagItem | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  if (typeof r.variantId !== "string" || typeof r.productId !== "string") return null;
  const quantity = clampQty(r.quantity);
  if (quantity < 1) return null;
  const price = Number(r.priceCents);
  return {
    productId: r.productId,
    variantId: r.variantId,
    slug: typeof r.slug === "string" ? r.slug : "",
    name: typeof r.name === "string" ? r.name : "",
    size: typeof r.size === "string" ? r.size : "",
    priceCents: Number.isFinite(price) ? Math.max(0, Math.floor(price)) : 0,
    image: typeof r.image === "string" ? r.image : "",
    quantity,
  };
}

export const useBag = create<BagState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, quantity = 1) => {
        const addQty = clampQty(quantity);
        if (addQty < 1) return;
        const items = [...get().items];
        const idx = items.findIndex((x) => x.variantId === item.variantId);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: clampQty(items[idx].quantity + addQty),
          };
        } else {
          items.push({ ...item, quantity: addQty });
        }
        set({ items });
      },
      setQty: (variantId, quantity) => {
        const next = clampQty(quantity);
        if (next <= 0) {
          set({ items: get().items.filter((x) => x.variantId !== variantId) });
          return;
        }
        set({
          items: get().items.map((x) => (x.variantId === variantId ? { ...x, quantity: next } : x)),
        });
      },
      remove: (variantId) => set({ items: get().items.filter((x) => x.variantId !== variantId) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cour-bag",
      merge: (persisted, current) => {
        const raw = persisted && typeof persisted === "object" ? (persisted as { items?: unknown }) : {};
        const items = Array.isArray(raw.items) ? raw.items.map(asItem).filter((x): x is BagItem => Boolean(x)) : [];
        return { ...current, items };
      },
    },
  ),
);

export function bagCount(items: BagItem[]) {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function bagTotal(items: BagItem[]) {
  return items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
}
