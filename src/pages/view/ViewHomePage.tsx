import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";

export default function ViewHomePage() {
  const {
    data: locationOptionsData,
    loading,
    error,
  } = useLocationOptions();

  const locations = locationOptionsData?.items ?? [];

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Something went wrong."
        : null;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">View</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse inventory by product and by location. This is the first step
            toward drill-down views and action-driven inventory workflows.
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/view/products"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="text-lg font-semibold text-gray-900">Products</div>
            <p className="mt-2 text-sm text-gray-600">
              Browse stock status, total quantities, and next actions by product.
            </p>
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold text-gray-900">
              Location inventory
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Open a real location inventory view to inspect stock at that location.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {loading ? (
                <div className="text-sm text-gray-500">Loading locations...</div>
              ) : locations.length ? (
                locations.map((location) => (
                  <Link
                    key={location.locationId}
                    to={`/view/locations/${location.locationId}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {location.locationName}
                    {location.locationCode ? ` (${location.locationCode})` : ""}
                  </Link>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No locations available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}