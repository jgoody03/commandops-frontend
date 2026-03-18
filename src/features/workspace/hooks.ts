import { useQuery } from "@tanstack/react-query";
import { getMyWorkspaceContext } from "./api";

export function useMyWorkspaceContext() {
  return useQuery({
    queryKey: ["workspaceContext"],
    queryFn: getMyWorkspaceContext,
  });
}