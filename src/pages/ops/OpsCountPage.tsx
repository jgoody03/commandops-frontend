import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import CountEntryForm from "@/features/ops/components/CountEntryForm";
import ReceiveProductCard from "@/features/ops/components/ReceiveProductCard";
import ReceiveQuickCreatePanel from "@/features/ops/components/ReceiveQuickCreatePanel";
import ReceiveScanPanel from "@/features/ops/components/ReceiveScanPanel";
import {
  useCountInventory,
  useQuickCreateProduct,
  useResolveScanCode,
} from "@/features/ops/hooks";
import type {
  ReceiveFlowStatus,
  ReceiveLocationOption,
  ResolvedProductSummary,
} from "@/features/ops/types";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type QuickCreateFormState = {
  name: string;
  sku: string;
};

function buildSuggestedSku(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export default function OpsCountPage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const [searchParams] = useSearchParams();
const preferredLocationId = searchParams.get("locationId") || undefined;
  const {
    data: locationOptionsData,
    loading: isLocationsLoading,
    error: locationError,
  } = useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const quickCreateMutation = useQuickCreateProduct();
  const countInventoryMutation = useCountInventory();

  const [status, setStatus] = useState<ReceiveFlowStatus>("idle");
  const [scanCode, setScanCode] = useState("");
  const [resolvedProduct, setResolvedProduct] =
    useState<ResolvedProductSummary | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickCreateForm, setQuickCreateForm] = useState<QuickCreateFormState>({
    name: "",
    sku: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const locations: ReceiveLocationOption[] = useMemo(() => {
    const raw = locationOptionsData?.items ?? [];

    return raw.map((location) => ({
      id: location.locationId,
      name: location.locationName,
      code: location.locationCode,
    }));
  }, [locationOptionsData]);

  useEffect(() => {
    const productId = searchParams.get("productId");
    const name = searchParams.get("name");
    const sku = searchParams.get("sku");
    const barcode = searchParams.get("barcode");

    if (!productId || !name || !sku) {
      return;
    }

    setResolvedProduct({
      productId,
      name,
      sku,
      barcode: barcode || null,
      unitLabel: "each",
    });

    setScanCode(barcode || "");
    setShowQuickCreate(false);
    setSuccessMessage(null);
    setStatus("ready");
  }, [searchParams]);

  function resetFlow() {
    setStatus("idle");
    setScanCode("");
    setResolvedProduct(null);
    setShowQuickCreate(false);
    setQuickCreateForm({ name: "", sku: "" });
    setSuccessMessage(null);
    resolveScanMutation.reset();
    quickCreateMutation.reset();
    countInventoryMutation.reset();
  }

  async function handleResolve(code: string) {
    if (!workspaceId) return;

    setSuccessMessage(null);
    setScanCode(code);
    setResolvedProduct(null);
    setShowQuickCreate(false);
    resolveScanMutation.reset();
    quickCreateMutation.reset();
    countInventoryMutation.reset();
    setStatus("resolving");

    try {
      const result = await resolveScanMutation.mutateAsync({
        workspaceId,
        code,
      });

      if (result.resolutionStatus === "resolved") {
        setResolvedProduct({
          productId: result.productId,
          name: result.productName,
          sku: result.sku,
          barcode: code,
          unitLabel: "each",
        });
        setShowQuickCreate(false);
        setStatus("ready");
        return;
      }

      setQuickCreateForm({
        name: "",
        sku: buildSuggestedSku(code),
      });
      setShowQuickCreate(true);
      setStatus("resolved");
    } catch {
      setStatus("error");
    }
  }

  async function handleQuickCreateSubmit() {
    if (!workspaceId || !scanCode) return;
    if (!quickCreateForm.name.trim() || !quickCreateForm.sku.trim()) return;

    setSuccessMessage(null);
    quickCreateMutation.reset();
    setStatus("creating");

    try {
      const result = await quickCreateMutation.mutateAsync({
        workspaceId,
        name: quickCreateForm.name.trim(),
        sku: quickCreateForm.sku.trim(),
        primaryBarcode: scanCode,
      });

      setResolvedProduct({
        productId: result.product.id,
        name: result.product.name,
        sku: result.product.sku,
        barcode: result.product.primaryBarcode ?? scanCode,
        unitLabel: result.product.unit ?? "each",
      });

      setShowQuickCreate(false);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  async function handleCountSubmit(input: {
    locationId: string;
    countedQuantity: number;
    note: string;
  }) {
    if (!workspaceId || !resolvedProduct) return;

    if (!resolvedProduct.productId) {
      throw new Error("Resolved product is missing productId.");
    }

    setSuccessMessage(null);
    countInventoryMutation.reset();
    setStatus("posting");

    try {
      const result = await countInventoryMutation.mutateAsync({
        workspaceId,
        locationId: input.locationId,
        productId: resolvedProduct.productId,
        countedQuantity: input.countedQuantity,
        note: input.note || undefined,
        barcode: scanCode || undefined,
      });

      const deltaText =
        result.quantityDelta > 0
          ? `+${result.quantityDelta}`
          : String(result.quantityDelta);

      setSuccessMessage(
        result.quantityDelta === 0
          ? `Count verified for ${resolvedProduct.name}. Quantity remains ${result.countedQuantity}.`
          : `Count posted for ${resolvedProduct.name}. Previous: ${result.previousQuantity}, Counted: ${result.countedQuantity}, Delta: ${deltaText}.`
      );

      setStatus("success");
      setResolvedProduct(null);
      setShowQuickCreate(false);
      setQuickCreateForm({ name: "", sku: "" });
      setScanCode("");
    } catch {
      setStatus("error");
    }
  }

  function handleQuickCreateNameChange(value: string) {
    setQuickCreateForm((prev) => {
      const shouldUpdateSku =
        !prev.sku || prev.sku === buildSuggestedSku(prev.name);

      return {
        name: value,
        sku: shouldUpdateSku ? buildSuggestedSku(value) : prev.sku,
      };
    });
  }

  function handleQuickCreateSkuChange(value: string) {
    setQuickCreateForm((prev) => ({
      ...prev,
      sku: value,
    }));
  }

  const pageError =
    resolveScanMutation.error ||
    quickCreateMutation.error ||
    countInventoryMutation.error ||
    locationError;

  const pageErrorMessage =
    pageError instanceof Error
      ? pageError.message
      : pageError
        ? "Something went wrong."
        : null;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Ops · Count</h1>
          <p className="mt-1 text-sm text-gray-600">
            Scan an item, confirm the product, choose a location, and submit the
            actual counted quantity.
          </p>
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
            {successMessage}
          </div>
        ) : null}

        {pageErrorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {pageErrorMessage}
          </div>
        ) : null}

        <ReceiveScanPanel
          code={scanCode}
          onSubmit={handleResolve}
          isLoading={resolveScanMutation.isPending}
          disabled={
            quickCreateMutation.isPending || countInventoryMutation.isPending
          }
        />

        {resolvedProduct ? (
          <>
            <ReceiveProductCard
              product={resolvedProduct}
              scannedCode={scanCode}
            />

            <CountEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              
              onSubmit={handleCountSubmit}
              onReset={resetFlow}
              isSubmitting={
                countInventoryMutation.isPending || isLocationsLoading
              }
            />
          </>
        ) : null}

        {showQuickCreate ? (
          <ReceiveQuickCreatePanel
            scanCode={scanCode}
            name={quickCreateForm.name}
            sku={quickCreateForm.sku}
            isSubmitting={quickCreateMutation.isPending}
            onNameChange={handleQuickCreateNameChange}
            onSkuChange={handleQuickCreateSkuChange}
            onSubmit={handleQuickCreateSubmit}
            onCancel={resetFlow}
          />
        ) : null}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-600">
            Current state:{" "}
            <span className="font-medium text-gray-900">{status}</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}