export type ResolvedProductSummary = {
  productId: string;
  name: string;
  sku: string;
  barcode?: string | null;
  unitLabel?: string | null;
};

export type ResolveScanCodeRequest = {
  workspaceId: string;
  code: string;
};

export type ResolveScanCodeResponse =
  | {
      resolutionStatus: "resolved";
      productId: string;
      sku: string;
      productName: string;
      price?: number | null;
    }
  | {
      resolutionStatus: "unresolved";
    };
    
export type QuickCreateProductRequest = {
  workspaceId: string;
  name: string;
  sku: string;
  primaryBarcode?: string;
  price?: number | null;
};

export type QuickCreateProductResponse = {
  ok: boolean;
  product: {
    id: string;
    sku: string;
    name: string;
    primaryBarcode?: string | null;
    price?: number | null;
    unit?: string | null;
  };
};

export type ReceiveInventoryRequest = {
  workspaceId: string;
  locationId: string;
  lines: Array<{
    productId: string;
    quantity: number;
  }>;
};

export type ReceiveInventoryResponse = {
  ok: boolean;
  transactionId: string;
  postedAt: string;
  lineCount: number;
};

export type ReceiveLocationOption = {
  id: string;
  name: string;
  code?: string | null;
};
export type MoveInventoryRequest = {
  workspaceId: string;
  sourceLocationId: string;
  targetLocationId: string;
  note?: string;
  lines: Array<{
    productId: string;
    quantity: number;
    barcode?: string;
    note?: string;
  }>;
};

export type MoveInventoryResponse = {
  ok: boolean;
  relatedTransactionGroupId: string;
  moveOutTransactionId: string;
  moveInTransactionId: string;
  postedAt: string;
  lineCount: number;
  sourceLocationId: string;
  targetLocationId: string;
};

export type AdjustInventoryRequest = {
  workspaceId: string;
  locationId: string;
  note?: string;
  lines: Array<{
    productId: string;
    quantityDelta: number;
    barcode?: string;
    note?: string;
  }>;
};

export type AdjustInventoryResponse = {
  ok: boolean;
  transactionId?: string;
  postedAt?: string;
  lineCount?: number;
};
export type CountInventoryRequest = {
  workspaceId: string;
  locationId: string;
  productId: string;
  countedQuantity: number;
  note?: string;
  barcode?: string;
};

export type CountInventoryResponse = {
  ok: boolean;
  productId: string;
  locationId: string;
  previousQuantity: number;
  countedQuantity: number;
  quantityDelta: number;
  transactionId: string | null;
  postedAt: string;
};

export type ReceiveFlowStatus =
  | "idle"
  | "resolving"
  | "resolved"
  | "creating"
  | "ready"
  | "posting"
  | "success"
  | "error";