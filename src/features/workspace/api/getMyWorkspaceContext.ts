import { createCallable } from "@/lib/functions";
import type { WorkspaceRole } from "../types";

export type GetMyWorkspaceContextResponse = {
  workspaceId: string | null;
  memberId: string | null;
  role: WorkspaceRole | null;
  defaultLocationId: string | null;
  onboarding: {
    completed: boolean;
    step: string;
  };
};

export const getMyWorkspaceContext =
  createCallable<void, GetMyWorkspaceContextResponse>(
    "getMyWorkspaceContext"
  );