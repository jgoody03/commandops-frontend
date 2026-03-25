export type SummaryListCursor = {
  updatedAtMs: number;
  docId: string;
};

export type ProductStockStatus = "ok" | "low" | "out";

export type ProductSummaryListItem = {
  id: string;
  workspaceId: string;
  productId: string;
  sku: string;
  name: string;
  primaryBarcode?: string | null;
  unit?: string | null;
  totalOnHand: number;
  totalAvailable: number;
  totalLocations: number;
  locationsInStock: number;
  locationsOutOfStock: number;
  locationsLowStock: number;
  isOutOfStockEverywhere: boolean;
  isLowStockAnywhere: boolean;
  stockStatus: ProductStockStatus;
  lastTransactionAtMs: number | null;
  updatedAtMs: number | null;
};

export type GetProductSummaryListRequest = {
  workspaceId: string;
  limit?: number;
  cursor?: SummaryListCursor | null;
  query?: string;
  stockStatus?: ProductStockStatus;
};

export type GetProductSummaryListResponse = {
  items: ProductSummaryListItem[];
  nextCursor: SummaryListCursor | null;
};

export type GetLocationInventoryCursor = {
  updatedAtMs: number;
  docId: string;
};

export type LocationInventoryProduct = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  primaryBarcode?: string | null;
  barcodeAliases: string[];
  unit?: string;
  isActive?: boolean;
} | null;

export type LocationInventoryItem = {
  id: string;
  workspaceId: string;
  locationId: string;
  productId: string;
  onHand: number;
  available: number;
  lastTransactionAtMs: number | null;
  updatedAtMs: number | null;
  product: LocationInventoryProduct;
};

export type GetLocationInventoryRequest = {
  workspaceId: string;
  locationId: string;
  limit?: number;
  cursor?: GetLocationInventoryCursor | null;
};

export type GetLocationInventoryResponse = {
  items: LocationInventoryItem[];
  nextCursor: GetLocationInventoryCursor | null;
};

export type ProductLocationInventoryItem = {
  locationId: string;
  locationName: string;
  locationCode: string | null;
  onHand: number;
  available: number;
  stockStatus: ProductStockStatus;
  lastTransactionAtMs: number | null;
};

export type RecentActivityFeedItem = {
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

export type GetProductDetailSnapshotRequest = {
  workspaceId: string;
  productId: string;
  activityLimit?: number;
};

export type GetProductDetailSnapshotResponse = {
  summary: ProductSummaryListItem | null;
  locations: ProductLocationInventoryItem[];
  recentActivity: RecentActivityFeedItem[];
  generatedAtMs: number;
};