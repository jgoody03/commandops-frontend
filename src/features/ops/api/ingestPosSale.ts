import { createCallable } from "@/lib/functions";

export type IngestPosSaleRequest = {
  workspaceId: string;
  locationId: string;
  saleId?: string;
  orderNumber?: string;
  tenderType?: "cash" | "card" | "other";
  note?: string;
  lines: Array<{
    productId: string;
    quantity: number;
    unitPrice?: number;
    barcode?: string;
    note?: string;
  }>;
};

export type IngestPosSaleResponse = {
  ok: boolean;
  transactionId: string;
  postedAt: string;
  lineCount: number;
};

export const ingestPosSale = createCallable<
  IngestPosSaleRequest,
  IngestPosSaleResponse
>("ingestPosSale");