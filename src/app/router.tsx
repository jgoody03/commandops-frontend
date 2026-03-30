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
import ViewProductsPage from "../pages/view/ViewProductsPage";
import ViewLocationInventoryPage from "../pages/view/ViewLocationInventoryPage";
import ViewProductDetailPage from "../pages/view/ViewProductDetailPage";
import OwnerHomePage from "../pages/owner/OwnerHomePage";
import RoleLandingPage from "../pages/RoleLandingPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import TabletWelcomePage from "../pages/tablet/TabletWelcomePage";
import OpsWelcomePage from "../pages/ops/OpsWelcomePage";
import OwnerWelcomePage from "../pages/owner/OwnerWelcomePage";
import SignupPage from "../pages/public/SignupPage";
import HomePage from "../pages/public/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <RoleLandingPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/tablet/welcome",
    element: (
      <AuthGate>
        <TabletWelcomePage />
      </AuthGate>
    ),
  },
  {
    path: "/ops/welcome",
    element: (
      <AuthGate>
        <OpsWelcomePage />
      </AuthGate>
    ),
  },
  {
    path: "/owner/welcome",
    element: (
      <AuthGate>
        <OwnerWelcomePage />
      </AuthGate>
    ),
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
    path: "/owner",
    element: (
      <AuthGate>
        <OwnerHomePage />
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
    path: "/view/products",
    element: (
      <AuthGate>
        <ViewProductsPage />
      </AuthGate>
    ),
  },
  {
    path: "/view/products/:productId",
    element: (
      <AuthGate>
        <ViewProductDetailPage />
      </AuthGate>
    ),
  },
  {
    path: "/view/locations",
    element: (
      <AuthGate>
        <ViewHomePage />
      </AuthGate>
    ),
  },
  {
    path: "/view/locations/:locationId",
    element: (
      <AuthGate>
        <ViewLocationInventoryPage />
      </AuthGate>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);