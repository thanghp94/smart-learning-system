
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/Classes/ClassDetail";
import TeachingSessions from "./pages/TeachingSessions";
import ProtectedRoute from "./components/common/ProtectedRoute";
import StudentDetail from "./pages/Students/StudentDetail";
import EmployeeDetail from "./pages/Employees/EmployeeDetail";
import Employees from "./pages/Employees";
import TeacherSchedule from "./pages/TeacherSchedule";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import Enrollments from "./pages/Enrollments";
import Facilities from "./pages/Facilities";
import FacilityDetail from "./pages/Facilities/FacilityDetail";
import NotFound from "./pages/NotFound";
import Finances from "./pages/Finances";
import Students_old from "./pages/Students";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PersonalDashboard from "./pages/PersonalDashboard";
import Admissions from "./pages/Admissions";
import Payroll from "./pages/Payroll";
import Images from "./pages/Images";
import ImageDetailView from "./pages/Images/ImageDetailView";
import Events from "./pages/Events";
import Files from "./pages/Files";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";
import Assets from "./pages/Assets";
import AssetDetail from "./pages/Assets/AssetDetail";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/Contacts/ContactDetail";
import Requests from "./pages/Requests";
import DatabaseSchema from "./pages/DatabaseSchema";
import AITools from "./pages/AITools";
import AICommands from "./pages/AICommands";
import TeachingSessionForm from "./pages/TeachingSessions/TeachingSessionForm";
import ClassForm from "./pages/Classes/ClassForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <Dashboard /> },
        ]
      },
      {
        path: "classes",
        children: [
          { index: true, element: <ProtectedRoute><Classes /></ProtectedRoute> },
          { path: "new", element: <ProtectedRoute><ClassForm /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><ClassDetail classItem={{}} /></ProtectedRoute> },
          { path: ":id/edit", element: <ProtectedRoute><ClassForm /></ProtectedRoute> },
        ]
      },
      {
        path: "images",
        children: [
          { index: true, element: <ProtectedRoute><Images /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><ImageDetailView image={{}} /></ProtectedRoute> },
        ]
      },
      {
        path: "sessions",
        children: [
          { index: true, element: <ProtectedRoute><TeachingSessions /></ProtectedRoute> },
          { path: "new", element: <ProtectedRoute><TeachingSessionForm /></ProtectedRoute> },
        ]
      },
      {
        path: "students",
        children: [
          { index: true, element: <ProtectedRoute><Students /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><StudentDetail /></ProtectedRoute> },
        ]
      },
      {
        path: "employees",
        children: [
          { index: true, element: <ProtectedRoute><Employees /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><EmployeeDetail /></ProtectedRoute> },
          { path: ":id/dashboard", element: <ProtectedRoute><EmployeeDashboard /></ProtectedRoute> },
        ]
      },
      {
        path: "my-dashboard",
        element: <ProtectedRoute><PersonalDashboard /></ProtectedRoute>,
      },
      { path: "schedule", element: <ProtectedRoute><TeacherSchedule /></ProtectedRoute> },
      { path: "attendance", element: <ProtectedRoute><Attendance /></ProtectedRoute> },
      { path: "enrollments", element: <ProtectedRoute><Enrollments /></ProtectedRoute> },
      {
        path: "facilities",
        children: [
          { index: true, element: <ProtectedRoute><Facilities /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><FacilityDetail /></ProtectedRoute> },
        ]
      },
      {
        path: "assets",
        children: [
          { index: true, element: <ProtectedRoute><Assets /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><AssetDetail /></ProtectedRoute> },
        ]
      },
      { path: "finance", element: <ProtectedRoute><Finances /></ProtectedRoute> },
      { path: "admissions", element: <ProtectedRoute><Admissions /></ProtectedRoute> },
      { path: "payroll", element: <ProtectedRoute><Payroll /></ProtectedRoute> },
      { path: "events", element: <ProtectedRoute><Events /></ProtectedRoute> },
      { path: "files", element: <ProtectedRoute><Files /></ProtectedRoute> },
      { path: "tasks", element: <ProtectedRoute><Tasks /></ProtectedRoute> },
      {
        path: "contacts",
        children: [
          { index: true, element: <ProtectedRoute><Contacts /></ProtectedRoute> },
          { path: ":id", element: <ProtectedRoute><ContactDetail /></ProtectedRoute> },
        ]
      },
      { path: "requests", element: <ProtectedRoute><Requests /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: "schema", element: <ProtectedRoute><DatabaseSchema /></ProtectedRoute> },
      { path: "ai-tools", element: <ProtectedRoute><AITools /></ProtectedRoute> },
      { path: "ai-commands", element: <ProtectedRoute><AICommands /></ProtectedRoute> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Auth /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
