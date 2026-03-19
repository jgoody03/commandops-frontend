import { useEffect, useState } from "react";
import {
  getTodaySnapshot,
  type GetTodaySnapshotOutput,
} from "../api/getTodaySnapshot";

export function useTodaySnapshot(workspaceId?: string) {
  const [data, setData] = useState<GetTodaySnapshotOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!workspaceId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getTodaySnapshot({ workspaceId })
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return { data, loading, error };
}