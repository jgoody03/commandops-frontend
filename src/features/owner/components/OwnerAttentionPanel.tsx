import { Link } from "react-router-dom";
import type { ReplenishmentItem } from "@/features/hub/api/getReplenishmentRecommendations";

type Props = {
  replenishment: { items: ReplenishmentItem[] } | null;
};

export default function OwnerAttentionPanel({ replenishment }: Props) {
  const items = replenishment?.items ?? [];
  const topItems = items.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Needs Attention
          </h2>
          <p className="text-sm text-slate-500">
            The most important inventory issues right now.
          </p>
        </div>

        <Link
          to="/view/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open products
        </Link>
      </div>

      {!topItems.length ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="text-sm font-medium text-emerald-800">
            Nothing urgent is rising to the top right now.
          </div>
          <p className="mt-1 text-sm text-emerald-700">
            The system is not seeing any critical replenishment candidates at the moment.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {topItems.map((item) => (
            <Link
              key={item.id}
              to={`/view/products/${item.productId}`}
              className="block rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    SKU: {item.sku}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {item.urgencyLabel}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.recommendedAction}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-slate-600">
                On hand: {item.totalOnHand} · Available: {item.totalAvailable}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}