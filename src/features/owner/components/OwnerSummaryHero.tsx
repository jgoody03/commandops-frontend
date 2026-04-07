import { Link } from "react-router-dom";

type Props = {
  lowStockCount: number;
  outOfStockCount: number;
  replenishmentCount: number;
  salesTodayRevenue?: number;
  salesTodayCount?: number;
  unitsSoldToday?: number;
};

function buildMessage(
  lowStockCount: number,
  outOfStockCount: number,
  replenishmentCount: number
) {
  if (outOfStockCount > 0) {
    return {
      title: `${outOfStockCount} product${
        outOfStockCount === 1 ? "" : "s"
      } are out of stock.`,
      body: "The fastest next step is to review affected products and decide whether to receive new stock or rebalance inventory between locations.",
      ctaLabel: "Review out-of-stock items",
      ctaTo: "/view/products?stockStatus=out",
      tone: "danger" as const,
    };
  }

  if (replenishmentCount > 0) {
    return {
      title: `${replenishmentCount} product${
        replenishmentCount === 1 ? "" : "s"
      } need attention soon.`,
      body: "Inventory is still moving, but a few items are starting to need replenishment planning.",
      ctaLabel: "Review replenishment",
      ctaTo: "/view/products",
      tone: "warning" as const,
    };
  }

  if (lowStockCount > 0) {
    return {
      title: `${lowStockCount} low-stock product${
        lowStockCount === 1 ? "" : "s"
      } are being watched.`,
      body: "Nothing looks critical right now, but this is a good time to review your next restock decisions.",
      ctaLabel: "Open low-stock products",
      ctaTo: "/view/products?stockStatus=low",
      tone: "warning" as const,
    };
  }

  return {
    title: "Inventory looks stable right now.",
    body: "Your current signals do not show urgent replenishment issues. You can still review products, recent activity, or location health anytime.",
    ctaLabel: "Open products",
    ctaTo: "/view/products",
    tone: "stable" as const,
  };
}

export default function OwnerSummaryHero({
  lowStockCount,
  outOfStockCount,
  replenishmentCount,
  salesTodayRevenue = 0,
  salesTodayCount = 0,
  unitsSoldToday = 0,
}: Props) {
  const summary = buildMessage(
    lowStockCount,
    outOfStockCount,
    replenishmentCount
  );

  const containerClass =
    summary.tone === "danger"
      ? "border-rose-200 bg-rose-50"
      : summary.tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-emerald-200 bg-emerald-50";

  const eyebrowClass =
    summary.tone === "danger"
      ? "text-rose-700"
      : summary.tone === "warning"
        ? "text-amber-700"
        : "text-emerald-700";

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${containerClass}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className={`text-sm font-semibold uppercase tracking-[0.18em] ${eyebrowClass}`}>
            Owner view
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.title}
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {summary.body}
          </p>

          <div className="mt-4">
            <Link
              to={summary.ctaTo}
              className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {summary.ctaLabel}
            </Link>
          </div>
        </div>

        <div className="grid min-w-[280px] gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <MetricCard
            label="Sales Today"
            value={`$${salesTodayRevenue.toFixed(2)}`}
          />
          <MetricCard
            label="Units Sold"
            value={unitsSoldToday}
          />
          <MetricCard
            label="Transactions"
            value={salesTodayCount}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}