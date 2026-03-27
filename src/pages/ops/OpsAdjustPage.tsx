import { useEffect, useMemo, useRef, useState } from "react";
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

export default function OpsAdjustPage() {
  const { workspaceId, defaultLocationId } = useWorkspaceContext();
  const [searchParams] = useSearchParams();
  const scanPanelRef = useRef<ReceiveScanPanelHandle | null>(null);

  const preferredLocationId = searchParams.get("locationId") || undefined;

  const { data: locationOptionsData } = useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const adjustInventoryMutation = useAdjustInventory();

  const [resolvedProduct, setResolvedProduct] = useState<any>(null);
  const [scanCode, setScanCode] = useState("");

  const [suggestedLocationId, setSuggestedLocationId] =
    useState<string | undefined>();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState(true);

  const locations = useMemo(() => {
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

    setTimeout(() => {
      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    }, 0);
  }

  async function handleResolve(code: string) {
    if (!workspaceId) return;

    const result = await resolveScanMutation.mutateAsync({
      workspaceId,
      code,
    });

    if (result.resolutionStatus === "resolved") {
      setResolvedProduct({
        productId: result.productId,
        name: result.productName,
        sku: result.sku,
      });

      // 🔥 Suggest location
      if (!preferredLocationId) {
        setSuggestedLocationId(
          defaultLocationId || locations[0]?.id
        );
      }
    }
  }

  async function handleAdjustSubmit(input: any) {
    await adjustInventoryMutation.mutateAsync({
      workspaceId,
      locationId: input.locationId,
      lines: [
        {
          productId: resolvedProduct.productId,
          quantityDelta: input.quantity,
        },
      ],
    });

    setSuccessMessage(`Adjusted ${resolvedProduct.name}`);
    setTimeout(() => setSuccessMessage(null), 2500);

    resetFlow();
  }

  return (
    <OpsShell title="Adjust">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {successMessage && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg">
            {successMessage}
          </div>
        )}

        <ReceiveScanPanel
          ref={scanPanelRef}
          code={scanCode}
          onSubmit={handleResolve}
          autoFocus
          repeatMode={repeatMode}
          onRepeatModeChange={setRepeatMode}
        />

        {resolvedProduct && (
          <>
            <ReceiveProductCard product={resolvedProduct} scannedCode={scanCode} />

            <AdjustEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              preferredLocationId={
                preferredLocationId ?? suggestedLocationId
              }
              onSubmit={handleAdjustSubmit}
              onReset={resetFlow}
              isSubmitting={adjustInventoryMutation.isPending}
              repeatMode={repeatMode}
              onRepeatModeChange={setRepeatMode}
            />
          </>
        )}
      </div>
    </OpsShell>
  );
}