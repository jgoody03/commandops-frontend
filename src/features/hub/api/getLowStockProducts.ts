import { createCallable } from "@/lib/functions";

export type GetLowStockProductsInput = {
  workspaceId: string;
};

export type LowStockProduct = {
  productId: string;
  name: string;
  sku?: string;
  onHand: number;
  reorderPoint?: number;
};

export type GetLowStockProductsOutput = {
  items: LowStockProduct[];
};

export const getLowStockProducts = createCallable<
  GetLowStockProductsInput,
  GetLowStockProductsOutput
>("getLowStockProducts");