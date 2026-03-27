import { useEffect, useMemo, useState } from "react";
import { getMyWorkspaceContext } from "../api";
import type { WorkspaceRole } from "../types";

export type WorkspaceContextValue = {
  workspaceId: string;
  memberId?: string;
  defaultLocationId?: string;
  role?: WorkspaceRole;
};

export function useWorkspaceContext(): WorkspaceContextValue {
  const [workspaceId, setWorkspaceId] = useState("");
  const [memberId, setMemberId] = useState<string | undefined>(undefined);
  const [defaultLocationId, setDefaultLocationId] = useState<string | undefined>(
    undefined
  );
  const [role, setRole] = useState<WorkspaceRole | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    getMyWorkspaceContext()
      .then((result) => {
        if (cancelled) return;

        setWorkspaceId(result?.workspaceId ?? "");
        setMemberId(result?.memberId ?? undefined);
        setDefaultLocationId(result?.defaultLocationId ?? undefined);
        setRole(result?.role ?? undefined);
      })
      .catch(() => {
        if (cancelled) return;

        setWorkspaceId("");
        setMemberId(undefined);
        setDefaultLocationId(undefined);
        setRole(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      workspaceId,
      memberId,
      defaultLocationId,
      role,
    }),
    [workspaceId, memberId, defaultLocationId, role]
  );
}