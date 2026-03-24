import { callFunction } from "@/lib/functions";
import type {
  ReceiveInventoryRequest,
  ReceiveInventoryResponse,
} from "../types";

const receiveInventoryFn = callFunction<
  ReceiveInventoryRequest,
  ReceiveInventoryResponse
>("receiveInventory");

export async function receiveInventory(input: ReceiveInventoryRequest) {
  return receiveInventoryFn(input);
}