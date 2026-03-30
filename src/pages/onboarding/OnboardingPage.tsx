import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGate } from "@/features/auth/AuthGate";
import StepWelcome from "@/features/onboarding/components/StepWelcome";
import StepLocations from "@/features/onboarding/components/StepLocations";
import StepProducts from "@/features/onboarding/components/StepProducts";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { completeOnboarding } from "@/features/workspace/api/completeOnboarding";

type Step = "welcome" | "locations" | "products" | "complete";

function ProgressDots({ step }: { step: Step }) {
  const steps: Step[] = ["welcome", "locations", "products"];
  const activeIndex = steps.indexOf(step === "complete" ? "products" : step);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((item, index) => (
        <div
          key={item}
          className={[
            "h-2.5 rounded-full transition-all duration-200",
            index <= activeIndex ? "w-8 bg-slate-900" : "w-2.5 bg-slate-300",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function OnboardingContent() {
  const [step, setStep] = useState<Step>("welcome");
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { workspaceId } = useWorkspaceContext();

  async function handleFinish() {
    if (!workspaceId) {
      setError("Workspace not available.");
      return;
    }

    setFinishing(true);
    setError(null);

    try {
      await completeOnboarding({ workspaceId });
      setStep("complete");

window.setTimeout(() => {
  navigate("/app", { replace: true });
}, 1100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete setup.");
      setFinishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            StorePilot Setup
          </div>
          <p className="mt-2 text-sm text-slate-600">
            A quick guided setup to get your store ready.
          </p>
          <div className="mt-4">
            <ProgressDots step={step} />
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        {step === "welcome" ? (
          <StepWelcome onNext={() => setStep("locations")} />
        ) : null}

        {step === "locations" ? (
          <div className={finishing ? "pointer-events-none opacity-70" : ""}>
            <StepLocations
              onBack={() => setStep("welcome")}
              onNext={() => setStep("products")}
            />
          </div>
        ) : null}

        {step === "products" ? (
          <div className={finishing ? "pointer-events-none opacity-70" : ""}>
            <StepProducts
              onBack={() => setStep("locations")}
              onNext={handleFinish}
            />
          </div>
        ) : null}

{step === "complete" ? (
  <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
      ✓
    </div>
    <h2 className="mt-4 text-2xl font-semibold text-slate-900">
      You’re all set
    </h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">
      1 location and 1 product are ready to go.
    </p>
    <p className="mt-2 text-sm leading-6 text-slate-500">
      We’re taking you into StorePilot now.
    </p>
  </div>
) : null}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGate>
      <OnboardingContent />
    </AuthGate>
  );
}