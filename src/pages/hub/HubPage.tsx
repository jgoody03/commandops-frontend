import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";

import TodayStatsGrid from "@/features/hub/components/TodayStatsGrid";
import TodayActivityGrid from "@/features/hub/components/TodayActivityGrid";
import RecentActivityList from "@/features/activity/components/RecentActivityList";

export default function HubPage() {
  const { workspaceId } = useWorkspaceContext();
  const snapshot = useTodaySnapshot(workspaceId);

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

      <RecentActivityList
        data={snapshot.data}
        loading={snapshot.loading}
        error={snapshot.error}
      />
    </div>
  );
}