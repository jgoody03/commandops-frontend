import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ReceiveLocationOption, ResolvedProductSummary } from "../types";

type Props = {
  product: ResolvedProductSummary;
  locations: ReceiveLocationOption[];
  defaultLocationId?: string;
  preferredLocationId?: string;
  onSubmit: (input: {
    locationId: string;
    countedQuantity: number;
    note: string;
  }) => void | Promise<void>;
  onReset: () => void;
  isSubmitting?: boolean;
  repeatMode?: boolean;
  onRepeatModeChange?: (value: boolean) => void;
};

export default function CountEntryForm({
  product,
  locations,
  defaultLocationId,
  preferredLocationId,
  onSubmit,
  onReset,
  isSubmitting = false,
  repeatMode = false,
}: Props) {
  const countRef = useRef<HTMLInputElement | null>(null);

  const initialLocationId = useMemo(() => {
    if (
      preferredLocationId &&
      locations.some((location) => location.id === preferredLocationId)
    ) {
      return preferredLocationId;
    }

    if (
      defaultLocationId &&
      locations.some((location) => location.id === defaultLocationId)
    ) {
      return defaultLocationId;
    }

    return locations[0]?.id ?? "";
  }, [preferredLocationId, defaultLocationId, locations]);

  const [locationId, setLocationId] = useState(initialLocationId);
  const [countedQuantity, setCountedQuantity] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setLocationId((current) => {
      if (
        repeatMode &&
        current &&
        locations.some((location) => location.id === current)
      ) {
        return current;
      }
      return initialLocationId;
    });
  }, [initialLocationId, product.productId, repeatMode, locations]);

  useEffect(() => {
    setCountedQuantity("");
    setNote("");

    const id = window.setTimeout(() => {
      countRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(id);
  }, [product.productId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedCount = Number(countedQuantity);

    if (!locationId || !Number.isFinite(parsedCount) || parsedCount < 0) {
      return;
    }

    void onSubmit({
      locationId,
      countedQuantity: parsedCount,
      note: note.trim(),
    });
  }

  const hasLocations = locations.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          Count inventory
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter the actual counted quantity at the selected location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-sm text-gray-600">Counting</div>
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
            Counted quantity
          </label>
          <input
            ref={countRef}
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={countedQuantity}
            onChange={(e) => setCountedQuantity(e.target.value)}
            disabled={isSubmitting}
            placeholder="Example: 12"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />
        </div>

        <details className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Optional note
          </summary>
          <div className="mt-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
              placeholder="Optional count note"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>
        </details>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isSubmitting || !hasLocations || !locationId || countedQuantity === ""
            }
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Posting..." : "Submit count"}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition active:scale-[0.98] hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}