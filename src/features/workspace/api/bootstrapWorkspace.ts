import { createCallable } from "@/lib/functions";

export type BootstrapWorkspaceRequest = {
  workspaceId: string;
  workspaceName: string;
  phoneNumber?: string;
  businessType?: string;
  expectedLocationCount?: string;
  setupPreference?: "start_now" | "device_later";
};

export type BootstrapWorkspaceResponse = {
  ok: boolean;
  workspaceId: string;
};

export const bootstrapWorkspace = createCallable<
  BootstrapWorkspaceRequest,
  BootstrapWorkspaceResponse
>("bootstrapWorkspace");