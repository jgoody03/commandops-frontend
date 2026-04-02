import { createCallable } from "@/lib/functions";

export type VendorListItem = {
  vendorId: string;
  name: string;
  lastReceivedAtMs?: number | null;
  receiveCount?: number;
};

export type ListVendorsRequest = {
  workspaceId: string;
  limit?: number;
};

export type ListVendorsResponse = {
  items: VendorListItem[];
};

export const listVendors = createCallable<
  ListVendorsRequest,
  ListVendorsResponse
>("listVendors");