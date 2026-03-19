import { useEffect, useState } from "react";
import { getLowStockProducts } from "../api/getLowStockProducts";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export function useLowStockProducts() {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!workspaceId) return;

    setLoading(true);

    getLowStockProducts({ workspaceId })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [workspaceId]);

  return { data, loading, error };
}