import { useEffect, useState } from "react";
import { getRecentActivityFeed } from "../api/getRecentActivityFeed";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export function useRecentActivityFeed() {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!workspaceId) return;

    setLoading(true);

    getRecentActivityFeed({ workspaceId })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [workspaceId]);

  return { data, loading, error };
}