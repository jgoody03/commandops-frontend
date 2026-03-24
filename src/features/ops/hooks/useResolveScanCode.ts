import { useMutation } from "@tanstack/react-query";
import { resolveScanCode } from "../api";

export function useResolveScanCode() {
  return useMutation({
    mutationFn: resolveScanCode,
  });
}