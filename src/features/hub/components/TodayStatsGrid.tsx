import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayStatsGrid({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Loading today’s snapshot...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-rose-700">
          Unable to load today’s snapshot.
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">No snapshot data available yet.</div>
      </div>
    );
  }

  const { totals } = data;
  const sales = data.sales ?? {
    salesTodayCount: 0,
    unitsSoldToday: 0,
    salesTodayRevenue: 0,
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Today at a glance
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Key inventory and sales signals for the current business day.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sales Today"
          value={`$${sales.salesTodayRevenue.toFixed(2)}`}
          tone="primary"
        />
        <StatCard
          label="Units Sold"
          value={sales.unitsSoldToday}
          tone="neutral"
        />
        <StatCard
          label="Transactions"
          value={sales.salesTodayCount}
          tone="neutral"
        />
        <StatCard
          label="Units On Hand"
          value={totals.totalUnits}
          tone="neutral"
        />
        <StatCard
          label="Products"
          value={totals.totalProducts}
          tone="neutral"
        />
        <StatCard
          label="Locations"
          value={totals.totalLocations}
          tone="neutral"
        />
        <StatCard
          label="Low Stock"
          value={totals.lowStockProducts}
          tone={totals.lowStockProducts > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Out of Stock"
          value={totals.outOfStockProducts}
          tone={totals.outOfStockProducts > 0 ? "danger" : "neutral"}
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: "neutral" | "primary" | "warning" | "danger";
}) {
  const styles =
    tone === "primary"
      ? "border-slate-900 bg-slate-900 text-white"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-slate-900"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-slate-900"
          : "border-slate-200 bg-slate-50 text-slate-900";

  const labelStyles =
    tone === "primary" ? "text-slate-300" : "text-slate-500";

  const valueStyles =
    tone === "primary" ? "text-white" : "text-slate-900";

  return (
    <div
      className={`rounded-2xl border px-4 py-4 min-h-[96px] shadow-sm transition hover:shadow-md ${styles}`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.12em] leading-4 break-words ${labelStyles}`}
      >
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${valueStyles}`}>{value}</div>
    </div>
  );
}