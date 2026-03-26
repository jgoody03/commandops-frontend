import { createCallable } from "@/lib/functions";

export type ReplenishmentReasonCode =
  | "OUT_OF_STOCK_EVERYWHERE"
  | "LOW_STOCK_MULTIPLE_LOCATIONS"
  | "OUT_OF_STOCK_SOME_LOCATIONS"
  | "LOW_STOCK_SOME_LOCATIONS"
  | "NETWORK_STOCK_LOW";

export type ReplenishmentAction = "receive" | "move" | "review";

export type ReplenishmentUrgencyLabel = "critical" | "high" | "medium";

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
  stockStatus: "ok" | "low" | "out";
  lastTransactionAtMs: number | null;
  updatedAtMs: number | null;
  urgencyScore: number;
  urgencyLabel: ReplenishmentUrgencyLabel;
  recommendedAction: ReplenishmentAction;
  suggestedQuantity: number | null;
  reasonCodes: ReplenishmentReasonCode[];
};

export type GetReplenishmentRecommendationsRequest = {
  workspaceId: string;
  limit?: number;
};

export type GetReplenishmentRecommendationsResponse = {
  items: ReplenishmentItem[];
  generatedAtMs: number;
};

export const getReplenishmentRecommendations = createCallable<
  GetReplenishmentRecommendationsRequest,
  GetReplenishmentRecommendationsResponse
>("getReplenishmentRecommendations");