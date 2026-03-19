import { createCallable } from "@/lib/functions";

export type SummaryListCursor = {
  updatedAtMs: number;
  docId: string;
};

export type GetLocationSummaryListInput = {
  workspaceId: string;
  limit?: number;
  cursor?: SummaryListCursor | null;
  query?: string;
};

export type LocationSummaryListItem = {
  id: string;
  workspaceId: string;
  locationId: string;
  locationName: string;
  locationCode: string | null;
  totalSkus: number;
  totalUnits: number;
  totalAvailableUnits: number;
  lowStockSkuCount: number;
  outOfStockSkuCount: number;
  inStockSkuCount: number;
  lastTransactionAtMs: number | null;
  updatedAtMs: number | null;
};

export type GetLocationSummaryListOutput = {
  items: LocationSummaryListItem[];
  nextCursor: SummaryListCursor | null;
};

export const getLocationSummaryList = createCallable<
  GetLocationSummaryListInput,
  GetLocationSummaryListOutput
>("getLocationSummaryList");