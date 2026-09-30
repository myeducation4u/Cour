import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/server/admin";
import { money } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Dashboard unavailable."));
  }, []);

  if (error) return <main className="p-6 text-sm text-mist">{error}</main>;
  if (!data) return <main className="p-6 font-mono text-sm text-mist">LOADING METRICS</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="cour-display text-3xl">DASHBOARD.</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="ORDERS" value={String(data.orderCount)} />
        <Stat label="REVENUE" value={money(data.revenueCents)} />
        <Stat label="PRODUCTS" value={String(data.productCount)} />
      </div>
      <h2 className="mt-10 font-mono text-[0.7rem] tracking-[0.16em] text-mist">LOW STOCK</h2>
      <div className="mt-3 divide-y divide-line border border-line">
        {data.lowStock.length === 0 ? (
          <p className="p-3 text-sm text-mist">No low-stock variants.</p>
        ) : (
          data.lowStock.map((row) => (
            <p key={`${row.sku}-${row.size}`} className="flex justify-between p-3 font-mono text-sm">
              <span>
                {row.name} / {row.size}
              </span>
              <span>{row.inventoryQuantity}</span>
            </p>
          ))
        )}
      </div>
      <h2 className="mt-10 font-mono text-[0.7rem] tracking-[0.16em] text-mist">RECENT ORDERS</h2>
      <div className="mt-3 divide-y divide-line border border-line">
        {data.recentOrders.map((row) => (
          <p key={row.id} className="flex justify-between gap-3 p-3 font-mono text-sm">
            <span>{row.id}</span>
            <span className="text-mist">{row.email}</span>
            <span>{money(row.totalCents)}</span>
          </p>
        ))}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-4">
      <p className="cour-label">{label}</p>
      <p className="mt-2 font-mono text-2xl">{value}</p>
    </div>
  );
}
