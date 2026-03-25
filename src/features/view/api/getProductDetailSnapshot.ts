import { callFunction } from "@/lib/functions";
import type {
  GetProductDetailSnapshotRequest,
  GetProductDetailSnapshotResponse,
} from "../types";

const getProductDetailSnapshotFn = callFunction<
  GetProductDetailSnapshotRequest,
  GetProductDetailSnapshotResponse
>("getProductDetailSnapshot");

export async function getProductDetailSnapshot(
  input: GetProductDetailSnapshotRequest
) {
  return getProductDetailSnapshotFn(input);
}