import { useMemo } from "react";

export type WorkspaceContextValue = {
  workspaceId: string;
  memberId?: string;
  defaultLocationId?: string;
};

export function useWorkspaceContext(): WorkspaceContextValue {
  // Replace these with your real source values if you already
  // have them coming from auth/context/backend bootstrap data.
  const workspaceId = "";
  const memberId = undefined;
  const defaultLocationId = undefined;

  return useMemo(
    () => ({
      workspaceId,
      memberId,
      defaultLocationId,
    }),
    [workspaceId, memberId, defaultLocationId]
  );
}