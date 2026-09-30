import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  adminGetProduct,
  adminListProducts,
  adminSaveProduct,
  adminSaveVariantInventory,
} from "@/lib/server/admin";
import type { JsonRow } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [rows, setRows] = useState<JsonRow[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof adminGetProduct>>>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    adminListProducts()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    if (!active) return;
    adminGetProduct({ data: active }).then(setDetail);
  }, [active]);

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h1 className="cour-display text-3xl">PRODUCTS.</h1>
        <div className="mt-4 divide-y divide-line border border-line">
          {rows.map((row) => (
            <button
              key={String(row.id)}
              type="button"
              className="flex w-full items-center justify-between p-3 text-left"
              onClick={() => setActive(String(row.id))}
            >
              <span className="text-sm">{String(row.name)}</span>
              <span className="font-mono text-[0.62rem] text-mist">{String(row.status)}</span>
            </button>
          ))}
        </div>
      </div>
      {detail?.product ? (
        <ProductForm
          detail={detail}
          note={note}
          onSave={async (payload) => {
            await adminSaveProduct({ data: payload });
            setNote("Saved.");
            setRows(await adminListProducts());
          }}
          onVariant={async (payload) => {
            await adminSaveVariantInventory({ data: payload });
            setDetail(await adminGetProduct({ data: String(detail.product.id) }));
            setNote("Inventory updated.");
          }}
        />
      ) : (
        <p className="text-sm text-mist">Select a jacket.</p>
      )}
    </main>
  );
}

function ProductForm({
  detail,
  note,
  onSave,
  onVariant,
}: {
  detail: NonNullable<Awaited<ReturnType<typeof adminGetProduct>>>;
  note: string | null;
  onSave: (payload: Parameters<typeof adminSaveProduct>[0]["data"]) => Promise<void>;
  onVariant: (payload: { id: string; inventoryQuantity: number; status: string }) => Promise<void>;
}) {
  const p = detail.product;
  const [form, setForm] = useState({
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
    seoDescription: String(p.seo_description ?? ""),
  });

  useEffect(() => {
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
      seoDescription: String(n.seo_description ?? ""),
    });
  }, [detail]);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      {(
        [
          ["name", "NAME"],
          ["slug", "SLUG"],
          ["colorName", "COLOR"],
          ["colorHex", "COLOR HEX"],
          ["fit", "FIT"],
          ["material", "MATERIAL"],
          ["care", "CARE"],
          ["seoTitle", "SEO TITLE"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block">
          <span className="cour-label">{label}</span>
          <input
            className="cour-field mt-1"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </label>
      ))}
      <label className="block">
        <span className="cour-label">PRICE (CENTS)</span>
        <input
          className="cour-field mt-1"
          type="number"
          value={form.priceCents}
          onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
        />
      </label>
      <label className="block">
        <span className="cour-label">DESCRIPTION</span>
        <textarea
          className="cour-field mt-1 min-h-24"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="cour-label">STORY</span>
        <textarea
          className="cour-field mt-1 min-h-24"
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
        />
      </label>
      <label className="flex items-center gap-2 font-mono text-[0.7rem]">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        FEATURED
      </label>
      <label className="block">
        <span className="cour-label">STATUS</span>
        <select
          className="cour-field mt-1"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="published">published</option>
          <option value="draft">draft</option>
          <option value="archived">archived</option>
        </select>
      </label>
      <button className="cour-btn cour-btn-solid" type="submit">
        SAVE PRODUCT
      </button>
      {note ? <p className="text-sm text-mist">{note}</p> : null}

      <h2 className="pt-4 font-mono text-[0.7rem] tracking-[0.16em] text-mist">INVENTORY</h2>
      {detail.variants.map((v) => (
        <VariantRow key={String(v.id)} variant={v} onSave={onVariant} />
      ))}
    </form>
  );
}

function VariantRow({
  variant,
  onSave,
}: {
  variant: JsonRow;
  onSave: (payload: { id: string; inventoryQuantity: number; status: string }) => Promise<void>;
}) {
  const [qty, setQty] = useState(Number(variant.inventory_quantity));
  const [status, setStatus] = useState(String(variant.status));
  return (
    <div className="flex flex-wrap items-end gap-2 border border-line p-2">
      <p className="w-16 font-mono text-sm">{String(variant.size)}</p>
      <input
        className="cour-field max-w-24"
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />
      <select className="cour-field max-w-32" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      <button
        type="button"
        className="cour-btn h-9 min-h-9"
        onClick={() => onSave({ id: String(variant.id), inventoryQuantity: qty, status })}
      >
        UPDATE
      </button>
    </div>
  );
}
