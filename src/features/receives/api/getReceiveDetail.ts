import { createCallable } from "@/lib/functions";

export type GetReceiveDetailRequest = {
  workspaceId: string;
  transactionId: string;
};

export type ReceiveDetailLineItem = {
  lineId: string;
  productId: string;
  sku: string;
  quantity: number;
  unitCost?: number | null;
  barcode?: string | null;
  note?: string | null;
};

export type GetReceiveDetailResponse = {
  transactionId: string;
  vendorName?: string | null;
  locationId?: string | null;
  locationName?: string | null;
  referenceNumber?: string | null;
  note?: string | null;
  lineCount?: number;
  postedAtMs: number;
  lines: ReceiveDetailLineItem[];
};

export const getReceiveDetail = createCallable<
  GetReceiveDetailRequest,
  GetReceiveDetailResponse
>("getReceiveDetail");