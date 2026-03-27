import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { useLocations } from "@/features/locations/hooks/useLocations";

export default function ViewHomePage() {
  const { data, loading, error } = useLocations();
  const locations = data?.items ?? [];

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
            Browse inventory by product and by location. This is the control layer
            for drill-down views and action-driven inventory workflows.
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
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
          >
            <div className="text-lg font-semibold text-gray-900">Products</div>
            <p className="mt-2 text-sm text-gray-600">
              Browse stock status, total quantities, and next actions by product.
            </p>
          </Link>

          <Link
            to="/view/locations"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
          >
            <div className="text-lg font-semibold text-gray-900">Locations</div>
            <p className="mt-2 text-sm text-gray-600">
              Manage locations and inspect inventory held at each one.
            </p>

            <div className="mt-4 text-sm text-gray-500">
              {loading
                ? "Loading locations..."
                : `${locations.length} location${locations.length === 1 ? "" : "s"} available`}
            </div>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}