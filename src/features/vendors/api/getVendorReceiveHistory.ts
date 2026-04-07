import { createCallable } from "@/lib/functions";

export type GetVendorReceiveHistoryRequest = {
  workspaceId: string;
  vendorName: string;
  limit?: number;
};

export type VendorReceiveHistoryItem = {
  transactionId: string;
  locationId?: string | null;
  locationName?: string | null;
  referenceNumber?: string | null;
  note?: string | null;
  lineCount?: number;
  postedAtMs: number;
};

export type GetVendorReceiveHistoryResponse = {
  vendorName: string;
  items: VendorReceiveHistoryItem[];
};

export const getVendorReceiveHistory = createCallable<
  GetVendorReceiveHistoryRequest,
  GetVendorReceiveHistoryResponse
>("getVendorReceiveHistory");