import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function DailyBriefStrip({ data, loading, error }: Props) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Loading daily brief...</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Daily brief
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Today’s summary is not available yet.
        </div>
      </section>
    );
  }

  const totals = data.totals;
  const sales = data.sales ?? {
    salesTodayCount: 0,
    unitsSoldToday: 0,
    salesTodayRevenue: 0,
  };

  const attentionCount = totals.lowStockProducts + totals.outOfStockProducts;

  const summary =
    totals.outOfStockProducts > 0
      ? `${totals.outOfStockProducts} out-of-stock item${
          totals.outOfStockProducts === 1 ? "" : "s"
        } need attention.`
      : totals.lowStockProducts > 0
        ? `${totals.lowStockProducts} low-stock item${
            totals.lowStockProducts === 1 ? "" : "s"
          } are being watched.`
        : sales.salesTodayCount > 0
          ? "Sales are active and inventory looks stable."
          : "Inventory looks stable and no urgent issues are rising right now.";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
            </span>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Daily brief
            </div>
          </div>

          <div className="mt-2 text-lg font-semibold text-slate-900">
            {summary}
          </div>

          <div className="mt-1 text-sm text-slate-600">
            A quick read on sales, inventory, and what needs attention today.
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniMetric
            label="Sales Today"
            value={`$${sales.salesTodayRevenue.toFixed(2)}`}
            tone="primary"
          />
          <MiniMetric
            label="Units Sold"
            value={sales.unitsSoldToday}
            tone="neutral"
          />
          <MiniMetric
            label="Attention"
            value={attentionCount}
            tone={attentionCount > 0 ? "warning" : "neutral"}
          />
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: "neutral" | "primary" | "warning";
}) {
  const cardClass =
    tone === "primary"
      ? "border-slate-900 bg-slate-900 text-white"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-slate-900"
        : "border-slate-200 bg-slate-50 text-slate-900";

  const labelClass =
    tone === "primary" ? "text-slate-300" : "text-slate-500";

  const valueClass =
    tone === "primary" ? "text-white" : "text-slate-900";

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${cardClass}`}>
      <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
        {label}
      </div>
      <div className={`mt-2 text-xl font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}