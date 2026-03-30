import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import {
  useAdjustInventory,
  useQuickCreateProduct,
  useResolveScanCode,
} from "@/features/ops/hooks";

type ResolvedProduct = {
  productId: string;
  name: string;
  sku: string;
  barcode?: string | null;
};

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function OpsCustomerReturnPage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const { data: locationOptionsData, loading: locationsLoading } =
    useLocationOptions();

  const resolveScanCode = useResolveScanCode();
  const quickCreateProduct = useQuickCreateProduct();
  const adjustInventory = useAdjustInventory();

  const scanInputRef = useRef<HTMLInputElement | null>(null);

  const locations = locationOptionsData?.items ?? [];

  const [scanCode, setScanCode] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [returnType, setReturnType] = useState<"restock" | "damaged">(
    "restock"
  );
  const [note, setNote] = useState("");

  const [resolvedProduct, setResolvedProduct] = useState<ResolvedProduct | null>(
    null
  );
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!locations.length) return;

    if (
      defaultLocationId &&
      locations.some((location) => location.locationId === defaultLocationId)
    ) {
      setSelectedLocationId((current) => current || defaultLocationId);
      return;
    }

    setSelectedLocationId((current) => current || locations[0]?.locationId || "");
  }, [locations, defaultLocationId]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      scanInputRef.current?.focus();
      scanInputRef.current?.select();
    }, 50);

    return () => window.clearTimeout(id);
  }, []);

  const isBusy =
    resolveScanCode.isPending ||
    quickCreateProduct.isPending ||
    adjustInventory.isPending;

  const selectedLocation = useMemo(
    () =>
      locations.find((location) => location.locationId === selectedLocationId) ??
      null,
    [locations, selectedLocationId]
  );

  const errorMessage =
    resolveScanCode.error instanceof Error
      ? resolveScanCode.error.message
      : quickCreateProduct.error instanceof Error
        ? quickCreateProduct.error.message
        : adjustInventory.error instanceof Error
          ? adjustInventory.error.message
          : resolveScanCode.error || quickCreateProduct.error || adjustInventory.error
            ? "Something went wrong."
            : null;

  function resetForm() {
    setScanCode("");
    setResolvedProduct(null);
    setNotFoundCode(null);
    setNewProductName("");
    setNewProductSku("");
    setQuantity("1");
    setReturnType("restock");
    setNote("");

    window.setTimeout(() => {
      scanInputRef.current?.focus();
      scanInputRef.current?.select();
    }, 30);
  }

  function handleNameChange(value: string) {
    setNewProductName(value);

    setNewProductSku((current) => {
      if (!current.trim() || current === makeSuggestedSku(newProductName)) {
        return makeSuggestedSku(value);
      }
      return current;
    });
  }

  async function handleResolve() {
    if (!workspaceId) return;

    const trimmed = scanCode.trim();
    if (!trimmed) return;

    setSuccessMessage(null);
    setResolvedProduct(null);
    setNotFoundCode(null);

    const result = await resolveScanCode.mutateAsync({
      workspaceId,
      code: trimmed,
    });

    if (result.resolutionStatus === "resolved") {
      setResolvedProduct({
        productId: result.productId,
        name: result.productName,
        sku: result.sku,
        barcode: trimmed,
      });
      return;
    }

    setNotFoundCode(trimmed);
    setNewProductName("");
    setNewProductSku(makeSuggestedSku(trimmed));
  }

  async function handleSubmitExisting() {
    if (!workspaceId || !selectedLocationId || !resolvedProduct) return;

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;

    const quantityDelta =
      returnType === "restock" ? parsedQuantity : -parsedQuantity;

await adjustInventory.mutateAsync({
  workspaceId,
  locationId: selectedLocationId,
  lines: [
    {
      productId: resolvedProduct.productId,
      quantityDelta,
      reasonCode:
        returnType === "restock"
          ? "customer_return_restock"
          : "customer_return_damaged",
      note: note.trim() || undefined,
    },
  ],
});
    setSuccessMessage(
      `Processed return: ${parsedQuantity} × ${resolvedProduct.name} (${returnType}) at ${
        selectedLocation?.locationName ?? "selected location"
      }.`
    );

    resetForm();
  }

  async function handleCreateAndSubmit() {
    if (!workspaceId || !selectedLocationId) return;

    const parsedQuantity = Number(quantity);
    if (!newProductName.trim() || !newProductSku.trim()) return;
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;

    const created = await quickCreateProduct.mutateAsync({
      workspaceId,
      name: newProductName.trim(),
      sku: newProductSku.trim(),
      primaryBarcode: notFoundCode || undefined,
    });

    const quantityDelta =
      returnType === "restock" ? parsedQuantity : -parsedQuantity;

await adjustInventory.mutateAsync({
  workspaceId,
  locationId: selectedLocationId,
  lines: [
    {
      productId: created.product.id,
      quantityDelta,
      reasonCode:
        returnType === "restock"
          ? "customer_return_restock"
          : "customer_return_damaged",
      note: note.trim() || undefined,
    },
  ],
});
    setSuccessMessage(
      `Processed return: ${parsedQuantity} × ${created.product.name} (${returnType}) at ${
        selectedLocation?.locationName ?? "selected location"
      }.`
    );

    resetForm();
  }

  return (
    <OpsShell
      title="Customer Return"
      subtitle="Process returned inventory and keep a clear audit trail."
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <RotateCcw size={20} />
            </div>

            <div>
              <div className="font-semibold text-slate-900">
                Scan or enter a product
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Resolve an existing product, or create it inline if it is not found.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              ref={scanInputRef}
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              placeholder="Scan barcode or type code"
              className="h-14 flex-1 rounded-2xl border border-slate-300 px-4 text-base outline-none transition focus:border-slate-900"
              disabled={isBusy}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleResolve();
                }
              }}
            />

            <button
              type="button"
              onClick={() => void handleResolve()}
              disabled={!scanCode.trim() || isBusy}
              className="h-14 rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {resolveScanCode.isPending ? "Resolving..." : "Resolve"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Location
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                disabled={locationsLoading || !locations.length || isBusy}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 disabled:opacity-60"
              >
                {!locations.length ? (
                  <option value="">No locations available</option>
                ) : null}
                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.locationName}
                    {location.locationCode ? ` (${location.locationCode})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Return type
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setReturnType("restock")}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  returnType === "restock"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Restock
              </button>

              <button
                type="button"
                onClick={() => setReturnType("damaged")}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  returnType === "damaged"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Damaged
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Note
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              disabled={isBusy}
            />
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          {resolvedProduct ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Product ready
              </div>

              <div className="mt-3 font-semibold text-slate-900">
                {resolvedProduct.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {resolvedProduct.sku}
                {resolvedProduct.barcode ? ` • Barcode: ${resolvedProduct.barcode}` : ""}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => void handleSubmitExisting()}
                  disabled={!selectedLocationId || isBusy || Number(quantity) <= 0}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {adjustInventory.isPending ? "Submitting..." : "Process return"}
                </button>
              </div>
            </div>
          ) : null}

          {notFoundCode ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Product not found
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create it now so the return is still recorded cleanly.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Product name
                  </label>
                  <input
                    value={newProductName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Sparkling Water 12oz"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    disabled={isBusy}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    SKU
                  </label>
                  <input
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value.toUpperCase())}
                    placeholder="SPARKLING-WATER-12OZ"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    disabled={isBusy}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleCreateAndSubmit()}
                    disabled={
                      !newProductName.trim() ||
                      !newProductSku.trim() ||
                      !selectedLocationId ||
                      isBusy ||
                      Number(quantity) <= 0
                    }
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {quickCreateProduct.isPending || adjustInventory.isPending
                      ? "Submitting..."
                      : "Create and process return"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </OpsShell>
  );
}