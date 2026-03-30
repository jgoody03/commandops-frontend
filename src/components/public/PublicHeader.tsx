import { Link } from "react-router-dom";

export default function PublicHeader() {
return (
  <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
      <Link to="/" className="text-lg font-semibold text-slate-900">
        StorePilot
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5">
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Pricing
          </Link>

          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Sign in
          </Link>
        </div>

        <Link
          to="/signup"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Get started
        </Link>
      </div>
    </div>
  </header>
);
}