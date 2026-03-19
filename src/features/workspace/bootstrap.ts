import { callFunction } from "../../lib/functions";

export type BootstrapWorkspaceRequest = {
  workspaceId: string;
  workspaceName: string;
};

export type BootstrapWorkspaceResponse = {
  workspaceId: string;
};

const bootstrapWorkspaceFn = callFunction<
  BootstrapWorkspaceRequest,
  BootstrapWorkspaceResponse
>("bootstrapWorkspace");

export async function bootstrapWorkspace(input: BootstrapWorkspaceRequest) {
  return bootstrapWorkspaceFn(input);
}