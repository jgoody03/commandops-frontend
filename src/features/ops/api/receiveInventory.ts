import { createCallable } from "@/lib/functions";

export type ReceiveInventoryLineInput = {
  productId: string;
  quantity: number;
  unitCost?: number | null;
  barcode?: string;
  note?: string;
};

export type ReceiveInventoryRequest = {
  workspaceId: string;
  locationId: string;
  vendorName?: string;
  referenceNumber?: string;
  note?: string;
  lines: ReceiveInventoryLineInput[];
};

export type ReceiveInventoryResponse = {
  ok: boolean;
  transactionId: string;
  postedAt: string;
  lineCount: number;
};

export const receiveInventory = createCallable<
  ReceiveInventoryRequest,
  ReceiveInventoryResponse
>("receiveInventory");