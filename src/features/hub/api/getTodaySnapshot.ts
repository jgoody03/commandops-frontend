import { createCallable } from "@/lib/functions";

export type GetTodaySnapshotInput = {
  workspaceId: string;
};

export type TodaySnapshotRecentActivityItem = {
  id: string;
  workspaceId: string;
  type: string;
  productId: string | null;
  locationId: string | null;
  title: string;
  subtitle: string | null;
  actorUserId: string | null;
  createdAtMs: number | null;
};

export type GetTodaySnapshotOutput = {
  totals: {
    totalProducts: number;
    totalLocations: number;
    totalUnits: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
  activity: {
    receiveCount: number;
    moveCount: number;
    adjustCount: number;
    scanCount: number;
    quickCreateCount: number;
    saleCount: number;
    totalCount: number;
  };
  recentActivity: TodaySnapshotRecentActivityItem[];
  generatedAtMs: number;
};

export const getTodaySnapshot = createCallable<
  GetTodaySnapshotInput,
  GetTodaySnapshotOutput
>("getTodaySnapshot");