import { createCallable } from "@/lib/functions";

export type CompleteOnboardingRequest = {
  workspaceId: string;
};

export type CompleteOnboardingResponse = {
  ok: boolean;
};

export const completeOnboarding = createCallable<
  CompleteOnboardingRequest,
  CompleteOnboardingResponse
>("completeOnboarding");