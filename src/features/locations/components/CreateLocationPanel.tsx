import { useState } from "react";

type Props = {
  onSubmit: (input: {
    name: string;
    code: string;
    type: string;
  }) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const locationTypes = [
  { value: "store", label: "Store" },
  { value: "backroom", label: "Backroom" },
  { value: "warehouse", label: "Warehouse" },
  { value: "vehicle", label: "Vehicle" },
  { value: "other", label: "Other" },
];

export default function CreateLocationPanel({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("store");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Add Location</h2>
      <p className="mt-1 text-sm text-gray-600">
        Create a new place where inventory can be stored, moved, or counted.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Main Inventory"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location Code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MAIN"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          >
            {locationTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void onSubmit({ name, code, type })}
            disabled={isSubmitting || !name.trim() || !code.trim()}
            className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Location"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}