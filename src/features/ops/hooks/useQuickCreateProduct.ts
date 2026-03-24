import { useMutation } from "@tanstack/react-query";
import { quickCreateProduct } from "../api";

export function useQuickCreateProduct() {
  return useMutation({
    mutationFn: quickCreateProduct,
  });
}