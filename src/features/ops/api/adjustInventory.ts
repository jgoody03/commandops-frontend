import { createCallable } from "@/lib/functions";

export type AdjustmentReasonCode =
  | "count_variance"
  | "damaged"
  | "expired"
  | "shrink"
  | "theft"
  | "lost"
  | "vendor_return"
  | "customer_return_restock"
  | "customer_return_damaged"
  | "store_use"
  | "promo"
  | "other";

export type AdjustInventoryLineInput = {
  productId: string;
  quantityDelta: number;
  barcode?: string;
  reasonCode?: AdjustmentReasonCode;
  note?: string;
};

export type AdjustInventoryRequest = {
  workspaceId: string;
  locationId: string;
  lines: AdjustInventoryLineInput[];
};

export type AdjustInventoryResponse = {
  ok: boolean;
  transactionId: string;
  postedAt: string;
  lineCount: number;
  locationId: string;
};

export const adjustInventory = createCallable<
  AdjustInventoryRequest,
  AdjustInventoryResponse
>("adjustInventory");