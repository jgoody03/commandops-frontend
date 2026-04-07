import { Link } from "react-router-dom";

type Props = {
  totalProducts: number;
  totalLocations: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalUnits: number;
  salesTodayRevenue?: number;
  salesTodayCount?: number;
};

export default function OwnerHealthCards({
  totalProducts,
  totalLocations,
  lowStockCount,
  outOfStockCount,
  totalUnits,
  salesTodayRevenue = 0,
  salesTodayCount = 0,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Business health
        </div>
        <div className="mt-1 text-sm text-slate-600">
          A quick view of inventory coverage and today’s sales activity.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OwnerCard
          label="Sales Today"
          value={`$${salesTodayRevenue.toFixed(2)}`}
          to="/owner"
          helperText={`${salesTodayCount} transaction${salesTodayCount === 1 ? "" : "s"}`}
          tone="primary"
        />

        <OwnerCard
          label="Products"
          value={totalProducts}
          to="/view/products"
          helperText="Browse catalog"
        />

        <OwnerCard
          label="Locations"
          value={totalLocations}
          to="/view"
          helperText="Review locations"
        />

        <OwnerCard
          label="Units On Hand"
          value={totalUnits}
          to="/view/products"
          helperText="See inventory"
        />

        <OwnerCard
          label="Low Stock"
          value={lowStockCount}
          to="/view/products?stockStatus=low"
          helperText="Needs review"
          tone={lowStockCount > 0 ? "warning" : "neutral"}
        />

        <OwnerCard
          label="Out of Stock"
          value={outOfStockCount}
          to="/view/products?stockStatus=out"
          helperText="Most urgent"
          tone={outOfStockCount > 0 ? "danger" : "neutral"}
        />
      </div>
    </section>
  );
}

function OwnerCard({
  label,
  value,
  to,
  helperText,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  to: string;
  helperText: string;
  tone?: "neutral" | "primary" | "warning" | "danger";
}) {
  const cardClass =
    tone === "primary"
      ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-slate-900 hover:bg-amber-100/70"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-slate-900 hover:bg-rose-100/70"
          : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100";

  const labelClass =
    tone === "primary" ? "text-slate-300" : "text-slate-500";

  const valueClass =
    tone === "primary" ? "text-white" : "text-slate-900";

  const helperClass =
    tone === "primary" ? "text-slate-200" : "text-blue-600";

  return (
    <Link
      to={to}
      className={`block rounded-2xl border p-4 shadow-sm transition ${cardClass}`}
    >
      <div className={`text-xs font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</div>
      <div className={`mt-3 text-sm font-medium ${helperClass}`}>{helperText}</div>
    </Link>
  );
}