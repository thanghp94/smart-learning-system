import { createBrowserRouter, Navigate } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import NotFound from "../pages/NotFound";
import Index from "../pages/Index";
import authRoutes from "./auth-routes";
import dashboardRoutes from "./dashboard-routes";
import educationRoutes from "./education-routes";
import managementRoutes from "./management-routes";
import aiRoutes from "./ai-routes";
import adminRoutes from "./admin-routes"; // Added admin routes

const routes = createBrowserRouter([
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        index: true,
        element: <Index />
      }
    ]
  },
  authRoutes,
  ...dashboardRoutes,
  ...educationRoutes,
  ...managementRoutes,
  aiRoutes,
  adminRoutes, // Include admin routes in the main routes
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;