import { callFunction } from "@/lib/functions";
import type {
  AdjustInventoryRequest,
  AdjustInventoryResponse,
} from "../types";

const adjustInventoryFn = callFunction<
  AdjustInventoryRequest,
  AdjustInventoryResponse
>("adjustInventory");

export async function adjustInventory(input: AdjustInventoryRequest) {
  return adjustInventoryFn(input);
}