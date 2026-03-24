import { callFunction } from "@/lib/functions";
import type {
  CountInventoryRequest,
  CountInventoryResponse,
} from "../types";

const countInventoryFn = callFunction<
  CountInventoryRequest,
  CountInventoryResponse
>("countInventory");

export async function countInventory(input: CountInventoryRequest) {
  return countInventoryFn(input);
}