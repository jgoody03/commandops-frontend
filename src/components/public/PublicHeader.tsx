import { Link } from "react-router-dom";
import StorePilotLogo from "@/components/branding/StorePilotLogo";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="transition hover:opacity-90">
          <StorePilotLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            How it works
          </a>
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create workspace
          </Link>
        </nav>
      </div>
    </header>
  );
}