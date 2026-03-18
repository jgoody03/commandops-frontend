import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import HubDashboardPage from "../pages/hub/HubDashboardPage";
import OpsHomePage from "../pages/ops/OpsHomePage";
import ViewHomePage from "../pages/view/ViewHomePage";
import { AuthGate } from "../features/auth/AuthGate";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <AuthGate>
        <HubDashboardPage />
      </AuthGate>
    ),
  },
  {
    path: "/hub/dashboard",
    element: (
      <AuthGate>
        <HubDashboardPage />
      </AuthGate>
    ),
  },
  {
    path: "/ops",
    element: (
      <AuthGate>
        <OpsHomePage />
      </AuthGate>
    ),
  },
  {
    path: "/view",
    element: (
      <AuthGate>
        <ViewHomePage />
      </AuthGate>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);