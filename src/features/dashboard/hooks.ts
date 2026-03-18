import { useQuery } from "@tanstack/react-query";
import { getTodaySnapshot } from "./api";

export function useTodaySnapshot(workspaceId?: string) {
  return useQuery({
    queryKey: ["todaySnapshot", workspaceId],
    queryFn: () => getTodaySnapshot({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
  });
}