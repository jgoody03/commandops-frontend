import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, ScanLine } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import {
  useQuickCreateProduct,
  useReceiveInventory,
  useResolveScanCode,
} from "@/features/ops/hooks";

type ResolvedProduct = {
  productId: string;
  name: string;
  sku: string;
  barcode?: string | null;
  unitLabel?: string | null;
};

type AddedRow = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  locationName: string;
};

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function ScanLoadPage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const { data: locationOptionsData, loading: locationsLoading } =
    useLocationOptions();

  const resolveScanCode = useResolveScanCode();
  const quickCreateProduct = useQuickCreateProduct();
  const receiveInventory = useReceiveInventory();

  const scanInputRef = useRef<HTMLInputElement | null>(null);
  const createNameRef = useRef<HTMLInputElement | null>(null);
  const quantityRef = useRef<HTMLInputElement | null>(null);

  const locations = locationOptionsData?.items ?? [];

  const [scanCode, setScanCode] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [keepQuantity, setKeepQuantity] = useState(true);

  const [resolvedProduct, setResolvedProduct] = useState<ResolvedProduct | null>(
    null
  );
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activityRows, setActivityRows] = useState<AddedRow[]>([]);
  const [totalProductsAdded, setTotalProductsAdded] = useState(0);
  const [totalUnitsAdded, setTotalUnitsAdded] = useState(0);


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

  function resetForNextScan() {
    setScanCode("");
    setResolvedProduct(null);
    setNotFoundCode(null);
    setNewProductName("");
    setNewProductSku("");
    if (!keepQuantity) {
      setQuantity("1");
    }

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
      unitLabel: "each",
    });

    window.setTimeout(() => {
      quantityRef.current?.focus();
      quantityRef.current?.select();
    }, 30);

    return;
  }

  setNotFoundCode(trimmed);
  setNewProductName("");
  setNewProductSku(makeSuggestedSku(trimmed));

  window.setTimeout(() => {
    createNameRef.current?.focus();
  }, 30);
}

  async function handleCreateAndReceive() {
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

    await receiveInventory.mutateAsync({
      workspaceId,
      locationId: selectedLocationId,
      lines: [
        {
          productId: created.product.id,
          quantity: parsedQuantity,
        },
      ],
    });

    const locationName = selectedLocation?.locationName ?? "selected location";

    setSuccessMessage(
      `Added ${parsedQuantity} × ${created.product.name} to ${locationName}.`
    );

    setActivityRows((prev) => [
      {
        id: `${created.product.id}-${Date.now()}`,
        name: created.product.name,
        sku: created.product.sku,
        quantity: parsedQuantity,
        locationName,
      },
      ...prev,
    ]);

    setTotalProductsAdded((prev) => prev + 1);
    setTotalUnitsAdded((prev) => prev + parsedQuantity);

    resetForNextScan();
  }

  async function handleReceiveExisting() {
    if (!workspaceId || !selectedLocationId || !resolvedProduct) return;

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;

    await receiveInventory.mutateAsync({
      workspaceId,
      locationId: selectedLocationId,
      lines: [
        {
          productId: resolvedProduct.productId,
          quantity: parsedQuantity,
        },
      ],
    });

    const locationName = selectedLocation?.locationName ?? "selected location";

    setSuccessMessage(
      `Added ${parsedQuantity} × ${resolvedProduct.name} to ${locationName}.`
    );

    setActivityRows((prev) => [
      {
        id: `${resolvedProduct.productId}-${Date.now()}`,
        name: resolvedProduct.name,
        sku: resolvedProduct.sku,
        quantity: parsedQuantity,
        locationName,
      },
      ...prev,
    ]);

    setTotalProductsAdded((prev) => prev + 1);
    setTotalUnitsAdded((prev) => prev + parsedQuantity);

    resetForNextScan();
  }

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Scan your store
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Load inventory one scan at a time
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Scan a product, assign it to a location, set a starting quantity,
                and keep going. This flow is built to make a fresh store setup feel
                fast and practical.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">
                  {totalProductsAdded}
                </span>{" "}
                products added
              </div>
              <div className="mt-1">
                <span className="font-semibold text-slate-900">
                  {totalUnitsAdded}
                </span>{" "}
                units loaded
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <ScanLine size={20} />
              </div>

              <div>
                <div className="font-semibold text-slate-900">
                  Scan or enter a product code
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Existing products resolve instantly. If a product is not found,
                  you can create it inline and keep moving.
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
                className="h-14 rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resolveScanCode.isPending ? "Resolving..." : "Resolve"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px]">
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
                  Quantity
                </label>
                <input
                  ref={quantityRef}
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

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  id="keep-quantity"
                  type="checkbox"
                  checked={keepQuantity}
                  onChange={(e) => setKeepQuantity(e.target.checked)}
                />
                <label htmlFor="keep-quantity">Keep quantity for next scan</label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => String(Math.max(1, Number(prev || "0") + 1)))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => String(Math.max(1, Number(prev || "0") + 5)))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => String(Math.max(1, Number(prev || "0") + 10)))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  +10
                </button>
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
                  Product found
                </div>

                <div className="mt-3 font-semibold text-slate-900">
                  {resolvedProduct.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {resolvedProduct.sku}
                  {resolvedProduct.barcode
                    ? ` • Barcode: ${resolvedProduct.barcode}`
                    : ""}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => void handleReceiveExisting()}
                    disabled={!selectedLocationId || isBusy || Number(quantity) <= 0}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {receiveInventory.isPending ? "Adding..." : "Add inventory"}
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
                  Create it now and add starting inventory immediately.
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Product name
                    </label>
                    <input
                      ref={createNameRef}
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
                      onClick={() => void handleCreateAndReceive()}
                      disabled={
                        !newProductName.trim() ||
                        !newProductSku.trim() ||
                        !selectedLocationId ||
                        isBusy ||
                        Number(quantity) <= 0
                      }
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {quickCreateProduct.isPending || receiveInventory.isPending
                        ? "Adding..."
                        : "Create and add inventory"}
                    </button>

                    <button
                      type="button"
                      onClick={resetForNextScan}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Inventory load progress
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Build momentum as you scan your store into the system.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-sm text-slate-500">Products added</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {totalProductsAdded}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-sm text-slate-500">Units loaded</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {totalUnitsAdded}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/hub"
                  className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  Finish and go to dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="font-semibold text-slate-900">Recent adds</div>

              {activityRows.length ? (
                <div className="mt-4 space-y-3">
                  {activityRows.slice(0, 8).map((row) => (
                    <div
                      key={row.id}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <div className="font-medium text-slate-900">{row.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{row.sku}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {row.quantity} unit{row.quantity === 1 ? "" : "s"} in{" "}
                        {row.locationName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm leading-6 text-slate-500">
                  Start scanning to build your live inventory list.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}