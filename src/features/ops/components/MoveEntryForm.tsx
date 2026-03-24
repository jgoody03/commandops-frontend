import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReceiveLocationOption, ResolvedProductSummary } from "../types";

type Props = {
  product: ResolvedProductSummary;
  locations: ReceiveLocationOption[];
  defaultLocationId?: string;
  onSubmit: (input: {
    sourceLocationId: string;
    targetLocationId: string;
    quantity: number;
    note: string;
  }) => void | Promise<void>;
  onReset: () => void;
  isSubmitting?: boolean;
};

export default function MoveEntryForm({
  product,
  locations,
  defaultLocationId,
  onSubmit,
  onReset,
  isSubmitting = false,
}: Props) {
  const defaultTargetLocationId = useMemo(() => {
    if (
      defaultLocationId &&
      locations.some((location) => location.id === defaultLocationId)
    ) {
      return defaultLocationId;
    }
    return locations[0]?.id ?? "";
  }, [defaultLocationId, locations]);

  const defaultSourceLocationId = useMemo(() => {
    const firstNonDefault = locations.find(
      (location) => location.id !== defaultTargetLocationId
    );
    return firstNonDefault?.id ?? locations[0]?.id ?? "";
  }, [locations, defaultTargetLocationId]);

  const [sourceLocationId, setSourceLocationId] = useState(defaultSourceLocationId);
  const [targetLocationId, setTargetLocationId] = useState(defaultTargetLocationId);
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");

  useEffect(() => {
    setSourceLocationId(defaultSourceLocationId);
    setTargetLocationId(defaultTargetLocationId);
  }, [defaultSourceLocationId, defaultTargetLocationId, product.productId]);

  useEffect(() => {
    setQuantity("1");
    setNote("");
  }, [product.productId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedQuantity = Number(quantity);

    if (
      !sourceLocationId ||
      !targetLocationId ||
      sourceLocationId === targetLocationId ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return;
    }

    onSubmit({
      sourceLocationId,
      targetLocationId,
      quantity: parsedQuantity,
      note: note.trim(),
    });
  }

  const hasLocations = locations.length > 0;
  const sameLocation = sourceLocationId === targetLocationId;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          Move inventory
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Choose source and destination locations, then confirm quantity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-sm text-gray-600">Moving</div>
          <div className="mt-1 text-base font-semibold text-gray-900">
            {product.name}
          </div>
          <div className="mt-1 text-sm text-gray-600">{product.sku}</div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From location
          </label>
          <select
            value={sourceLocationId}
            onChange={(e) => setSourceLocationId(e.target.value)}
            disabled={!hasLocations || isSubmitting}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          >
            {!hasLocations ? <option value="">No locations</option> : null}
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
            To location
          </label>
          <select
            value={targetLocationId}
            onChange={(e) => setTargetLocationId(e.target.value)}
            disabled={!hasLocations || isSubmitting}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          >
            {!hasLocations ? <option value="">No locations</option> : null}
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
                {location.code ? ` (${location.code})` : ""}
              </option>
            ))}
          </select>
        </div>

        {sameLocation && hasLocations ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Source and destination locations must be different.
          </div>
        ) : null}

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

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
            placeholder="Optional"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !hasLocations ||
              !sourceLocationId ||
              !targetLocationId ||
              sameLocation
            }
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Posting..." : "Move inventory"}
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