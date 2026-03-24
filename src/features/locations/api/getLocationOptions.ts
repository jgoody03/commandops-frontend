import { createCallable } from "@/lib/functions";

export type GetLocationOptionsRequest = {
  workspaceId: string;
};

export type LocationOptionItem = {
  locationId: string;
  locationName: string;
  locationCode: string | null;
  isDefault: boolean;
};

export type GetLocationOptionsResponse = {
  items: LocationOptionItem[];
};

export const getLocationOptions = createCallable<
  GetLocationOptionsRequest,
  GetLocationOptionsResponse
>("getLocationOptions");