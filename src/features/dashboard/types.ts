export type GetTodaySnapshotRequest = {
  workspaceId: string;
};

export type TodaySnapshot = {
  totalProducts: number;
  totalLocations: number;
  totalUnits: number;
  lowStockCount: number;
};