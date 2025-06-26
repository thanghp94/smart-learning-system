
import { createBrowserRouter, Navigate } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import NotFound from "../pages/NotFound";
import Index from "../pages/Index";
import authRoutes from "./auth-routes";
import dashboardRoutes from "./dashboard-routes";
import educationRoutes from "./education-routes";
import managementRoutes from "./management-routes";
import aiRoutes from "./ai-routes";

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
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
