import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countInventory } from "../api";

export function useCountInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
      queryClient.invalidateQueries({ queryKey: ["locationSummaryList"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["replenishmentRecommendations"],
      });
    },
  });
}