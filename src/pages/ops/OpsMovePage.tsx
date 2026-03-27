import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OpsShell } from "@/components/layout/OpsShell";
import ReceiveProductCard from "@/features/ops/components/ReceiveProductCard";
import ReceiveQuickCreatePanel from "@/features/ops/components/ReceiveQuickCreatePanel";
import ReceiveScanPanel, {
  type ReceiveScanPanelHandle,
} from "@/features/ops/components/ReceiveScanPanel";
import MoveEntryForm from "@/features/ops/components/MoveEntryForm";

import {
  useMoveInventory,
  useQuickCreateProduct,
  useResolveScanCode,
} from "@/features/ops/hooks";

import { useMoveSuggestions } from "@/features/ops/hooks/useMoveSuggestions";

import type {
  ReceiveFlowStatus,
  ReceiveLocationOption,
  ResolvedProductSummary,
} from "@/features/ops/types";

import { useLocationOptions } from "@/features/locations/hooks/useLocationOptions";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

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
  const [searchParams] = useSearchParams();
  const scanPanelRef = useRef<ReceiveScanPanelHandle | null>(null);

  const preferredSourceLocationId =
    searchParams.get("sourceLocationId") ||
    searchParams.get("locationId") ||
    undefined;

  const preferredTargetLocationId =
    searchParams.get("targetLocationId") || undefined;

  const {
    data: locationOptionsData,
    loading: isLocationsLoading,
    error: locationError,
  } = useLocationOptions();

  const resolveScanMutation = useResolveScanCode();
  const quickCreateMutation = useQuickCreateProduct();
  const moveInventoryMutation = useMoveInventory();
  const moveSuggestions = useMoveSuggestions();

  const [status, setStatus] = useState<ReceiveFlowStatus>("idle");
  const [scanCode, setScanCode] = useState("");
  const [resolvedProduct, setResolvedProduct] =
    useState<ResolvedProductSummary | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const [quickCreateForm, setQuickCreateForm] = useState({
    name: "",
    sku: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState(true);

  // 🔥 suggestions state
  const [suggestedSourceId, setSuggestedSourceId] = useState<string | undefined>();
  const [suggestedTargetId, setSuggestedTargetId] = useState<string | undefined>();
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);

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

    if (!productId || !name || !sku) return;

    setResolvedProduct({
      productId,
      name,
      sku,
      barcode: barcode || null,
      unitLabel: "each",
    });

    setScanCode(barcode || "");
    setStatus("ready");
  }, [searchParams]);

  function resetFlow() {
    setStatus("idle");
    setScanCode("");
    setResolvedProduct(null);
    setShowQuickCreate(false);
    setQuickCreateForm({ name: "", sku: "" });
    setSuccessMessage(null);

    setSuggestedSourceId(undefined);
    setSuggestedTargetId(undefined);
    setSuggestionReason(null);

    resolveScanMutation.reset();
    quickCreateMutation.reset();
    moveInventoryMutation.reset();

    setTimeout(() => {
      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    }, 0);
  }

  async function handleResolve(code: string) {
    if (!workspaceId) return;

    setScanCode(code);
    setStatus("resolving");
    setResolvedProduct(null);
    setShowQuickCreate(false);

    try {
      const result = await resolveScanMutation.mutateAsync({
        workspaceId,
        code,
      });

      if (result.resolutionStatus === "resolved") {
        const productId = result.productId;

        setResolvedProduct({
          productId,
          name: result.productName,
          sku: result.sku,
          barcode: code,
          unitLabel: "each",
        });

        setStatus("ready");

        // 🔥 fetch suggestions
        try {
          const suggestion = await moveSuggestions.mutateAsync({
            workspaceId,
            productId,
          });

          if (!preferredSourceLocationId) {
            setSuggestedSourceId(suggestion.sourceLocationId ?? undefined);
          }

          if (!preferredTargetLocationId) {
            setSuggestedTargetId(suggestion.targetLocationId ?? undefined);
          }

          setSuggestionReason(suggestion.reason ?? null);
        } catch {
          // silent fail
        }

        return;
      }

      setShowQuickCreate(true);
      setQuickCreateForm({
        name: "",
        sku: buildSuggestedSku(code),
      });

      setStatus("resolved");
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
          },
        ],
      });

      setSuccessMessage(
        `Moved ${input.quantity} of ${resolvedProduct.name}`
      );

      setTimeout(() => setSuccessMessage(null), 2500);

      setResolvedProduct(null);
      setScanCode("");
      setStatus("success");

      scanPanelRef.current?.clearInput();
      scanPanelRef.current?.focusInput();
    } catch {
      setStatus("error");
    }
  }

  return (
    <OpsShell title="Move" subtitle="Move inventory between locations">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">

        {successMessage && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
            {successMessage}
          </div>
        )}

        <ReceiveScanPanel
          ref={scanPanelRef}
          code={scanCode}
          onSubmit={handleResolve}
          isLoading={resolveScanMutation.isPending}
          disabled={moveInventoryMutation.isPending}
          autoFocus
          repeatMode={repeatMode}
          onRepeatModeChange={setRepeatMode}
        />

        {resolvedProduct && (
          <>
            <ReceiveProductCard
              product={resolvedProduct}
              scannedCode={scanCode}
            />

            {suggestionReason && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {suggestionReason}
              </div>
            )}

            <MoveEntryForm
              product={resolvedProduct}
              locations={locations}
              defaultLocationId={defaultLocationId}
              preferredSourceLocationId={
                preferredSourceLocationId ?? suggestedSourceId
              }
              preferredTargetLocationId={
                preferredTargetLocationId ?? suggestedTargetId
              }
              onSubmit={handleMoveSubmit}
              onReset={resetFlow}
              isSubmitting={moveInventoryMutation.isPending || isLocationsLoading}
              repeatMode={repeatMode}
              onRepeatModeChange={setRepeatMode}
            />
          </>
        )}
      </div>
    </OpsShell>
  );
}