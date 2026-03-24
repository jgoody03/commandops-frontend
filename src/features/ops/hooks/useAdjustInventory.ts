import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustInventory } from "../api";

export function useAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
      queryClient.invalidateQueries({ queryKey: ["locationSummaryList"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockProducts"] });
      queryClient.invalidateQueries({ queryKey: ["replenishmentRecommendations"] });
    },
  });
}
