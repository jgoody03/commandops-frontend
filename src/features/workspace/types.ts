export type WorkspaceRole = "owner" | "admin" | "manager" | "staff";

export type GetMyWorkspaceContextResponse = {
  workspaceId: string | null;
  memberId?: string | null;
  defaultLocationId?: string | null;
  role?: WorkspaceRole | null;
};