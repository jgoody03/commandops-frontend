import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";
import { useLowStockProducts } from "@/features/hub/hooks/useLowStockProducts";
import { useLocationSummaryList } from "@/features/locations/hooks/useLocationSummaryList";
import { useReplenishmentRecommendations } from "@/features/hub/hooks/useReplenishmentRecommendations";
import { useMoveSuggestions } from "@/features/ops/hooks/useMoveSuggestions";

import TodayStatsGrid from "@/features/hub/components/TodayStatsGrid";
import TodayActivityGrid from "@/features/hub/components/TodayActivityGrid";
import LowStockPanel from "@/features/hub/components/LowStockPanel";
import RecentActivityList from "@/features/activity/components/RecentActivityList";
import LocationSummaryPanel from "@/features/locations/components/LocationSummaryPanel";
import ReplenishmentPanel from "@/features/hub/components/ReplenishmentPanel";
import HubAssistantSummaryStrip from "@/features/hub/components/HubAssistantSummaryStrip";
import InsightsPanel, {
  type HubInsight,
} from "@/features/hub/components/InsightsPanel";

type TopMoveSuggestion = {
  product: {
    productId: string;
    sku: string;
    name: string;
    primaryBarcode?: string | null;
  };
  sourceLocationId: string;
  targetLocationId: string;
  reason: string | null;
};

export default function HubPage() {
  const { workspaceId } = useWorkspaceContext();

  const snapshot = useTodaySnapshot(workspaceId);
  const lowStock = useLowStockProducts({ initialLimit: 10 });
  const locations = useLocationSummaryList({ initialLimit: 8 });
  const replenishment = useReplenishmentRecommendations({ limit: 6 });
  const moveSuggestion = useMoveSuggestions();

  const [topMove, setTopMove] = useState<TopMoveSuggestion | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!workspaceId) {
        if (!cancelled) setTopMove(null);
        return;
      }

      const topItem = replenishment.data?.items?.[0];
      if (!topItem) {
        if (!cancelled) setTopMove(null);
        return;
      }

      try {
        const result = await moveSuggestion.mutateAsync({
          workspaceId,
          productId: topItem.productId,
        });

        if (cancelled) return;

        if (result.sourceLocationId && result.targetLocationId) {
          setTopMove({
            product: {
              productId: topItem.productId,
              sku: topItem.sku,
              name: topItem.name,
              primaryBarcode: topItem.primaryBarcode ?? null,
            },
            sourceLocationId: result.sourceLocationId,
            targetLocationId: result.targetLocationId,
            reason: result.reason ?? null,
          });
        } else {
          setTopMove(null);
        }
      } catch {
        if (!cancelled) setTopMove(null);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, replenishment.data, moveSuggestion]);

  const insights: HubInsight[] = useMemo(() => {
    const items: HubInsight[] = [];

    if (snapshot.data) {
      const totals = snapshot.data.totals;
      const activity = snapshot.data.activity;

      if (totals.outOfStockProducts > 0) {
        items.push({
          id: "out-of-stock",
          message: `You have ${totals.outOfStockProducts} out-of-stock product${
            totals.outOfStockProducts === 1 ? "" : "s"
          }. Replenishment is likely needed now.`,
          actionLabel: "Review out-of-stock products",
          actionHref: "/view/products?stockStatus=out",
          tone: "rose",
        });
      }

      if (totals.lowStockProducts > 0) {
        items.push({
          id: "low-stock",
          message: `${totals.lowStockProducts} product${
            totals.lowStockProducts === 1 ? " is" : "s are"
          } running low. This is a good time to review stock before it turns urgent.`,
          actionLabel: "Review low-stock products",
          actionHref: "/view/products?stockStatus=low",
          tone: "amber",
        });
      }

      if (activity.totalCount === 0) {
        items.push({
          id: "no-activity",
          message:
            "There has been no inventory activity today. If stock was moved or sold physically, consider running a count to verify balances.",
          actionLabel: "Open count workflow",
          actionHref: "/ops/count",
          tone: "blue",
        });
      }
    }

    if (topMove) {
      items.push({
        id: "move-recommendation",
        message: `Move ${topMove.product.name} to improve stock balance across locations.`,
        actionLabel: "Open move workflow",
        actionHref: `/ops/move?productId=${encodeURIComponent(
          topMove.product.productId
        )}&sku=${encodeURIComponent(
          topMove.product.sku
        )}&name=${encodeURIComponent(
          topMove.product.name
        )}&barcode=${encodeURIComponent(
          topMove.product.primaryBarcode ?? ""
        )}&sourceLocationId=${encodeURIComponent(
          topMove.sourceLocationId
        )}&targetLocationId=${encodeURIComponent(
          topMove.targetLocationId
        )}`,
        tone: "blue",
      });
    }

    if (!items.length) {
      items.push({
        id: "all-clear",
        message:
          "Inventory looks stable right now. No urgent stock issues are rising to the top, but you can still review products, locations, or recent activity.",
        actionLabel: "Open products",
        actionHref: "/view/products",
        tone: "emerald",
      });
    }

    return items;
  }, [snapshot.data, topMove]);

  return (
    <PageShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h1 className="text-2xl font-semibold text-slate-900">
    Store Command Center
  </h1>
  <p className="mt-2 text-sm text-slate-600">
    Monitor inventory, manage operations, and keep your store running smoothly.
  </p>
</div>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Hub
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Live operational view powered by your inventory backend.
          </p>
        </div>

        <InsightsPanel insights={insights} />

        <HubAssistantSummaryStrip
          snapshot={snapshot.data}
          replenishment={replenishment.data}
          lowStock={lowStock.data}
          locations={locations.data}
        />

        <TodayStatsGrid
          data={snapshot.data}
          loading={snapshot.loading}
          error={snapshot.error}
        />

        <TodayActivityGrid
          data={snapshot.data}
          loading={snapshot.loading}
          error={snapshot.error}
        />

        <ReplenishmentPanel
          data={replenishment.data}
          loading={replenishment.loading}
          error={replenishment.error}
        />

        <LowStockPanel
          data={lowStock.data}
          loading={lowStock.loading}
          loadingMore={lowStock.loadingMore}
          error={lowStock.error}
          query={lowStock.query}
          setQuery={lowStock.setQuery}
          outOnly={lowStock.outOnly}
          setOutOnly={lowStock.setOutOnly}
          loadMore={lowStock.loadMore}
          hasMore={lowStock.hasMore}
        />

        <LocationSummaryPanel
          data={locations.data}
          loading={locations.loading}
          loadingMore={locations.loadingMore}
          error={locations.error}
          query={locations.query}
          setQuery={locations.setQuery}
          loadMore={locations.loadMore}
          hasMore={locations.hasMore}
        />

        <RecentActivityList
          data={snapshot.data}
          loading={snapshot.loading}
          error={snapshot.error}
        />
      </div>
    </PageShell>
  );
}