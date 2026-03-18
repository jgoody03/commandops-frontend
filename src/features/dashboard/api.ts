import { callFunction } from "../../lib/functions";
import type { GetTodaySnapshotRequest, TodaySnapshot } from "./types";

const getTodaySnapshotFn = callFunction<GetTodaySnapshotRequest, TodaySnapshot>(
  "getTodaySnapshot"
);

export async function getTodaySnapshot(
  input: GetTodaySnapshotRequest
): Promise<TodaySnapshot> {
  const result = await getTodaySnapshotFn(input);
  return result.data;
}