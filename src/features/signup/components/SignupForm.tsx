import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signupWithEmailPassword,
  updateMyProfile,
} from "@/features/auth/authClient";
import { bootstrapWorkspace } from "@/features/workspace/api/bootstrapWorkspace";
import { makeWorkspaceId } from "@/features/signup/utils/makeWorkspaceId";
import type { SignupFormValues } from "@/features/signup/types";

const businessTypeOptions = [
  "Retail store",
  "Convenience / small shop",
  "Specialty store",
  "Online seller",
  "Parts / supplies",
  "Other",
];

const locationCountOptions = ["1", "2–3", "4–10", "10+"];

function normalizeErrorMessage(err: unknown) {
  if (!(err instanceof Error)) {
    return "Unable to create workspace.";
  }

  const msg = err.message.toLowerCase();

  if (msg.includes("email-already-in-use")) {
    return "That email is already in use.";
  }

  if (msg.includes("invalid-email")) {
    return "Please enter a valid email.";
  }

  if (msg.includes("weak-password")) {
    return "Password must be at least 6 characters.";
  }

  return err.message || "Unable to create workspace.";
}

export default function SignupForm() {
  const navigate = useNavigate();

  const [values, setValues] = useState<SignupFormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    businessName: "",
    businessType: "",
    expectedLocationCount: "",
    setupPreference: "start_now",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(
      values.fullName.trim() &&
        values.email.trim() &&
        values.phoneNumber.trim() &&
        values.password.trim() &&
        values.businessName.trim()
    );
  }, [values]);

  function update<K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      await signupWithEmailPassword(values.email.trim(), values.password);

      await updateMyProfile({
        displayName: values.fullName.trim(),
      });

      let workspaceId = makeWorkspaceId(values.businessName);
      if (!workspaceId) {
        workspaceId = `ws-${Date.now()}`;
      }

      await bootstrapWorkspace({
        workspaceId,
        workspaceName: values.businessName.trim(),
        phoneNumber: values.phoneNumber.trim() || undefined,
        businessType: values.businessType || undefined,
        expectedLocationCount: values.expectedLocationCount || undefined,
        setupPreference: values.setupPreference,
      });

      navigate("/app", { replace: true });
    } catch (err) {
      setError(normalizeErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        Create your workspace
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Start with a few basics. You can finish setup inside the app.
      </p>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Your workspace is created first, then StorePilot guides you through setup.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Your account
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                placeholder="jane@business.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone number
              </label>
              <input
                value={values.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Your business
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Business name
              </label>
              <input
                value={values.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                placeholder="Corner Market"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Business type
              </label>
              <select
                value={values.businessType}
                onChange={(e) => update("businessType", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              >
                <option value="">Select one</option>
                {businessTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Expected locations
              </label>
              <select
                value={values.expectedLocationCount}
                onChange={(e) => update("expectedLocationCount", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              >
                <option value="">Select one</option>
                {locationCountOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">
                How would you like to get started?
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="radio"
                    name="setupPreference"
                    checked={values.setupPreference === "start_now"}
                    onChange={() => update("setupPreference", "start_now")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      Start setup now on this device
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Create your workspace and go straight into setup.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="radio"
                    name="setupPreference"
                    checked={values.setupPreference === "device_later"}
                    onChange={() => update("setupPreference", "device_later")}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      I’ll finish setup on my shipped device later
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      We’ll still prepare your workspace now.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating workspace..." : "Create workspace"}
        </button>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}