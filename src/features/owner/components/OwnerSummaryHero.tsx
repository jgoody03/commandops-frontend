import { Link } from "react-router-dom";

type Props = {
  lowStockCount: number;
  outOfStockCount: number;
  replenishmentCount: number;
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
    };
  }

  return {
    title: "Inventory looks stable right now.",
    body: "Your current signals do not show urgent replenishment issues. You can still review products, recent activity, or location health anytime.",
    ctaLabel: "Open products",
    ctaTo: "/view/products",
  };
}

export default function OwnerSummaryHero({
  lowStockCount,
  outOfStockCount,
  replenishmentCount,
}: Props) {
  const summary = buildMessage(
    lowStockCount,
    outOfStockCount,
    replenishmentCount
  );

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
        Owner View
      </div>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        {summary.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">{summary.body}</p>

      <div className="mt-4">
        <Link
          to={summary.ctaTo}
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {summary.ctaLabel}
        </Link>
      </div>
    </div>
  );
}