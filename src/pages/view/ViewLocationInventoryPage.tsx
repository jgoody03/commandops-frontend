import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import LocationInventoryTable from "@/features/view/components/LocationInventoryTable";
import { useLocationInventory } from "@/features/view/hooks";

export default function ViewLocationInventoryPage() {
  const { locationId = "" } = useParams();

  const {
    data,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore,
  } = useLocationInventory({
    locationId,
    initialLimit: 50,
  });

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Something went wrong."
        : null;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            View · Location Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Inspect inventory for a specific location.
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/view" className="font-medium text-blue-600 hover:text-blue-700">
              Back to View Home
            </Link>
            <span className="text-gray-500">Location: {locationId}</span>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Loading location inventory...
          </div>
        ) : (
          <LocationInventoryTable items={data?.items ?? []} />
        )}

        {hasMore ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}