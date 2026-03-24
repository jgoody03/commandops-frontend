import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import HubPage from "../pages/hub/HubPage";
import OpsHomePage from "../pages/ops/OpsHomePage";
import ViewHomePage from "../pages/view/ViewHomePage";
import { AuthGate } from "../features/auth/AuthGate";
import OpsReceivePage from "../pages/ops/OpsReceivePage";
import OpsMovePage from "../pages/ops/OpsMovePage";
import OpsAdjustPage from "../pages/ops/OpsAdjustPage";
import OpsCountPage from "../pages/ops/OpsCountPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/hub" replace />,
  },
  {
    path: "/hub",
    element: (
      <AuthGate>
        <HubPage />
      </AuthGate>
    ),
  },
  {
    path: "/hub/dashboard",
    element: <Navigate to="/hub" replace />,
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
    path: "/ops/receive",
    element: (
      <AuthGate>
        <OpsReceivePage />
      </AuthGate>
    ),
  },
  {
  path: "/ops/adjust",
  element: (
    <AuthGate>
      <OpsAdjustPage />
    </AuthGate>
  ),
},
  {
  path: "/ops/move",
  element: (
    <AuthGate>
      <OpsMovePage />
    </AuthGate>
  ),
},
{
  path: "/ops/count",
  element: (
    <AuthGate>
      <OpsCountPage />
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