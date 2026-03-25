import { useCallback, useEffect, useState } from "react";
import {
  getProductSummaryList,
} from "../api/getProductSummaryList";
import type {
  GetProductSummaryListResponse,
  ProductStockStatus,
  SummaryListCursor,
} from "../types";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  initialLimit?: number;
  initialQuery?: string;
  initialStockStatus?: ProductStockStatus | "all";
};

export function useProductSummaryList(options?: Options) {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<GetProductSummaryListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [query, setQuery] = useState(options?.initialQuery ?? "");
  const [stockStatus, setStockStatus] = useState<ProductStockStatus | "all">(
    options?.initialStockStatus ?? "all"
  );

  const limit = options?.initialLimit ?? 25;

  const loadFirstPage = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getProductSummaryList({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        stockStatus: stockStatus === "all" ? undefined : stockStatus,
        cursor: null,
      });

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, limit, query, stockStatus]);

  const loadMore = useCallback(async () => {
    if (!workspaceId || !data?.nextCursor) return;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getProductSummaryList({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        stockStatus: stockStatus === "all" ? undefined : stockStatus,
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
  }, [workspaceId, data?.nextCursor, limit, query, stockStatus]);

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
    stockStatus,
    setStockStatus,
    reload: loadFirstPage,
    loadMore,
    hasMore: Boolean(data?.nextCursor),
  };
}