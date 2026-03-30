import { useEffect, useMemo, useState } from "react";
import { useQuickCreateProduct, useReceiveInventory } from "@/features/ops/hooks";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

type AddedProduct = {
  id: string;
  name: string;
  sku: string;
  locationName: string;
  quantity: number;
};

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function StepProducts({ onBack, onNext }: Props) {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const quickCreateProduct = useQuickCreateProduct();
  const receiveInventory = useReceiveInventory();
  const { data: locationOptionsData, loading: locationsLoading } =
    useLocationOptions();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [addedProducts, setAddedProducts] = useState<AddedProduct[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const locations = locationOptionsData?.items ?? [];

  useEffect(() => {
    if (!locations.length) return;

    if (
      defaultLocationId &&
      locations.some((location) => location.locationId === defaultLocationId)
    ) {
      setLocationId((current) => current || defaultLocationId);
      return;
    }

    setLocationId((current) => current || locations[0]?.locationId || "");
  }, [locations, defaultLocationId]);

  const errorMessage =
    quickCreateProduct.error instanceof Error
      ? quickCreateProduct.error.message
      : receiveInventory.error instanceof Error
        ? receiveInventory.error.message
        : quickCreateProduct.error || receiveInventory.error
          ? "Unable to add product."
          : null;

  const canSave = useMemo(() => {
    const parsedQuantity = Number(quantity);

    return Boolean(
      workspaceId &&
        name.trim() &&
        sku.trim() &&
        locationId &&
        Number.isFinite(parsedQuantity) &&
        parsedQuantity > 0
    );
  }, [workspaceId, name, sku, locationId, quantity]);

  function handleNameChange(value: string) {
    setName(value);

    setSku((current) => {
      if (!current.trim() || current === makeSuggestedSku(name)) {
        return makeSuggestedSku(value);
      }
      return current;
    });
  }

  async function handleAddProduct() {
    if (!workspaceId || !canSave) return;

    const parsedQuantity = Number(quantity);
    const selectedLocation = locations.find(
      (location) => location.locationId === locationId
    );

    if (!selectedLocation) return;

    const created = await quickCreateProduct.mutateAsync({
      workspaceId,
      name: name.trim(),
      sku: sku.trim(),
    });

    await receiveInventory.mutateAsync({
      workspaceId,
      locationId,
      lines: [
        {
          productId: created.product.id,
          quantity: parsedQuantity,
        },
      ],
    });

    setAddedProducts((prev) => [
      ...prev,
      {
        id: created.product.id,
        name: created.product.name,
        sku: created.product.sku,
        locationName: selectedLocation.locationName,
        quantity: parsedQuantity,
      },
    ]);

    setSuccessMessage(
      `Added ${created.product.name} with ${parsedQuantity} starting unit${
        parsedQuantity === 1 ? "" : "s"
      }.`
    );
    window.setTimeout(() => setSuccessMessage(null), 1600);

    setName("");
    setSku("");
    setQuantity("1");
  }

  const isSubmitting =
    quickCreateProduct.isPending || receiveInventory.isPending;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Step 3 of 3
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        Add your first product
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Add a starter product and place beginning inventory into a location so
        your store is ready to use right away.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Quick add product
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product name
              </label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Sparkling Water 12oz"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                SKU
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="SPARKLING-WATER-12OZ"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                disabled={locationsLoading || !locations.length}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 disabled:opacity-60"
              >
                {!locations.length ? (
                  <option value="">No locations available</option>
                ) : null}
                {locations.map((location) => (
                  <option
                    key={location.locationId}
                    value={location.locationId}
                  >
                    {location.locationName}
                    {location.locationCode
                      ? ` (${location.locationCode})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Starting quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleAddProduct()}
              disabled={!canSave || isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add product"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Added products
          </h3>

          {addedProducts.length ? (
            <div className="mt-4 space-y-3">
              {addedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="font-medium text-slate-900">
                    {product.name}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {product.sku}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {product.quantity} unit{product.quantity === 1 ? "" : "s"} in{" "}
                    {product.locationName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6 text-slate-500">
              Add a starter product with beginning quantity so inventory shows
              up immediately in your workspace.
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Finish setup
          </button>
        </div>
      </div>
    </div>
  );
}