export type GetTodaySnapshotRequest = {
  workspaceId: string;
};

export type TodaySnapshot = {
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
  recentActivity: unknown[];
  generatedAtMs: number;
};