import { callFunction } from "@/lib/functions";
import type {
  QuickCreateProductRequest,
  QuickCreateProductResponse,
} from "../types";

const quickCreateProductFn = callFunction<
  QuickCreateProductRequest,
  QuickCreateProductResponse
>("quickCreateProduct");

export async function quickCreateProduct(input: QuickCreateProductRequest) {
  return quickCreateProductFn(input);
}