import { createCallable } from "@/lib/functions";

export type LocationListItem = {
  id: string;
  name: string;
  code: string;
  type: string;
  isActive: boolean;
};

export type GetLocationsRequest = {
  workspaceId: string;
};

export type GetLocationsResponse = {
  items: LocationListItem[];
};

export const getLocations = createCallable<
  GetLocationsRequest,
  GetLocationsResponse
>("getLocations");