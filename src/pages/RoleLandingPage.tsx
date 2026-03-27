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
      return "/owner";

    case "admin":
    case "manager":
      return isSmallScreen ? "/owner" : "/hub";

    default:
      return isSmallScreen ? "/owner" : "/hub";
  }
}

function RoleLandingContent() {
  const { workspaceId, role } = useWorkspaceContext();
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

  return <Navigate to={resolveRoute(role, isSmallScreen)} replace />;
}

export default function RoleLandingPage() {
  return (
    <AuthGate>
      <RoleLandingContent />
    </AuthGate>
  );
}