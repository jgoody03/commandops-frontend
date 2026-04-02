import { createCallable } from "@/lib/functions";

export type GetReceiveHistoryRequest = {
  workspaceId: string;
  limit?: number;
};

export type ReceiveHistoryItem = {
  transactionId: string;
  vendorName?: string | null;
  locationId?: string | null;
  locationName?: string | null;
  referenceNumber?: string | null;
  note?: string | null;
  lineCount?: number;
  postedAtMs: number;
};

export type GetReceiveHistoryResponse = {
  items: ReceiveHistoryItem[];
};

export const getReceiveHistory = createCallable<
  GetReceiveHistoryRequest,
  GetReceiveHistoryResponse
>("getReceiveHistory");