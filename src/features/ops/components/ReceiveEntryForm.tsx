import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReceiveLocationOption, ResolvedProductSummary } from "../types";

type Props = {
  product: ResolvedProductSummary;
  locations: ReceiveLocationOption[];
  defaultLocationId?: string;
  onSubmit: (input: { locationId: string; quantity: number }) => void | Promise<void>;
  onReset: () => void;
  isSubmitting?: boolean;
};

export default function ReceiveEntryForm({
  product,
  locations,
  defaultLocationId,
  onSubmit,
  onReset,
  isSubmitting = false,
}: Props) {
  const initialLocationId = useMemo(() => {
    if (defaultLocationId && locations.some((location) => location.id === defaultLocationId)) {
      return defaultLocationId;
    }
    return locations[0]?.id ?? "";
  }, [defaultLocationId, locations]);

  const [locationId, setLocationId] = useState(initialLocationId);
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    setLocationId(initialLocationId);
  }, [initialLocationId, product.productId]);

  useEffect(() => {
    setQuantity("1");
  }, [product.productId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedQuantity = Number(quantity);
    if (!locationId || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return;
    }

    onSubmit({
      locationId,
      quantity: parsedQuantity,
    });
  }

  const hasLocations = locations.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          Receive inventory
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Confirm quantity and target location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-sm text-gray-600">Receiving</div>
          <div className="mt-1 text-base font-semibold text-gray-900">
            {product.name}
          </div>
          <div className="mt-1 text-sm text-gray-600">{product.sku}</div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            disabled={!hasLocations || isSubmitting}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          >
            {!hasLocations ? <option value="">No active locations</option> : null}
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
                {location.code ? ` (${location.code})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !hasLocations || !locationId}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Posting..." : "Receive inventory"}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}