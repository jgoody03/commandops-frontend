import SignupForm from "@/features/signup/components/SignupForm";
import PublicHeader from "@/components/public/PublicHeader";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <div className="px-4 py-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Start simple
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Create your workspace and get moving fast.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              StorePilot is built to help small stores and growing resellers get
              organized without clunky software or a long setup process.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <div className="font-medium text-slate-900">Fast setup</div>
                <div className="mt-1 text-sm text-slate-600">
                  Create your account, set up your workspace, and start onboarding in minutes.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <div className="font-medium text-slate-900">Built for real work</div>
                <div className="mt-1 text-sm text-slate-600">
                  Tablet, handheld, and owner views all work together from one system.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <div className="font-medium text-slate-900">Ready for hardware later</div>
                <div className="mt-1 text-sm text-slate-600">
                  Start on the web now or finish setup later on your shipped device.
                </div>
              </div>
            </div>
          </div>

          <div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}