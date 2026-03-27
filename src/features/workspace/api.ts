import { callFunction } from "@/lib/functions";
import type { GetMyWorkspaceContextResponse } from "./types";

const getMyWorkspaceContextFn =
  callFunction<void, GetMyWorkspaceContextResponse>("getMyWorkspaceContext");

export async function getMyWorkspaceContext() {
  return getMyWorkspaceContextFn();
}