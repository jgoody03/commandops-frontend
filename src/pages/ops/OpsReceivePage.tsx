import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OpsShell } from "@/components/layout/OpsShell";
import ReceiveEntryForm from "@/features/ops/components/ReceiveEntryForm";
import ReceiveProductCard from "@/features/ops/components/ReceiveProductCard";
import ReceiveQuickCreatePanel from "@/features/ops/components/ReceiveQuickCreatePanel";
import ReceiveScanPanel, {
  type ReceiveScanPanelHandle,
} from "@/features/ops/components/ReceiveScanPanel";
import {
  useQuickCreateProduct,
  useReceiveInventory,
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

export default function OpsReceivePage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const [searchParams] = useSearchParams();
  const scanPanelRef = useRef<ReceiveScanPanelHandle | null>(null);

  const preferredLocationId = searchParams.get("locationId") || undefined;

  const {
    data: locationOptionsData,
    loading: isLocationsLoading,
    error: locationError,
  } = useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const quickCreateMutation = useQuickCreateProduct();
  const receiveInventoryMutation = useReceiveInventory();

  const [status, setStatus] = useState<ReceiveFlowStatus>("idle");
  const [scanCode, setScanCode] = useState("");
  const [resolvedProduct, setResolvedProduct] =
    useState<ResolvedProductSummary | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickCreateForm, setQuickCreateForm] = useState<QuickCreateFormState>({
    name: "",
    sku: "",
  });
  const [suggestedLocationId, setSuggestedLocationId] =
    useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState(true);

  const locations: ReceiveLocationOption[] = useMemo(() => {
    return (locationOptionsData?.items ?? []).map((l) => ({
      id: l.locationId,
      name: l.locationName,
      code: l.locationCode,
    }));
  }, [locationOptionsData]);

  useEffect(() => {
    const productId = searchParams.get("productId");
    const name = searchParams.get("name");
    const sku = searchParams.get("sku");
    const barcode = searchParams.get("barcode");

    if (!productId || !name || !sku) return;

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
    setResolvedProduct(null);
    setScanCode("");
    setShowQuickCreate(false);
    setQuickCreateForm({ name: "", sku: "" });
    setSuggestedLocationId(undefined);
    setSuccessMessage(null);

    resolveScanMutation.reset();
    quickCreateMutation.reset();
    receiveInventoryMutation.reset();

    setTimeout(() => {
      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    }, 0);
  }

  async function handleResolve(code: string) {
    if (!workspaceId) return;

    setSuccessMessage(null);
    setScanCode(code);
    setResolvedProduct(null);
    setShowQuickCreate(false);
    setSuggestedLocationId(undefined);

    resolveScanMutation.reset();
    quickCreateMutation.reset();
    receiveInventoryMutation.reset();

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

        if (!preferredLocationId) {
          setSuggestedLocationId(defaultLocationId || locations[0]?.id);
        }

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

      if (!preferredLocationId) {
        setSuggestedLocationId(defaultLocationId || locations[0]?.id);
      }

      setShowQuickCreate(false);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  async function handleReceiveSubmit(input: {
    locationId: string;
    quantity: number;
  }) {
    if (!workspaceId || !resolvedProduct) return;

    receiveInventoryMutation.reset();
    setStatus("posting");

    try {
      await receiveInventoryMutation.mutateAsync({
        workspaceId,
        locationId: input.locationId,
        lines: [
          {
            productId: resolvedProduct.productId,
            quantity: input.quantity,
          },
        ],
      });

      setSuccessMessage(`Received ${input.quantity} of ${resolvedProduct.name}`);
      setTimeout(() => setSuccessMessage(null), 2500);

      setResolvedProduct(null);
      setScanCode("");
      setShowQuickCreate(false);
      setQuickCreateForm({ name: "", sku: "" });
      setStatus("success");

      setTimeout(() => {
        scanPanelRef.current?.clearInput();
        scanPanelRef.current?.focusInput();
      }, 0);
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
    receiveInventoryMutation.error ||
    locationError;

  const pageErrorMessage =
    pageError instanceof Error
      ? pageError.message
      : pageError
        ? "Something went wrong."
        : null;

  return (
    <OpsShell title="Receive">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {successMessage && (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg">
            {successMessage}
          </div>
        )}

        {pageErrorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {pageErrorMessage}
          </div>
        ) : null}

        <ReceiveScanPanel
          ref={scanPanelRef}
          code={scanCode}
          onSubmit={handleResolve}
          isLoading={resolveScanMutation.isPending}
          disabled={
            quickCreateMutation.isPending || receiveInventoryMutation.isPending
          }
          autoFocus
          repeatMode={repeatMode}
          onRepeatModeChange={setRepeatMode}
        />

        {resolvedProduct ? (
          <>
            <ReceiveProductCard
              product={resolvedProduct}
              scannedCode={scanCode}
            />

            <ReceiveEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              preferredLocationId={preferredLocationId ?? suggestedLocationId}
              onSubmit={handleReceiveSubmit}
              onReset={resetFlow}
              isSubmitting={
                receiveInventoryMutation.isPending || isLocationsLoading
              }
              repeatMode={repeatMode}
              onRepeatModeChange={setRepeatMode}
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
    </OpsShell>
  );
}