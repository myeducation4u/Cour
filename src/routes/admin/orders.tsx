import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminListOrders, adminSetOrderStatus } from "@/lib/server/admin";
import { money } from "@/lib/format";
import type { JsonRow } from "@/lib/types";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [rows, setRows] = useState<JsonRow[]>([]);

  async function reload() {
    setRows(await adminListOrders());
  }

  useEffect(() => {
    reload().catch(() => setRows([]));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="cour-display text-3xl">ORDERS.</h1>
      <div className="mt-6 divide-y divide-line border border-line">
        {rows.map((row) => (
          <div key={String(row.id)} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div>
              <p className="font-mono text-sm">{String(row.id)}</p>
              <p className="text-sm text-mist">{String(row.email ?? "")}</p>
            </div>
            <p className="font-mono">{money(Number(row.total_cents ?? 0))}</p>
            <select
              className="cour-field max-w-40"
              value={String(row.status ?? "placed")}
              onChange={async (e) => {
                await adminSetOrderStatus({ data: { id: String(row.id), status: e.target.value } });
                await reload();
              }}
            >
              <option value="placed">placed</option>
              <option value="paid">paid</option>
              <option value="fulfilled">fulfilled</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        ))}
        {rows.length === 0 ? <p className="p-4 text-sm text-mist">No orders yet.</p> : null}
      </div>
    </main>
  );
}
