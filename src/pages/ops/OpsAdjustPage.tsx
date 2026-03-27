import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OpsShell } from "@/components/layout/OpsShell";
import AdjustEntryForm from "@/features/ops/components/AdjustEntryForm";
import ReceiveProductCard from "@/features/ops/components/ReceiveProductCard";
import ReceiveScanPanel, {
  type ReceiveScanPanelHandle,
} from "@/features/ops/components/ReceiveScanPanel";
import {
  useAdjustInventory,
  useResolveScanCode,
} from "@/features/ops/hooks";
import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import type {
  ReceiveFlowStatus,
  ReceiveLocationOption,
  ResolvedProductSummary,
} from "@/features/ops/types";

export default function OpsAdjustPage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const [searchParams] = useSearchParams();
  const scanPanelRef = useRef<ReceiveScanPanelHandle | null>(null);

  const preferredLocationId = searchParams.get("locationId") || undefined;

  const { data: locationOptionsData, loading: isLocationsLoading } =
    useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const adjustInventoryMutation = useAdjustInventory();

  const [status, setStatus] = useState<ReceiveFlowStatus>("idle");
  const [resolvedProduct, setResolvedProduct] =
    useState<ResolvedProductSummary | null>(null);
  const [scanCode, setScanCode] = useState("");
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

  function resetFlow() {
    setResolvedProduct(null);
    setScanCode("");
    setSuggestedLocationId(undefined);
    setSuccessMessage(null);
    setStatus("idle");

    resolveScanMutation.reset();
    adjustInventoryMutation.reset();

    setTimeout(() => {
      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    }, 0);
  }

  async function handleResolve(code: string) {
    if (!workspaceId) return;

    setSuccessMessage(null);
    setStatus("resolving");

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

      setScanCode(code);

      if (!preferredLocationId) {
        setSuggestedLocationId(defaultLocationId || locations[0]?.id);
      }

      setStatus("ready");
    } else {
      setStatus("error");
    }
  }

  async function handleAdjustSubmit(input: {
    locationId: string;
    quantity: number;
    note: string;
  }) {
    if (!workspaceId || !resolvedProduct) return;

    setStatus("posting");

    await adjustInventoryMutation.mutateAsync({
      workspaceId,
      locationId: input.locationId,
      note: input.note || undefined,
      lines: [
        {
          productId: resolvedProduct.productId,
          quantityDelta: input.quantity,
          barcode: scanCode || undefined,
          note: input.note || undefined,
        },
      ],
    });

    setSuccessMessage(`Adjusted ${resolvedProduct.name}`);
    setTimeout(() => setSuccessMessage(null), 2000);

    setResolvedProduct(null);
    setScanCode("");
    setStatus("success");

    setTimeout(() => {
      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    }, 0);
  }

  return (
    <OpsShell title="Adjust">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {successMessage ? (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white shadow-lg transition-opacity duration-300">
            {successMessage}
          </div>
        ) : null}

        <ReceiveScanPanel
          ref={scanPanelRef}
          code={scanCode}
          onSubmit={handleResolve}
          isLoading={resolveScanMutation.isPending}
          disabled={adjustInventoryMutation.isPending}
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

            <AdjustEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              preferredLocationId={preferredLocationId ?? suggestedLocationId}
              onSubmit={handleAdjustSubmit}
              onReset={resetFlow}
              isSubmitting={
                adjustInventoryMutation.isPending || isLocationsLoading
              }
              repeatMode={repeatMode}
              onRepeatModeChange={setRepeatMode}
            />
          </>
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