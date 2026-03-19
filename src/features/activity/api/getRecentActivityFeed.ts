import { createCallable } from "@/lib/functions";

export type GetRecentActivityFeedInput = {
  workspaceId: string;
};

export type ActivityItem = {
  id: string;
  type: string;
  createdAt: string;
  summary: string;
  productName?: string;
  locationName?: string;
  quantityDelta?: number;
};

export type GetRecentActivityFeedOutput = {
  items: ActivityItem[];
};

export const getRecentActivityFeed = createCallable<
  GetRecentActivityFeedInput,
  GetRecentActivityFeedOutput
>("getRecentActivityFeed");