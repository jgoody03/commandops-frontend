import { useEffect, useMemo, useState } from "react";
import { getMyWorkspaceContext } from "../api";

export type WorkspaceContextValue = {
  workspaceId: string;
  memberId?: string;
  defaultLocationId?: string;
};

export function useWorkspaceContext(): WorkspaceContextValue {
  const [workspaceId, setWorkspaceId] = useState("");
  const [memberId, setMemberId] = useState<string | undefined>(undefined);
  const [defaultLocationId, setDefaultLocationId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;

    getMyWorkspaceContext()
      .then((result: any) => {
        if (cancelled) return;

        setWorkspaceId(result?.workspaceId ?? "");
        setMemberId(result?.memberId ?? undefined);
        setDefaultLocationId(result?.defaultLocationId ?? undefined);
      })
      .catch(() => {
        if (cancelled) return;

        setWorkspaceId("");
        setMemberId(undefined);
        setDefaultLocationId(undefined);
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
    }),
    [workspaceId, memberId, defaultLocationId]
  );
}