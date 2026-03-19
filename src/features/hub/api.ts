import { callFunction } from "../../lib/functions";
import type { GetTodaySnapshotRequest, TodaySnapshot } from "./types";

const getTodaySnapshotFn = callFunction<GetTodaySnapshotRequest, TodaySnapshot>(
  "getTodaySnapshot"
);

export async function getTodaySnapshot(input: GetTodaySnapshotRequest) {
  return getTodaySnapshotFn(input);
}