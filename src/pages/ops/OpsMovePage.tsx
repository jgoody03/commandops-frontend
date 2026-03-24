import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import ReceiveProductCard from "@/features/ops/components/ReceiveProductCard";
import ReceiveQuickCreatePanel from "@/features/ops/components/ReceiveQuickCreatePanel";
import ReceiveScanPanel from "@/features/ops/components/ReceiveScanPanel";
import MoveEntryForm from "@/features/ops/components/MoveEntryForm";
import {
  useMoveInventory,
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

export default function OpsMovePage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();

  const {
    data: locationOptionsData,
    loading: isLocationsLoading,
    error: locationError,
  } = useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const quickCreateMutation = useQuickCreateProduct();
  const moveInventoryMutation = useMoveInventory();

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

  function resetFlow() {
    setStatus("idle");
    setScanCode("");
    setResolvedProduct(null);
    setShowQuickCreate(false);
    setQuickCreateForm({ name: "", sku: "" });
    setSuccessMessage(null);
    resolveScanMutation.reset();
    quickCreateMutation.reset();
    moveInventoryMutation.reset();
  }

async function handleResolve(code: string) {
  if (!workspaceId) return;

  setSuccessMessage(null);
  setScanCode(code);
  setResolvedProduct(null);
  setShowQuickCreate(false);
  resolveScanMutation.reset();
  quickCreateMutation.reset();
  moveInventoryMutation.reset();
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
  async function handleMoveSubmit(input: {
    sourceLocationId: string;
    targetLocationId: string;
    quantity: number;
    note: string;
  }) {
    if (!workspaceId || !resolvedProduct) return;

    if (!resolvedProduct.productId) {
      throw new Error("Resolved product is missing productId.");
    }

    setSuccessMessage(null);
    moveInventoryMutation.reset();
    setStatus("posting");

    try {
      await moveInventoryMutation.mutateAsync({
        workspaceId,
        sourceLocationId: input.sourceLocationId,
        targetLocationId: input.targetLocationId,
        note: input.note || undefined,
        lines: [
          {
            productId: resolvedProduct.productId,
            quantity: input.quantity,
            barcode: scanCode || undefined,
            note: input.note || undefined,
          },
        ],
      });

      setSuccessMessage(
        `Moved ${input.quantity} ${input.quantity === 1 ? "unit" : "units"} of ${resolvedProduct.name}.`
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
    moveInventoryMutation.error ||
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
          <h1 className="text-xl font-semibold text-gray-900">Ops · Move</h1>
          <p className="mt-1 text-sm text-gray-600">
            Scan an item, confirm the product, choose source and destination,
            then post the move.
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
            quickCreateMutation.isPending || moveInventoryMutation.isPending
          }
        />

        {resolvedProduct ? (
          <>
            <ReceiveProductCard
              product={resolvedProduct}
              scannedCode={scanCode}
            />

            <MoveEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              onSubmit={handleMoveSubmit}
              onReset={resetFlow}
              isSubmitting={
                moveInventoryMutation.isPending || isLocationsLoading
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