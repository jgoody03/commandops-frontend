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

const vendorReturnDetailOptions = [
  { value: "expired", label: "Expired" },
  { value: "damaged", label: "Damaged" },
  { value: "unsold", label: "Unsold" },
  { value: "other", label: "Other" },
];

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function OpsVendorReturnPage() {
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
  const [vendorReturnDetail, setVendorReturnDetail] =
    useState("expired");
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
      locations.some((l) => l.locationId === defaultLocationId)
    ) {
      setSelectedLocationId((c) => c || defaultLocationId);
      return;
    }

    setSelectedLocationId((c) => c || locations[0]?.locationId || "");
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
      locations.find((l) => l.locationId === selectedLocationId) ?? null,
    [locations, selectedLocationId]
  );

  function resetForm() {
    setScanCode("");
    setResolvedProduct(null);
    setNotFoundCode(null);
    setNewProductName("");
    setNewProductSku("");
    setQuantity("1");
    setVendorReturnDetail("expired");
    setNote("");

    setTimeout(() => {
      scanInputRef.current?.focus();
      scanInputRef.current?.select();
    }, 30);
  }

  async function handleResolve() {
    if (!workspaceId) return;

    const trimmed = scanCode.trim();
    if (!trimmed) return;

    setResolvedProduct(null);
    setNotFoundCode(null);
    setSuccessMessage(null);

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
    setNewProductSku(makeSuggestedSku(trimmed));
  }

  async function handleSubmit(productId: string, name: string) {
    if (!workspaceId || !selectedLocationId) return;

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;

    await adjustInventory.mutateAsync({
      workspaceId,
      locationId: selectedLocationId,
      lines: [
        {
          productId,
          quantityDelta: -parsedQuantity,
          reasonCode: "vendor_return",
          note: `${vendorReturnDetail}${
            note.trim() ? ` — ${note.trim()}` : ""
          }`,
        },
      ],
    });

    setSuccessMessage(
      `Returned ${parsedQuantity} × ${name} from ${
        selectedLocation?.locationName ?? "location"
      }.`
    );

    resetForm();
  }

  async function handleCreateAndSubmit() {
    if (!workspaceId || !selectedLocationId) return;

    const parsedQuantity = Number(quantity);
    if (!newProductName.trim() || !newProductSku.trim()) return;

    const created = await quickCreateProduct.mutateAsync({
      workspaceId,
      name: newProductName.trim(),
      sku: newProductSku.trim(),
      primaryBarcode: notFoundCode || undefined,
    });

    await handleSubmit(created.product.id, created.product.name);
  }

  return (
    <OpsShell
      title="Vendor Return"
      subtitle="Remove inventory being returned to a vendor."
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-100 p-3">
              <RotateCcw size={20} />
            </div>

            <div>
              <div className="font-semibold">Scan product</div>
              <p className="text-sm text-slate-600">
                Resolve product or create it inline.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <input
              ref={scanInputRef}
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3"
              placeholder="Scan barcode"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleResolve();
              }}
            />

            <button
              onClick={handleResolve}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white"
            >
              Resolve
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              {locations.map((l) => (
                <option key={l.locationId} value={l.locationId}>
                  {l.locationName}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-xl border px-4 py-3"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Return detail</label>
            <select
              value={vendorReturnDetail}
              onChange={(e) => setVendorReturnDetail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-3"
            >
              {vendorReturnDetailOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <input
            className="mt-4 w-full rounded-xl border px-4 py-3"
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {resolvedProduct && (
            <div className="mt-4">
              <button
                onClick={() =>
                  handleSubmit(
                    resolvedProduct.productId,
                    resolvedProduct.name
                  )
                }
                className="rounded-xl bg-slate-900 px-4 py-2 text-white"
              >
                Submit return
              </button>
            </div>
          )}

          {notFoundCode && (
            <div className="mt-4 space-y-2">
              <input
                placeholder="Product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                placeholder="SKU"
                value={newProductSku}
                onChange={(e) => setNewProductSku(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <button
                onClick={handleCreateAndSubmit}
                className="rounded-xl bg-slate-900 px-4 py-2 text-white"
              >
                Create & return
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </OpsShell>
  );
}