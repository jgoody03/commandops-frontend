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
  const sales = snapshot.data?.sales;


  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
<OwnerSummaryHero
  lowStockCount={totals?.lowStockProducts ?? 0}
  outOfStockCount={totals?.outOfStockProducts ?? 0}
  replenishmentCount={replenishment.data?.items?.length ?? 0}
  salesTodayRevenue={snapshot.data?.sales?.salesTodayRevenue ?? 0}
  salesTodayCount={snapshot.data?.sales?.salesTodayCount ?? 0}
  unitsSoldToday={snapshot.data?.sales?.unitsSoldToday ?? 0}
/>
<div className="grid gap-4 md:grid-cols-3">
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      Sales Today
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">
      ${(sales?.salesTodayRevenue ?? 0).toFixed(2)}
    </div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      Units Sold
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">
      {sales?.unitsSoldToday ?? 0}
    </div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      Transactions
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">
      {sales?.salesTodayCount ?? 0}
    </div>
  </div>
</div>
<OwnerHealthCards
  totalProducts={totals?.totalProducts ?? 0}
  totalLocations={totals?.totalLocations ?? 0}
  lowStockCount={totals?.lowStockProducts ?? 0}
  outOfStockCount={totals?.outOfStockProducts ?? 0}
  totalUnits={totals?.totalUnits ?? 0}
  salesTodayRevenue={snapshot.data?.sales?.salesTodayRevenue ?? 0}
  salesTodayCount={snapshot.data?.sales?.salesTodayCount ?? 0}
/>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <OwnerAttentionPanel replenishment={replenishment.data} />
          <OwnerRecentActivityPanel snapshot={snapshot.data} />
        </div>
      </div>
    </PageShell>
  );
}