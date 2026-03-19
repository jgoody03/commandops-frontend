import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";
import { useLowStockProducts } from "@/features/hub/hooks/useLowStockProducts";
import { useLocationSummaryList } from "@/features/locations/hooks/useLocationSummaryList";

import TodayStatsGrid from "@/features/hub/components/TodayStatsGrid";
import TodayActivityGrid from "@/features/hub/components/TodayActivityGrid";
import LowStockPanel from "@/features/hub/components/LowStockPanel";
import RecentActivityList from "@/features/activity/components/RecentActivityList";
import LocationSummaryPanel from "@/features/locations/components/LocationSummaryPanel";

export default function HubPage() {
  const { workspaceId } = useWorkspaceContext();
  const snapshot = useTodaySnapshot(workspaceId);
  const lowStock = useLowStockProducts({ initialLimit: 10 });
  const locations = useLocationSummaryList({ initialLimit: 8 });

  return (
    <div className="space-y-6">
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
  );
}