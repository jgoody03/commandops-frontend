import { Link } from "react-router-dom";
import type { ProductSummaryListItem } from "../api/getLowStockProducts";

type Props = {
  data: {
    items: ProductSummaryListItem[];
    nextCursor: { updatedAtMs: number; docId: string } | null;
  } | null;
  loading: boolean;
  loadingMore?: boolean;
  error?: unknown;
  query: string;
  setQuery: (value: string) => void;
  outOnly: boolean;
  setOutOnly: (value: boolean) => void;
  loadMore: () => void;
  hasMore: boolean;
};

function formatUpdatedAt(ms: number | null) {
  if (!ms) return "No recent update";
  return new Date(ms).toLocaleString();
}

function statusLabel(item: ProductSummaryListItem) {
  return item.stockStatus === "out" ? "Out of stock" : "Low stock";
}

function statusBadge(item: ProductSummaryListItem) {
  if (item.stockStatus === "out") {
    return (
      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
        Out of stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
      Low stock
    </span>
  );
}

function buildOpsQuery(item: ProductSummaryListItem) {
  return `productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`;
}

export default function LowStockPanel({
  data,
  loading,
  loadingMore = false,
  error,
  query,
  setQuery,
  outOnly,
  setOutOnly,
  loadMore,
  hasMore,
}: Props) {
  const viewAllLink = outOnly
    ? "/view/products?stockStatus=out"
    : "/view/products?stockStatus=low";

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Low Stock</h2>
          <p className="text-sm text-slate-500">
            Products that need attention now.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SKU, name, or barcode"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={outOnly}
              onChange={(e) => setOutOnly(e.target.checked)}
            />
            Out only
          </label>

          <Link
            to={viewAllLink}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View in products
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">
          Checking which products need attention...
        </div>
      ) : error ? (
        <div className="mt-4 text-sm text-red-600">
          Unable to load low stock products.
        </div>
      ) : !data?.items?.length ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="text-sm font-medium text-emerald-800">
            {outOnly
              ? "No out-of-stock products match this view right now."
              : "No low-stock products match this view right now."}
          </div>
          <p className="mt-1 text-sm text-emerald-700">
            {outOnly
              ? "That means nothing in the current filter is fully out at the moment. You can still review all products or switch back to low-stock items to look for early warning signs."
              : "Inventory looks stable for the current filter. You can still review all products or switch to out-only mode if you want to focus on urgent gaps."}
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
        <>
          <div className="mt-4 space-y-3">
            {data.items.map((item) => {
              const opsQuery = buildOpsQuery(item);

              return (
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
                        {statusBadge(item)}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        SKU: {item.sku}
                        {item.primaryBarcode
                          ? ` • Barcode: ${item.primaryBarcode}`
                          : ""}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {item.totalOnHand} {item.unit ?? ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {statusLabel(item)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 md:grid-cols-4">
                    <div>Available: {item.totalAvailable}</div>
                    <div>Locations: {item.totalLocations}</div>
                    <div>Low locations: {item.locationsLowStock}</div>
                    <div>Out locations: {item.locationsOutOfStock}</div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/ops/receive?${opsQuery}`}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Receive
                    </Link>

                    <Link
                      to={`/ops/move?${opsQuery}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Move
                    </Link>

                    <Link
                      to={`/ops/count?${opsQuery}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Count
                    </Link>

                    <Link
                      to={`/view/products/${item.productId}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Review product
                    </Link>
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    Updated: {formatUpdatedAt(item.updatedAtMs)}
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}