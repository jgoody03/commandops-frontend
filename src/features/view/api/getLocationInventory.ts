import { callFunction } from "@/lib/functions";
import type {
  GetLocationInventoryRequest,
  GetLocationInventoryResponse,
} from "../types";

const getLocationInventoryFn = callFunction<
  GetLocationInventoryRequest,
  GetLocationInventoryResponse
>("getLocationInventory");

export async function getLocationInventory(
  input: GetLocationInventoryRequest
) {
  return getLocationInventoryFn(input);
}