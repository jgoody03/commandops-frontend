import { createCallable } from "@/lib/functions";

export type CreateLocationRequest = {
  workspaceId: string;
  name: string;
  code: string;
  type: string;
};

export type CreateLocationResponse = {
  ok: boolean;
  location: {
    id: string;
    name: string;
    code: string;
    type: string;
    isActive: boolean;
  };
};

export const createLocation = createCallable<
  CreateLocationRequest,
  CreateLocationResponse
>("createLocation");