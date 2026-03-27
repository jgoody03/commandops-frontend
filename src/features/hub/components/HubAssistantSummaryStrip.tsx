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

type SummaryContent = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
};

function buildSummary({
  snapshot,
  replenishment,
  lowStock,
  locations,
}: Props): SummaryContent {
  const totals = snapshot?.totals;
  const activity = snapshot?.activity;
  const replenishmentCount = replenishment?.items?.length ?? 0;
  const lowStockCount = totals?.lowStockProducts ?? lowStock?.items?.length ?? 0;
  const outOfStockCount = totals?.outOfStockProducts ?? 0;
  const totalProducts = totals?.totalProducts ?? 0;
  const totalLocations = totals?.totalLocations ?? locations?.items?.length ?? 0;
  const totalUnits = totals?.totalUnits ?? 0;
  const totalActivity = activity?.totalCount ?? 0;

  if (!totals) {
    return {
      title: "Command Summary",
      body: "Loading your workspace snapshot. Once inventory data is available, this summary will explain the current store condition in plain language.",
      ctaLabel: "Open products",
      ctaTo: "/view/products",
    };
  }

  if (outOfStockCount > 0) {
    return {
      title: "Command Summary",
      body: `You currently have ${outOfStockCount} out-of-stock product${
        outOfStockCount === 1 ? "" : "s"
      } and ${lowStockCount} low-stock item${
        lowStockCount === 1 ? "" : "s"
      }. Inventory needs attention now, especially where product is unavailable to sell.`,
      ctaLabel: "Review out-of-stock products",
      ctaTo: "/view/products?stockStatus=out",
    };
  }

  if (replenishmentCount > 0 || lowStockCount > 0) {
    return {
      title: "Command Summary",
      body: `Inventory is active across ${totalLocations} location${
        totalLocations === 1 ? "" : "s"
      } with ${totalProducts} tracked product${
        totalProducts === 1 ? "" : "s"
      } and ${totalUnits} total unit${
        totalUnits === 1 ? "" : "s"
      } on hand. Nothing appears critically broken, but ${lowStockCount} item${
        lowStockCount === 1 ? "" : "s"
      } are starting to need replenishment attention.`,
      ctaLabel: "Review low-stock products",
      ctaTo: "/view/products?stockStatus=low",
    };
  }

  if (totalActivity === 0) {
    return {
      title: "Command Summary",
      body: `Inventory looks stable across ${totalLocations} location${
        totalLocations === 1 ? "" : "s"
      } and ${totalProducts} tracked product${
        totalProducts === 1 ? "" : "s"
      }. There has not been any inventory activity today, so this may be a good moment to verify counts or review location balance health.`,
      ctaLabel: "Open count workflow",
      ctaTo: "/ops/count",
    };
  }

  return {
    title: "Command Summary",
    body: `Inventory looks stable right now. You are tracking ${totalProducts} product${
      totalProducts === 1 ? "" : "s"
    } across ${totalLocations} location${
      totalLocations === 1 ? "" : "s"
    }, with ${totalActivity} inventory activit${
      totalActivity === 1 ? "y" : "ies"
    } recorded today. No urgent inventory issues are rising to the top at the moment.`,
    ctaLabel: "Open products",
    ctaTo: "/view/products",
  };
}

export default function HubAssistantSummaryStrip(props: Props) {
  const summary = buildSummary(props);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {summary.title}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {summary.body}
          </p>
        </div>

        <Link
          to={summary.ctaTo}
          className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition active:scale-[0.98] hover:bg-slate-100"
        >
          {summary.ctaLabel}
        </Link>
      </div>
    </div>
  );
}