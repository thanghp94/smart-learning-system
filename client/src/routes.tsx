import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import BlankLayout from "./layouts/BlankLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Dashboard
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Assets from "./pages/Assets";
import Calendar from "./pages/Calendar";
import Employees from "./pages/Employees";
import Facilities from "./pages/Facilities";
import Events from "./pages/Events";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import ClassDetail from "./pages/Classes/ClassDetail";
import Finances from "./pages/Finances";
import Enrollments from "./pages/Enrollments";
import TeachingSchedules from "./pages/TeachingSchedules";
import TeacherSchedule from "./pages/TeacherSchedule";
import TeachingSessions from "./pages/TeachingSessions";
import Attendance from "./pages/Attendance";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import DatabaseSchema from "./pages/DatabaseSchema";
import AITools from "./pages/AITools";
import AICommands from "./pages/AICommands";
import Settings from "./pages/Settings";
import Images from "./pages/Images";
import PersonalDashboard from "./pages/PersonalDashboard";

// Misc
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

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
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      }
    ]
  },
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
  },
  {
    path: "/students",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Students />
      }
    ]
  },
  {
    path: "/classes",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Classes />
      }
    ]
  },
  {
    path: "/enrollments",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Enrollments />
      }
    ]
  },
  {
    path: "/teaching-sessions",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <TeachingSessions />
      }
    ]
  },
  {
    path: "/teaching-schedules",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <TeachingSchedules />
      }
    ]
  },
  {
    path: "/teacher-schedule",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <TeacherSchedule />
      }
    ]
  },
  {
    path: "/attendance",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Attendance />
      }
    ]
  },
  {
    path: "/assets",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Assets />
      }
    ]
  },
  {
    path: "/calendar",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Calendar />
      }
    ]
  },
  {
    path: "/employees",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Employees />
      }
    ]
  },
  {
    path: "/facilities",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Facilities />
      }
    ]
  },
  {
    path: "/events",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Events />
      }
    ]
  },
  {
    path: "/contacts",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Contacts />
      }
    ]
  },
  {
    path: "/tasks",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Tasks />
      }
    ]
  },
  {
    path: "/finances",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Finances />
      }
    ]
  },
  {
    path: "/settings",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Settings />
      }
    ]
  },
  {
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
  },
  {
    path: "/images",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Images />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
