import { createCallable } from "@/lib/functions";

export type SummaryListCursor = {
  updatedAtMs: number;
  docId: string;
};

export type GetLowStockProductsInput = {
  workspaceId: string;
  limit?: number;
  cursor?: SummaryListCursor | null;
  query?: string;
  outOnly?: boolean;
};

export type ProductSummaryListItem = {
  id: string;
  workspaceId: string;
  productId: string;
  sku: string;
  name: string;
  primaryBarcode: string | null;
  unit: string | null;
  totalOnHand: number;
  totalAvailable: number;
  totalLocations: number;
  locationsInStock: number;
  locationsOutOfStock: number;
  locationsLowStock: number;
  isOutOfStockEverywhere: boolean;
  isLowStockAnywhere: boolean;
  stockStatus: string;
  lastTransactionAtMs: number | null;
  updatedAtMs: number | null;
};

export type GetLowStockProductsOutput = {
  items: ProductSummaryListItem[];
  nextCursor: SummaryListCursor | null;
};

export const getLowStockProducts = createCallable<
  GetLowStockProductsInput,
  GetLowStockProductsOutput
>("getLowStockProducts");