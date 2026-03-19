import { useCallback, useEffect, useState } from "react";
import {
  getLowStockProducts,
  type GetLowStockProductsOutput,
  type SummaryListCursor,
} from "../api/getLowStockProducts";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  initialLimit?: number;
  initialOutOnly?: boolean;
  initialQuery?: string;
};

export function useLowStockProducts(options?: Options) {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<GetLowStockProductsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [query, setQuery] = useState(options?.initialQuery ?? "");
  const [outOnly, setOutOnly] = useState(options?.initialOutOnly ?? false);
  const limit = options?.initialLimit ?? 10;

  const loadFirstPage = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getLowStockProducts({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        outOnly,
        cursor: null,
      });

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, limit, query, outOnly]);

  const loadMore = useCallback(async () => {
    if (!workspaceId || !data?.nextCursor) return;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getLowStockProducts({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        outOnly,
        cursor: data.nextCursor as SummaryListCursor,
      });

      setData((prev) => ({
        items: [...(prev?.items ?? []), ...result.items],
        nextCursor: result.nextCursor,
      }));
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [workspaceId, data?.nextCursor, limit, query, outOnly]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  return {
    data,
    loading,
    loadingMore,
    error,
    query,
    setQuery,
    outOnly,
    setOutOnly,
    reload: loadFirstPage,
    loadMore,
    hasMore: Boolean(data?.nextCursor),
  };
}