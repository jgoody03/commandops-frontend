import { Link } from "react-router-dom";
import type { ReplenishmentItem } from "../api/getReplenishmentRecommendations";

type Props = {
  data: { items: ReplenishmentItem[] } | null;
  loading: boolean;
  error?: unknown;
};

function badge(item: ReplenishmentItem) {
  if (item.stockStatus === "out") {
    return <span className="text-xs text-red-600">Out of stock</span>;
  }
  return <span className="text-xs text-amber-600">Low stock</span>;
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
          to="/view/products?stockStatus=low"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">
          Loading recommendations...
        </div>
      ) : error ? (
        <div className="mt-4 text-sm text-red-600">
          Unable to load recommendations.
        </div>
      ) : !data?.items?.length ? (
        <div className="mt-4 text-sm text-slate-500">
          No replenishment needed 🎉
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {data.items.map((item) => (
            <Link
              key={item.id}
              to={`/view/products/${item.productId}`}
              className="block rounded-lg border border-slate-200 px-3 py-3 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    SKU: {item.sku}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {item.totalOnHand} {item.unit ?? ""}
                  </div>
                  {badge(item)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 md:grid-cols-4">
                <div>Available: {item.totalAvailable}</div>
                <div>Locations: {item.totalLocations}</div>
                <div>Low locations: {item.locationsLowStock}</div>
                <div>Out locations: {item.locationsOutOfStock}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}