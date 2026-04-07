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

function pulseColor(item: ReplenishmentItem) {
  switch (item.urgencyLabel) {
    case "critical":
      return "bg-rose-500";
    case "high":
      return "bg-amber-500";
    default:
      return "bg-sky-500";
  }
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

export default function ReplenishmentPanel({ data, loading, error }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Replenishment
          </div>
          <div className="mt-1 text-sm text-slate-600">
            What you should act on next.
          </div>
        </div>

        <Link
          to="/view/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">
          Reviewing inventory signals...
        </div>
      ) : error ? (
        <div className="text-sm text-rose-600">
          Unable to load recommendations.
        </div>
      ) : !data?.items?.length ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="text-sm font-medium text-emerald-800">
            Inventory looks stable
          </div>
          <div className="mt-1 text-sm text-emerald-700">
            No urgent replenishment needed right now.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-slate-100/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* 🔥 Pulse */}
                  <span className="relative mt-1 flex h-2.5 w-2.5">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${pulseColor(
                        item
                      )}`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${pulseColor(
                        item
                      )}`}
                    />
                  </span>

                  <div>
                    <div className="font-medium text-slate-900">
                      {item.name}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      SKU: {item.sku}
                    </div>

                    <div className="mt-2 text-sm font-medium text-slate-900">
                      {actionLabel(item.recommendedAction)}
                      {item.suggestedQuantity != null
                        ? ` · ${item.suggestedQuantity} ${item.unit || "units"}`
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="font-medium text-slate-900">
                    {item.totalOnHand}
                  </div>
                  <div className="text-xs text-slate-500">
                    available {item.totalAvailable}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <Link
                  to={actionLink(item)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {actionLabel(item.recommendedAction)}
                </Link>

                <Link
                  to={`/view/products/${item.productId}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}