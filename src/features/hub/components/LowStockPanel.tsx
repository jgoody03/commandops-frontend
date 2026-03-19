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
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Low Stock</h2>
          <p className="text-sm text-slate-500">
            Products that need attention now.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
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
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">Loading low stock items...</div>
      ) : error ? (
        <div className="mt-4 text-sm text-red-600">
          Unable to load low stock products.
        </div>
      ) : !data?.items?.length ? (
        <div className="mt-4 text-sm text-slate-500">
          No matching low stock products.
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      SKU: {item.sku}
                      {item.primaryBarcode ? ` • Barcode: ${item.primaryBarcode}` : ""}
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

                <div className="mt-2 text-xs text-slate-400">
                  Updated: {formatUpdatedAt(item.updatedAtMs)}
                </div>
              </div>
            ))}
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