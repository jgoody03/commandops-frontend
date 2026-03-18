import { callFunction } from "../../lib/functions";
import type { WorkspaceContext } from "./types";

const getMyWorkspaceContextFn = callFunction<void, WorkspaceContext>(
  "getMyWorkspaceContext"
);

export async function getMyWorkspaceContext(): Promise<WorkspaceContext> {
  const result = await getMyWorkspaceContextFn();
  return result.data;
}