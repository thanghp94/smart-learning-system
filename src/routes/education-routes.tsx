
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Students from "../pages/Students";
import Classes from "../pages/Classes";
import Enrollments from "../pages/Enrollments";
import TeachingSessions from "../pages/TeachingSessions";
import TeachingSchedules from "../pages/TeachingSchedules";
import TeacherSchedule from "../pages/TeacherSchedule";
import Attendance from "../pages/Attendance";

const educationRoutes: RouteObject[] = [
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
  }
];

export default educationRoutes;
