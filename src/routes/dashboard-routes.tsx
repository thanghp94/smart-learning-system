
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import DatabaseSchema from "../pages/DatabaseSchema";
import PersonalDashboard from "../pages/PersonalDashboard";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "employee",
        element: <EmployeeDashboard />
      },
      {
        path: "schema",
        element: <DatabaseSchema />
      }
    ]
  },
  {
    path: "/personal-dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <PersonalDashboard />
      }
    ]
  }
];

export default dashboardRoutes;
