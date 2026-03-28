import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthGate } from "@/features/auth/AuthGate";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

function getIsSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function resolveRoute(role?: string, isSmallScreen?: boolean) {
  switch (role) {
    case "staff":
      return "/ops";

    case "owner":
      return isSmallScreen ? "/owner" : "/hub";

    case "admin":
    case "manager":
      return isSmallScreen ? "/owner" : "/hub";

    default:
      return isSmallScreen ? "/owner" : "/hub";
  }
}

function RoleLandingContent() {
  const { workspaceId, role, onboardingCompleted } = useWorkspaceContext();
  const [isSmallScreen, setIsSmallScreen] = useState(getIsSmallScreen());

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(getIsSmallScreen());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!workspaceId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-sm text-gray-600 shadow-sm">
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  const destination = resolveRoute(role, isSmallScreen);

  const hasSeenTabletWelcome =
    typeof window !== "undefined" &&
    localStorage.getItem("sp_tablet_welcome_seen") === "true";

  const hasSeenOpsWelcome =
    typeof window !== "undefined" &&
    localStorage.getItem("sp_ops_welcome_seen") === "true";

  const hasSeenOwnerWelcome =
    typeof window !== "undefined" &&
    localStorage.getItem("sp_owner_welcome_seen") === "true";

  if (!isSmallScreen && destination === "/hub" && !hasSeenTabletWelcome) {
    return <Navigate to="/tablet/welcome" replace />;
  }

  if (
    destination === "/ops" &&
    !hasSeenOpsWelcome &&
    (role === "staff" || isSmallScreen)
  ) {
    return <Navigate to="/ops/welcome" replace />;
  }

  if (destination === "/owner" && isSmallScreen && !hasSeenOwnerWelcome) {
    return <Navigate to="/owner/welcome" replace />;
  }

  return <Navigate to={destination} replace />;
}

export default function RoleLandingPage() {
  return (
    <AuthGate>
      <RoleLandingContent />
    </AuthGate>
  );
}