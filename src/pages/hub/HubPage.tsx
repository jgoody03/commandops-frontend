import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  PackagePlus,
  ScanLine,
  TriangleAlert,
  Warehouse,
} from "lucide-react";

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

function ActionCard({
  title,
  description,
  to,
  cta,
  icon: Icon,
  featured = false,
}: {
  title: string;
  description: string;
  to: string;
  cta: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  featured?: boolean;
}) {
  return (
    <Link
      to={to}
      className={[
        "rounded-2xl border p-5 shadow-sm transition",
        featured
          ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "rounded-2xl p-3",
            featured ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          <Icon size={20} />
        </div>

        <ArrowRight
          size={18}
          className={featured ? "mt-1 text-slate-300" : "mt-1 text-slate-400"}
        />
      </div>

      <div className="mt-4 font-semibold">{title}</div>
      <p
        className={[
          "mt-2 text-sm leading-6",
          featured ? "text-slate-200" : "text-slate-600",
        ].join(" ")}
      >
        {description}
      </p>

      <div
        className={[
          "mt-4 text-sm font-medium",
          featured ? "text-white" : "text-slate-900",
        ].join(" ")}
      >
        {cta}
      </div>
    </Link>
  );
}

function AttentionPanel({
  totalProducts,
  totalUnits,
  lowStockProducts,
  outOfStockProducts,
  activityCount,
}: {
  totalProducts: number;
  totalUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  activityCount: number;
}) {
  let title = "Your store is ready to load";
  let description =
    "Start by scanning products or receiving your first stock so StorePilot can build a live view of your inventory.";

  if (lowStockProducts > 0 || outOfStockProducts > 0) {
    title = "What needs attention";
    description = `${lowStockProducts} low-stock product${
      lowStockProducts === 1 ? "" : "s"
    } and ${outOfStockProducts} out-of-stock product${
      outOfStockProducts === 1 ? "" : "s"
    } need review.`;
  } else if (totalProducts === 0 && totalUnits === 0) {
    title = "Your store is ready to load";
    description =
      "Start by scanning products or receiving your first stock so StorePilot can build a live view of your inventory.";
  } else if (totalProducts > 0 && activityCount <= 2) {
    title = "You’re building live inventory";
    description =
      "Your store is starting to take shape. Keep scanning products or receiving stock to improve visibility across locations.";
  } else {
    title = "Inventory looks stable";
    description =
      "Your store has live inventory in the system and no urgent stock issues are rising to the top right now.";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
          <TriangleAlert size={20} />
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Store status
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>

          {(totalProducts === 0 && totalUnits === 0) || (totalProducts > 0 && activityCount <= 2) ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/ops/scan-load"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Scan Load
              </Link>

              <Link
                to="/ops/receive"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Receive inventory
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AhaPanel({
  totalProducts,
  totalUnits,
  activityCount,
}: {
  totalProducts: number;
  totalUnits: number;
  activityCount: number;
}) {
  if (totalProducts === 0 && totalUnits === 0) {
    return null;
  }

  if (activityCount <= 2) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Inventory is going live
        </div>
        <p className="mt-2 text-sm leading-7 text-emerald-900">
          You’ve started building real inventory into StorePilot. Keep scanning
          or receiving stock to improve visibility across your store.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
        Inventory is live
      </div>
      <p className="mt-2 text-sm leading-7 text-emerald-900">
        StorePilot is now tracking real products, stock movement, and location
        activity across your workspace.
      </p>
    </div>
  );
}

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
  }, 
  
  [workspaceId, replenishment.data, moveSuggestion]);

  const totals = snapshot.data?.totals;
  const activity = snapshot.data?.activity;
  const activityCount = activity?.totalCount ?? 0;

  const totalProducts = totals?.totalProducts ?? 0;
  const totalLocations = totals?.totalLocations ?? 0;
  const totalUnits = totals?.totalUnits ?? 0;
  const lowStockProducts = totals?.lowStockProducts ?? 0;
  const outOfStockProducts = totals?.outOfStockProducts ?? 0;

  const nextActions = useMemo(() => {
    if (lowStockProducts > 0 || outOfStockProducts > 0) {
      return [
        {
          to: "/view/products?stockStatus=low",
          title: "Review low stock",
          description:
            "See which products need replenishment before issues become more urgent.",
          cta: "Open low-stock view",
          icon: TriangleAlert,
          featured: true,
        },
        {
          to: "/ops/receive",
          title: "Receive new stock",
          description:
            "Bring shipments into the system quickly and update quantities fast.",
          cta: "Receive inventory",
          icon: PackagePlus,
        },
        {
          to: "/ops/scan-load",
          title: "Load your inventory",
          description:
            "Scan products and continue building live stock into the system.",
          cta: "Start scanning",
          icon: ScanLine,
        },
      ];
    }

    if (totalProducts === 0 && totalUnits === 0) {
      return [
        {
          to: "/ops/scan-load",
          title: "Load your inventory",
          description:
            "Start scanning products to build your live inventory and bring your workspace to life.",
          cta: "Start scanning",
          icon: ScanLine,
          featured: true,
        },
        {
          to: "/ops/receive",
          title: "Receive new stock",
          description:
            "Bring your first products into the system from a shipment or opening stock load.",
          cta: "Receive inventory",
          icon: PackagePlus,
        },
        {
          to: "/view/products",
          title: "Review products",
          description:
            "Inspect the product view as your inventory begins to take shape.",
          cta: "Open product view",
          icon: Boxes,
        },
      ];
    }

    if (activityCount <= 2) {
      return [
        {
          to: "/ops/scan-load",
          title: "Keep loading inventory",
          description:
            "You’ve started building inventory. Keep going to improve visibility across your store.",
          cta: "Continue scanning",
          icon: ScanLine,
          featured: true,
        },
        {
          to: "/ops/receive",
          title: "Receive new stock",
          description:
            "Bring more products into the system and strengthen your live counts.",
          cta: "Receive inventory",
          icon: PackagePlus,
        },
        {
          to: "/view/products",
          title: "Review products",
          description:
            "Check stock visibility and confirm your products are showing up as expected.",
          cta: "Open product view",
          icon: Boxes,
        },
      ];
    }

    return [
      {
        to: "/ops/receive",
        title: "Receive new stock",
        description:
          "Bring shipments into the system and keep inventory current.",
        cta: "Receive inventory",
        icon: PackagePlus,
        featured: true,
      },
      {
        to: "/ops/scan-load",
        title: "Scan load",
        description:
          "Continue adding products and stock with a fast scan-based workflow.",
        cta: "Start scanning",
        icon: ScanLine,
      },
      {
        to: "/view/products",
        title: "Review products",
        description:
          "Inspect product visibility, stock status, and what needs attention.",
        cta: "Open product view",
        icon: Boxes,
      },
    ];
  }, [lowStockProducts, outOfStockProducts, totalProducts, totalUnits, activityCount]);

  const hasInventory =
    totalProducts > 0 || totalLocations > 0 || totalUnits > 0;

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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Store Command Center
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Monitor inventory health and guide daily work.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Use Hub to keep an eye on stock, see what needs attention, and
                jump into the next best action for your store.
              </p>

{!snapshot.loading ? (
  <p className="mt-4 text-sm text-slate-500">
    {lowStockProducts > 0 || outOfStockProducts > 0
      ? `${lowStockProducts} low-stock product${
          lowStockProducts === 1 ? "" : "s"
        } and ${outOfStockProducts} out-of-stock product${
          outOfStockProducts === 1 ? "" : "s"
        } need review.`
      : totalProducts === 0 && totalUnits === 0
        ? "Your workspace is ready. Start loading inventory to bring your store to life."
        : totalProducts > 0 && (activity?.totalCount ?? 0) <= 2
          ? "You’ve started building inventory. Keep going to improve visibility across your store."
          : `${totalProducts} products across ${totalLocations} location${
              totalLocations === 1 ? "" : "s"
            } with ${totalUnits} unit${
              totalUnits === 1 ? "" : "s"
            } tracked.`}
  </p>
) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/ops/scan-load"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Scan Load
              </Link>

              <Link
                to="/ops/receive"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Receive inventory
              </Link>
            </div>
          </div>
        </div>

<div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
  <AttentionPanel
    totalProducts={totalProducts}
    totalUnits={totalUnits}
    lowStockProducts={lowStockProducts}
    outOfStockProducts={outOfStockProducts}
    activityCount={activity?.totalCount ?? 0}
  />
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
      Next actions
    </div>
        <AhaPanel
          totalProducts={totalProducts}
          totalUnits={totalUnits}
          activityCount={activityCount}
        />
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {nextActions.map((action) => (
        <ActionCard
          key={action.title}
          to={action.to}
          title={action.title}
          description={action.description}
          cta={action.cta}
          icon={action.icon}
          featured={action.featured}
        />
      ))}
    </div>
  </div>
</div>

        <InsightsPanel insights={insights} />

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