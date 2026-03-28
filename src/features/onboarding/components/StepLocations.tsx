import { useMemo, useState } from "react";
import { useCreateLocation } from "@/features/locations/hooks/useCreateLocation";
import { useLocations } from "@/features/locations/hooks/useLocations";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const locationTypes = [
  { value: "store", label: "Store" },
  { value: "backroom", label: "Backroom" },
  { value: "warehouse", label: "Warehouse" },
  { value: "vehicle", label: "Vehicle" },
  { value: "other", label: "Other" },
];

function makeSuggestedCode(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 12);
}

export default function StepLocations({ onBack, onNext }: Props) {
  const { data, loading, error, reload } = useLocations();
  const createLocation = useCreateLocation();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("store");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const locations = data?.items ?? [];

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Something went wrong while loading locations."
        : null;

  const createErrorMessage =
    createLocation.error instanceof Error
      ? createLocation.error.message
      : createLocation.error
        ? "Unable to create location."
        : null;

  const canSave = useMemo(() => {
    return Boolean(name.trim() && code.trim() && type);
  }, [name, code, type]);

  function handleNameChange(value: string) {
    setName(value);

    setCode((current) => {
      if (!current.trim() || current === makeSuggestedCode(name)) {
        return makeSuggestedCode(value);
      }
      return current;
    });
  }

  async function handleAddLocation() {
    if (!canSave) return;

    await createLocation.submit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type,
    });

    setSuccessMessage(`Added ${name.trim()}.`);
    window.setTimeout(() => setSuccessMessage(null), 1600);

    setName("");
    setCode("");
    setType("store");
    await reload();
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Step 2 of 3
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        Add your first location
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Locations are where inventory lives. Start with at least one real place
        like your main storage area, shop floor, or backroom.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Create location
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Location name
              </label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Main Inventory"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Location code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="MAIN"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                {locationTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {createErrorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {createErrorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleAddLocation()}
              disabled={!canSave || createLocation.loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createLocation.loading ? "Saving..." : "Add location"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Your locations
          </h3>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </div>
          ) : loading ? (
            <div className="mt-4 text-sm text-slate-500">
              Loading locations...
            </div>
          ) : locations.length ? (
            <div className="mt-4 space-y-3">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="font-medium text-slate-900">
                    {location.name}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {location.code} · {location.type}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6 text-slate-500">
              No locations yet. Add your first one to continue.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!locations.length}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  );
}