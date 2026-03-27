import { useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import CreateLocationPanel from "@/features/locations/components/CreateLocationPanel";
import { useCreateLocation } from "@/features/locations/hooks/useCreateLocation";
import { useLocations } from "@/features/locations/hooks/useLocations";

export default function ViewLocationsPage() {
  const { data, loading, error, reload } = useLocations();
  const createLocation = useCreateLocation();
  const [showCreate, setShowCreate] = useState(false);

  const locations = data?.items ?? [];

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Something went wrong."
        : null;

  async function handleCreate(input: {
    name: string;
    code: string;
    type: string;
  }) {
    await createLocation.submit(input);
    setShowCreate(false);
    await reload();
  }

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage the places where inventory is stored, moved, and counted.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate((prev) => !prev)}
              className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              {showCreate ? "Close" : "Add Location"}
            </button>
          </div>
        </div>

        {showCreate ? (
          <CreateLocationPanel
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isSubmitting={createLocation.loading}
          />
        ) : null}

        {createLocation.error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {createLocation.error instanceof Error
              ? createLocation.error.message
              : "Unable to create location."}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">All Locations</h2>

          {loading ? (
            <div className="mt-4 text-sm text-gray-500">Loading locations...</div>
          ) : locations.length ? (
            <div className="mt-4 space-y-3">
              {locations.map((location) => (
                <Link
                  key={location.id}
                  to={`/view/locations/${location.id}`}
                  className="block rounded-xl border border-gray-200 px-4 py-4 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {location.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {location.code} · {location.type}
                      </div>
                    </div>

                    <div className="text-sm font-medium text-blue-600">
                      View inventory
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">
              No locations yet. Add your first location to begin organizing inventory.
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}