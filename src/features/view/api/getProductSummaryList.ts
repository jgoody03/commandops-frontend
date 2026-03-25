import { callFunction } from "@/lib/functions";
import type {
  GetProductSummaryListRequest,
  GetProductSummaryListResponse,
} from "../types";

const getProductSummaryListFn = callFunction<
  GetProductSummaryListRequest,
  GetProductSummaryListResponse
>("getProductSummaryList");

export async function getProductSummaryList(
  input: GetProductSummaryListRequest
) {
  return getProductSummaryListFn(input);
}