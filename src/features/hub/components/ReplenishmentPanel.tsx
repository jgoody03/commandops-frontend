import { Link } from "react-router-dom";
import type {
  ReplenishmentAction,
  ReplenishmentItem,
  ReplenishmentReasonCode,
} from "../api/getReplenishmentRecommendations";

type Props = {
  data: { items: ReplenishmentItem[] } | null;
  loading: boolean;
  error?: unknown;
};

function urgencyBadge(item: ReplenishmentItem) {
  switch (item.urgencyLabel) {
    case "critical":
      return (
        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
          Critical
        </span>
      );
    case "high":
      return (
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
          High
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          Medium
        </span>
      );
  }
}

function stockBadge(item: ReplenishmentItem) {
  if (item.stockStatus === "out") {
    return <span className="text-xs text-red-600">Out of stock</span>;
  }
  return <span className="text-xs text-amber-600">Low stock</span>;
}

function actionLabel(action: ReplenishmentAction) {
  switch (action) {
    case "receive":
      return "Receive";
    case "move":
      return "Move";
    default:
      return "Review";
  }
}

function actionLink(item: ReplenishmentItem) {
  const base = `productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`;

  switch (item.recommendedAction) {
    case "receive":
      return `/ops/receive?${base}`;
    case "move":
      return `/ops/move?${base}`;
    default:
      return `/view/products/${item.productId}`;
  }
}

function reasonText(reason: ReplenishmentReasonCode) {
  switch (reason) {
    case "OUT_OF_STOCK_EVERYWHERE":
      return "Out of stock everywhere";
    case "LOW_STOCK_MULTIPLE_LOCATIONS":
      return "Low stock in multiple locations";
    case "OUT_OF_STOCK_SOME_LOCATIONS":
      return "Out of stock in some locations";
    case "LOW_STOCK_SOME_LOCATIONS":
      return "Low stock in some locations";
    case "NETWORK_STOCK_LOW":
      return "Network stock is running low";
    default:
      return reason;
  }
}

export default function ReplenishmentPanel({ data, loading, error }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Replenishment
          </h2>
          <p className="text-sm text-slate-500">
            Highest priority items to restock.
          </p>
        </div>

        <Link
          to="/view/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all products
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">
          Reviewing current inventory conditions...
        </div>
      ) : error ? (
        <div className="mt-4 text-sm text-red-600">
          Unable to load recommendations.
        </div>
      ) : !data?.items?.length ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="text-sm font-medium text-emerald-800">
            Nothing urgent needs replenishment right now.
          </div>
          <p className="mt-1 text-sm text-emerald-700">
            Inventory looks stable based on the current stock signals. You can
            still review all products or drill into a location if you want to
            spot-check counts or prepare for upcoming demand.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              to="/view/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Review all products
            </Link>
            <Link
              to="/view"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Open view workspace
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-200 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/view/products/${item.productId}`}
                      className="font-medium text-slate-900 hover:text-blue-700"
                    >
                      {item.name}
                    </Link>
                    {urgencyBadge(item)}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    SKU: {item.sku}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    {stockBadge(item)}
                    <span className="text-slate-400">
                      Score: {item.urgencyScore}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {item.totalOnHand} {item.unit ?? ""}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Available: {item.totalAvailable}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 md:grid-cols-4">
                <div>Locations: {item.totalLocations}</div>
                <div>In stock: {item.locationsInStock}</div>
                <div>Low locations: {item.locationsLowStock}</div>
                <div>Out locations: {item.locationsOutOfStock}</div>
              </div>

              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                <div className="text-sm font-medium text-slate-900">
                  Suggested action: {actionLabel(item.recommendedAction)}
                  {item.suggestedQuantity != null
                    ? ` · ${item.suggestedQuantity} ${
                        item.unit || "units"
                      }`
                    : ""}
                </div>

                {item.reasonCodes.length ? (
                  <div className="mt-1 text-xs text-slate-500">
                    {item.reasonCodes.map(reasonText).join(" · ")}
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  to={actionLink(item)}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {actionLabel(item.recommendedAction)}
                </Link>

                <Link
                  to={`/view/products/${item.productId}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Review product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}