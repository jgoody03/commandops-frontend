import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // adjust path if needed

function getModeLabel(pathname: string) {
  if (pathname.startsWith("/ops")) return "Ops";
  if (pathname.startsWith("/owner")) return "Owner";
  if (pathname.startsWith("/view")) return "View";
  return "Hub";
}

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = auth.currentUser;
  const mode = getModeLabel(location.pathname);

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/login"); // or "/" if your auth gate handles redirect
    } catch (error) {
      console.error("Sign out failed", error);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* LEFT: Branding */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            CommandOps
          </div>
          <div className="text-lg font-semibold text-gray-900">
            Operations Platform
          </div>
        </div>

        {/* RIGHT: Mode + User + Sign out */}
        <div className="flex items-center gap-4">
          
          {/* Mode label */}
          <div className="hidden text-sm text-gray-500 sm:block">
            {mode} Mode
          </div>

          {/* User email */}
          {user?.email ? (
            <div className="hidden text-sm text-gray-500 md:block">
              {user.email}
            </div>
          ) : null}

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}