import { Link } from "react-router-dom";
import type { LocationSummaryListItem } from "../api/getLocationSummaryList";

type Props = {
  data: {
    items: LocationSummaryListItem[];
    nextCursor: { updatedAtMs: number; docId: string } | null;
  } | null;
  loading: boolean;
  loadingMore?: boolean;
  error?: unknown;
  query: string;
  setQuery: (value: string) => void;
  loadMore: () => void;
  hasMore: boolean;
};

function formatUpdatedAt(ms: number | null) {
  if (!ms) return "No recent update";
  return new Date(ms).toLocaleString();
}

export default function LocationSummaryPanel({
  data,
  loading,
  loadingMore = false,
  error,
  query,
  setQuery,
  loadMore,
  hasMore,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Locations</h2>
          <p className="text-sm text-slate-500">
            Operational inventory status by location.
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location name or code"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">Loading locations...</div>
      ) : error ? (
        <div className="mt-4 text-sm text-red-600">
          Unable to load location summaries.
        </div>
      ) : !data?.items?.length ? (
        <div className="mt-4 text-sm text-slate-500">
          No matching locations found.
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {data.items.map((item) => (
              <Link
                key={item.id}
                to={`/view/locations/${item.locationId}`}
                className="block rounded-lg border border-slate-200 px-3 py-3 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-900">
                      {item.locationName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {item.locationCode
                        ? `Code: ${item.locationCode}`
                        : "No location code"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">
                      {item.totalUnits} units
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.totalSkus} SKUs
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 md:grid-cols-4">
                  <div>Available: {item.totalAvailableUnits}</div>
                  <div>In stock SKUs: {item.inStockSkuCount}</div>
                  <div>Low stock SKUs: {item.lowStockSkuCount}</div>
                  <div>Out of stock SKUs: {item.outOfStockSkuCount}</div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Updated: {formatUpdatedAt(item.updatedAtMs)}
                  </div>

                  <div className="text-sm font-medium text-blue-600">
                    View inventory
                  </div>
                </div>
              </Link>
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