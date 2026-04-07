import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { useTodaySnapshot } from "@/features/hub/hooks/useTodaySnapshot";
import { useLowStockProducts } from "@/features/hub/hooks/useLowStockProducts";
import { useLocationSummaryList } from "@/features/locations/hooks/useLocationSummaryList";
import { useReplenishmentRecommendations } from "@/features/hub/hooks/useReplenishmentRecommendations";

import DailyBriefStrip from "@/features/hub/components/DailyBriefStrip";
import SalesSparklineCard from "@/features/hub/components/SalesSparklineCard";
import TodayStatsGrid from "@/features/hub/components/TodayStatsGrid";
import TodayActivityGrid from "@/features/hub/components/TodayActivityGrid";
import LowStockPanel from "@/features/hub/components/LowStockPanel";
import RecentActivityList from "@/features/activity/components/RecentActivityList";
import LocationSummaryPanel from "@/features/locations/components/LocationSummaryPanel";
import ReplenishmentPanel from "@/features/hub/components/ReplenishmentPanel";
import InsightsPanel, {
  type HubInsight,
} from "@/features/hub/components/InsightsPanel";

export default function HubPage() {
  const { workspaceId } = useWorkspaceContext();

  const snapshot = useTodaySnapshot(workspaceId);
  const lowStock = useLowStockProducts({ initialLimit: 10 });
  const locations = useLocationSummaryList({ initialLimit: 8 });
  const replenishment = useReplenishmentRecommendations({ limit: 6 });

  const [visibleRecentCount, setVisibleRecentCount] = useState(5);

  const totals = snapshot.data?.totals;
  const sales = snapshot.data?.sales;

  const totalProducts = totals?.totalProducts ?? 0;
  const totalLocations = totals?.totalLocations ?? 0;
  const totalUnits = totals?.totalUnits ?? 0;
  const lowStockProducts = totals?.lowStockProducts ?? 0;
  const outOfStockProducts = totals?.outOfStockProducts ?? 0;

  const salesTodayRevenue = sales?.salesTodayRevenue ?? 0;
  const salesTodayCount = sales?.salesTodayCount ?? 0;
  const unitsSoldToday = sales?.unitsSoldToday ?? 0;

  const insights: HubInsight[] = useMemo(() => {
    if (!snapshot.data) return [];

    const totals = snapshot.data.totals;
    const sales = snapshot.data.sales ?? {
      salesTodayCount: 0,
      unitsSoldToday: 0,
      salesTodayRevenue: 0,
    };

    const list: HubInsight[] = [];

    if (totals.outOfStockProducts > 0) {
      list.push({
        id: "out-of-stock",
        message: `${totals.outOfStockProducts} product${
          totals.outOfStockProducts === 1 ? "" : "s"
        } are out of stock.`,
        actionLabel: "Review products",
        actionHref: "/view/products?stockStatus=out",
        tone: "rose",
      });
    }

    if (totals.lowStockProducts > 0) {
      list.push({
        id: "low-stock",
        message: `${totals.lowStockProducts} product${
          totals.lowStockProducts === 1 ? "" : "s"
        } are running low.`,
        actionLabel: "View low stock",
        actionHref: "/view/products?stockStatus=low",
        tone: "amber",
      });
    }

    if (sales.salesTodayCount > 0) {
      list.push({
        id: "sales-active",
        message: `Sales are active — ${sales.unitsSoldToday} units sold today.`,
        actionLabel: "Open products",
        actionHref: "/view/products",
        tone: "emerald",
      });
    }

    if (!list.length) {
      list.push({
        id: "stable",
        message:
          "Inventory looks stable right now. No urgent store issues are rising to the top.",
        actionLabel: "Open products",
        actionHref: "/view/products",
        tone: "blue",
      });
    }

    return list;
  }, [snapshot.data]);

  const recentActivityData = useMemo(() => {
    if (!snapshot.data) return null;

    return {
      ...snapshot.data,
      recentActivity: snapshot.data.recentActivity.slice(0, visibleRecentCount),
    };
  }, [snapshot.data, visibleRecentCount]);

  const totalRecentItems = snapshot.data?.recentActivity?.length ?? 0;
  const hasMoreRecent = visibleRecentCount < totalRecentItems;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Store Command Center
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Run your store from one calm, live view.
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Monitor inventory health, sales activity, and the next best
                action without digging through busy screens.
              </p>

              {(salesTodayCount > 0 || totalProducts > 0) && (
                <div className="mt-4 text-sm font-medium text-slate-900">
                  {salesTodayCount > 0
                    ? `$${salesTodayRevenue.toFixed(
                        2
                      )} in sales • ${unitsSoldToday} units • ${salesTodayCount} transactions`
                    : `${totalProducts} products across ${totalLocations} locations • ${totalUnits} units tracked`}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/ops/scan-load"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <ScanLine size={16} />
                Scan Load
              </Link>

              <Link
                to="/ops/receive"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Receive
              </Link>
            </div>
          </div>
        </section>

        <DailyBriefStrip
          data={snapshot.data}
          loading={snapshot.loading}
          error={snapshot.error}
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <InsightsPanel insights={insights} />
          <SalesSparklineCard
            data={snapshot.data}
            loading={snapshot.loading}
            error={snapshot.error}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
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
        </div>

        <section className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Operations
            </div>
            <div className="mt-1 text-sm text-slate-600">
              The items and workflows most likely to need attention next.
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
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
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
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

          <div className="space-y-4">
            <RecentActivityList
              data={recentActivityData}
              loading={snapshot.loading}
              error={snapshot.error}
            />

            {hasMoreRecent ? (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setVisibleRecentCount((count) => count + 5)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Load 5 more
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}