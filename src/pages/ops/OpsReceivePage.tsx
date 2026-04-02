import { useEffect, useMemo, useRef, useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import {
  useQuickCreateProduct,
  useReceiveInventory,
  useResolveScanCode,
} from "@/features/ops/hooks";
import { useVendors } from "@/features/vendors/hooks/useVendors";

type ResolvedProduct = {
  productId: string;
  name: string;
  sku: string;
  barcode?: string | null;
};

type ReceiveDraftLine = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost?: number | null;
  barcode?: string | null;
  note?: string;
};

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function OpsReceivePage() {
  
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const { data: locationOptionsData, loading: locationsLoading } =
    useLocationOptions();

  const resolveScanCode = useResolveScanCode();
  const quickCreateProduct = useQuickCreateProduct();
  const receiveInventory = useReceiveInventory();

  const scanInputRef = useRef<HTMLInputElement | null>(null);

  const locations = locationOptionsData?.items ?? [];

  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [sessionNote, setSessionNote] = useState("");
  const { data: vendors, loading: vendorsLoading } = useVendors(20);

  const [showVendorSuggestions, setShowVendorSuggestions] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitCost, setUnitCost] = useState("");
  const [lineNote, setLineNote] = useState("");

  const [resolvedProduct, setResolvedProduct] = useState<ResolvedProduct | null>(
    null
  );
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");

  const [lines, setLines] = useState<ReceiveDraftLine[]>([]);
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
    receiveInventory.isPending;

  const selectedLocation = useMemo(
    () =>
      locations.find((location) => location.locationId === selectedLocationId) ??
      null,
    [locations, selectedLocationId]
  );

  const totalUnits = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );
  const filteredVendors = useMemo(() => {
    const query = vendorName.trim().toLowerCase();

    if (!query) {
      return vendors.slice(0, 8);
    }

    return vendors
      .filter((vendor) => vendor.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [vendors, vendorName]);
  const errorMessage =
    resolveScanCode.error instanceof Error
      ? resolveScanCode.error.message
      : quickCreateProduct.error instanceof Error
        ? quickCreateProduct.error.message
        : receiveInventory.error instanceof Error
          ? receiveInventory.error.message
          : resolveScanCode.error || quickCreateProduct.error || receiveInventory.error
            ? "Something went wrong."
            : null;

  function resetLineBuilder() {
    setScanCode("");
    setResolvedProduct(null);
    setNotFoundCode(null);
    setNewProductName("");
    setNewProductSku("");
    setQuantity("1");
    setUnitCost("");
    setLineNote("");

    setTimeout(() => {
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

  function addDraftLine(product: {
    productId: string;
    name: string;
    sku: string;
    barcode?: string | null;
  }) {
    const parsedQuantity = Number(quantity);
    const parsedUnitCost =
      unitCost.trim() === "" ? null : Number(unitCost.trim());

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;
    if (parsedUnitCost !== null && !Number.isFinite(parsedUnitCost)) return;

    setLines((prev) => [
      ...prev,
      {
        id: `${product.productId}-${Date.now()}`,
        productId: product.productId,
        name: product.name,
        sku: product.sku,
        quantity: parsedQuantity,
        unitCost: parsedUnitCost,
        barcode: product.barcode ?? null,
        note: lineNote.trim() || undefined,
      },
    ]);

    resetLineBuilder();
  }

  async function handleAddResolved() {
    if (!resolvedProduct) return;

    addDraftLine({
      productId: resolvedProduct.productId,
      name: resolvedProduct.name,
      sku: resolvedProduct.sku,
      barcode: resolvedProduct.barcode ?? null,
    });
  }

  async function handleCreateAndAdd() {
    if (!workspaceId) return;
    if (!newProductName.trim() || !newProductSku.trim()) return;

    const created = await quickCreateProduct.mutateAsync({
      workspaceId,
      name: newProductName.trim(),
      sku: newProductSku.trim(),
      primaryBarcode: notFoundCode || undefined,
    });

    addDraftLine({
      productId: created.product.id,
      name: created.product.name,
      sku: created.product.sku,
      barcode: created.product.primaryBarcode ?? notFoundCode,
    });
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }

async function handlePostReceive() {
  if (!workspaceId || !selectedLocationId || !lines.length) return;

  const result = await receiveInventory.mutateAsync({
    workspaceId,
    locationId: selectedLocationId,
    vendorName: vendorName.trim() || undefined,
    referenceNumber: referenceNumber.trim() || undefined,
    note: sessionNote.trim() || undefined,
    lines: lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitCost: line.unitCost ?? undefined,
      barcode: line.barcode ?? undefined,
      note: line.note,
    })),
  });

  setSuccessMessage(
    `Receive posted: ${lines.length} item${
      lines.length === 1 ? "" : "s"
    } (${totalUnits} unit${totalUnits === 1 ? "" : "s"})${
      vendorName ? ` from ${vendorName}` : ""
    }${
      selectedLocation?.locationName ? ` → ${selectedLocation.locationName}` : ""
    }${
      result.postedAt ? ` • ${new Date(result.postedAt).toLocaleString()}` : ""
    }.`
  );

  setLines([]);
  resetLineBuilder();
}

return (
  <OpsShell
    title="Receive Inventory"
    subtitle="Record what arrived, where it went, and who it came from."
  >
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <PackagePlus size={20} />
          </div>

          <div>
            <div className="font-semibold text-slate-900">Receive session</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Capture the shipment header once, then scan products into the receive list.
            </p>
          </div>
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

          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Vendor
            </label>
            <input
              value={vendorName}
              onChange={(e) => {
                setVendorName(e.target.value);
                setShowVendorSuggestions(true);
              }}
              onFocus={() => setShowVendorSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => {
                  setShowVendorSuggestions(false);
                }, 120);
              }}
              placeholder="Pepsi, Coca-Cola, Main supplier"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />

            {showVendorSuggestions &&
            (filteredVendors.length > 0 || vendorsLoading) ? (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                {vendorsLoading ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Loading vendors...
                  </div>
                ) : (
                  filteredVendors.map((vendor) => (
                    <button
                      key={vendor.vendorId}
                      type="button"
                      onClick={() => {
                        setVendorName(vendor.name);
                        setShowVendorSuggestions(false);
                      }}
                      className="flex w-full flex-col items-start px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <span className="text-sm font-medium text-slate-900">
                        {vendor.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {vendor.receiveCount ?? 0} receive
                        {(vendor.receiveCount ?? 0) === 1 ? "" : "s"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reference number
            </label>
            <input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Invoice #12345"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Session note
            </label>
            <input
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="Optional shipment note"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="font-semibold text-slate-900">Add line item</div>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Resolve a product or create it inline, then add it to this receive session.
        </p>

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

        <div className="mt-5 grid gap-4 md:grid-cols-3">
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Unit cost
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              disabled={isBusy}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Line note
            </label>
            <input
              value={lineNote}
              onChange={(e) => setLineNote(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              disabled={isBusy}
            />
          </div>
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
                onClick={() => void handleAddResolved()}
                disabled={isBusy || Number(quantity) <= 0}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                Add to receive
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
              Create it now and add it to the receive list.
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
                  onClick={() => void handleCreateAndAdd()}
                  disabled={
                    !newProductName.trim() ||
                    !newProductSku.trim() ||
                    isBusy ||
                    Number(quantity) <= 0
                  }
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  Create and add
                </button>

                <button
                  type="button"
                  onClick={resetLineBuilder}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900">
              Receive session lines
              {vendorName ? (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  • {vendorName}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Review the lines queued for this shipment before posting.
            </p>
          </div>

          <div className="text-right text-sm text-slate-600">
            <div>{lines.length} line{lines.length === 1 ? "" : "s"}</div>
            <div>{totalUnits} unit{totalUnits === 1 ? "" : "s"}</div>
          </div>
        </div>

        {lines.length ? (
          <div className="mt-4 space-y-3">
            {lines.map((line) => (
              <div
                key={line.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-slate-900">{line.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{line.sku}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Qty: {line.quantity}
                    {line.unitCost !== null && line.unitCost !== undefined
                      ? ` • Cost: $${line.unitCost}`
                      : ""}
                  </div>
                  {line.note ? (
                    <div className="mt-1 text-sm text-slate-500">
                      Note: {line.note}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm leading-6 text-slate-500">
            No lines added yet. Start scanning products to build this receive session.
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={() => void handlePostReceive()}
            disabled={!selectedLocationId || !lines.length || isBusy}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {receiveInventory.isPending ? "Posting receive..." : "Post receive"}
          </button>
        </div>
      </div>
    </div>
  </OpsShell>
);
}