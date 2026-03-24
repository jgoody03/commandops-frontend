import { callFunction } from "@/lib/functions";
import type {
  MoveInventoryRequest,
  MoveInventoryResponse,
} from "../types";

const moveInventoryFn = callFunction<
  MoveInventoryRequest,
  MoveInventoryResponse
>("moveInventory");

export async function moveInventory(input: MoveInventoryRequest) {
  return moveInventoryFn(input);
}