import { Link } from "react-router-dom";
import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";
import type { ReplenishmentItem } from "../api/getReplenishmentRecommendations";
import type { ProductSummaryListItem } from "../api/getLowStockProducts";
import type { LocationSummaryListItem } from "@/features/locations/api/getLocationSummaryList";

type Props = {
  snapshot: GetTodaySnapshotOutput | null;
  replenishment: { items: ReplenishmentItem[] } | null;
  lowStock: {
    items: ProductSummaryListItem[];
  } | null;
  locations: {
    items: LocationSummaryListItem[];
  } | null;
};

function buildSummary(props: Props) {
  const replenishmentCount = props.replenishment?.items?.length ?? 0;
  const lowStockCount = props.lowStock?.items?.length ?? 0;
  const topLocation = props.locations?.items?.[0] ?? null;
  const totals = props.snapshot?.totals ?? null;

  if (replenishmentCount > 0) {
    const topItem = props.replenishment?.items?.[0];
    return {
      title: `${replenishmentCount} product${
        replenishmentCount === 1 ? "" : "s"
      } need attention.`,
      body: topItem
        ? `${topItem.name} is the highest-priority replenishment candidate right now.`
        : "The system found products that need replenishment.",
      ctaLabel: "Review replenishment",
      ctaTo: "/view/products",
    };
  }

  if (lowStockCount > 0) {
    return {
      title: `${lowStockCount} low-stock product${
        lowStockCount === 1 ? "" : "s"
      } are being watched.`,
      body: "Inventory is mostly stable, but a few SKUs are getting close enough to deserve a review.",
      ctaLabel: "Open low-stock view",
      ctaTo: "/view/products?stockStatus=low",
    };
  }

  if (topLocation) {
    return {
      title: "Inventory looks stable right now.",
      body: `You can drill into ${topLocation.locationName} to spot-check stock positions or prepare the next move.`,
      ctaLabel: "Open locations",
      ctaTo: "/view",
    };
  }

  return {
    title: "Your workspace is ready.",
    body:
      totals && totals.totalProducts > 0
        ? "Use the dashboard to review product health, drill into locations, or jump into an ops workflow."
        : "Start by receiving inventory or creating products so the Hub can begin surfacing operational insights.",
    ctaLabel: totals && totals.totalProducts > 0 ? "Open products" : "Receive inventory",
    ctaTo: totals && totals.totalProducts > 0 ? "/view/products" : "/ops/receive",
  };
}

export default function HubAssistantSummaryStrip(props: Props) {
  const summary = buildSummary(props);

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            CommandOps Insight
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">
            {summary.title}
          </div>
          <p className="mt-1 text-sm text-slate-600">{summary.body}</p>
        </div>

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