import { PageShell } from "@/components/layout/PageShell";
import OwnerAttentionPanel from "@/features/owner/components/OwnerAttentionPanel";
import OwnerHealthCards from "@/features/owner/components/OwnerHealthCards";
import OwnerRecentActivityPanel from "@/features/owner/components/OwnerRecentActivityPanel";
import OwnerSummaryHero from "@/features/owner/components/OwnerSummaryHero";
import { useReplenishmentRecommendations } from "@/features/hub/hooks/useReplenishmentRecommendations";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export default function OwnerHomePage() {
  const { workspaceId } = useWorkspaceContext();
  const snapshot = useTodaySnapshot(workspaceId);
  const replenishment = useReplenishmentRecommendations({ limit: 6 });

  const totals = snapshot.data?.totals;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <OwnerSummaryHero
          lowStockCount={totals?.lowStockProducts ?? 0}
          outOfStockCount={totals?.outOfStockProducts ?? 0}
          replenishmentCount={replenishment.data?.items?.length ?? 0}
        />

        <OwnerHealthCards
          totalProducts={totals?.totalProducts ?? 0}
          totalLocations={totals?.totalLocations ?? 0}
          lowStockCount={totals?.lowStockProducts ?? 0}
          outOfStockCount={totals?.outOfStockProducts ?? 0}
          totalUnits={totals?.totalUnits ?? 0}
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <OwnerAttentionPanel replenishment={replenishment.data} />
          <OwnerRecentActivityPanel snapshot={snapshot.data} />
        </div>
      </div>
    </PageShell>
  );
}