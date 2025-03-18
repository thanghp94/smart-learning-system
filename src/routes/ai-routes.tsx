
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AITools from "../pages/AITools";
import AICommands from "../pages/AICommands";

const aiRoutes: RouteObject = {
  path: "/ai",
  element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
  children: [
    {
      path: "tools",
      element: <AITools />
    },
    {
      path: "commands",
      element: <AICommands />
    }
  ]
};

export default aiRoutes;
