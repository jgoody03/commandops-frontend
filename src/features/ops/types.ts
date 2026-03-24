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

export type ResolveScanCodeResponse = {
  found: boolean;
  code: string;
  product?: ResolvedProductSummary | null;
};

export type QuickCreateProductRequest = {
  workspaceId: string;
  name: string;
  sku: string;
  primaryBarcode?: string;
};

export type QuickCreateProductResponse = {
  ok: boolean;
  product: {
    id: string;
    sku: string;
    name: string;
    primaryBarcode?: string | null;
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

export type ReceiveFlowStatus =
  | "idle"
  | "resolving"
  | "resolved"
  | "creating"
  | "ready"
  | "posting"
  | "success"
  | "error";