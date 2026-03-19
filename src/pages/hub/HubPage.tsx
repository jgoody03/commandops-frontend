import { PageShell } from "@/components/layout/PageShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";
import { useLowStockProducts } from "@/features/hub/hooks/useLowStockProducts";
import { useLocationSummaryList } from "@/features/locations/hooks/useLocationSummaryList";
import { useReplenishmentRecommendations } from "@/features/hub/hooks/useReplenishmentRecommendations";

import TodayStatsGrid from "@/features/hub/components/TodayStatsGrid";
import TodayActivityGrid from "@/features/hub/components/TodayActivityGrid";
import LowStockPanel from "@/features/hub/components/LowStockPanel";
import RecentActivityList from "@/features/activity/components/RecentActivityList";
import LocationSummaryPanel from "@/features/locations/components/LocationSummaryPanel";
import ReplenishmentPanel from "@/features/hub/components/ReplenishmentPanel";

export default function HubPage() {
  const { workspaceId } = useWorkspaceContext();
  const snapshot = useTodaySnapshot(workspaceId);
  const lowStock = useLowStockProducts({ initialLimit: 10 });
  const locations = useLocationSummaryList({ initialLimit: 8 });
  const replenishment = useReplenishmentRecommendations({ limit: 6 });
console.log("workspaceId", workspaceId);
console.log("snapshot", snapshot);
console.log("lowStock", lowStock);
console.log("locations", locations);
console.log("replenishment", replenishment);
  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Hub
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Live operational view powered by CommandOps backend.
          </p>
        </div>

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