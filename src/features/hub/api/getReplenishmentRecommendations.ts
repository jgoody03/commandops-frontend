import { createCallable } from "@/lib/functions";

export type GetReplenishmentRecommendationsInput = {
  workspaceId: string;
  limit?: number;
};

export type ReplenishmentItem = {
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
  urgencyScore: number;
};

export type GetReplenishmentRecommendationsOutput = {
  items: ReplenishmentItem[];
  generatedAtMs: number;
};

export const getReplenishmentRecommendations = createCallable<
  GetReplenishmentRecommendationsInput,
  GetReplenishmentRecommendationsOutput
>("getReplenishmentRecommendations");