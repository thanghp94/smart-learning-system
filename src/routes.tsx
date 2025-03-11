import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components cho các layout
const DashboardLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const AuthLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const BlankLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// Placeholder components cho các trang
const Login = () => <div>Login Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const ResetPassword = () => <div>Reset Password Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const EmployeeDetails = () => <div>Employee Details Page</div>;
const ClassDetails = () => <div>Class Details Page</div>;
const StudentDetails = () => <div>Student Details Page</div>;
const SessionDetails = () => <div>Session Details Page</div>;
const FacilityDetails = () => <div>Facility Details Page</div>;
const Calendar = () => <div>Calendar Page</div>;
const EmployeeFiles = () => <div>Employee Files Page</div>;
const AssetDetails = () => <div>Asset Details Page</div>;
const Finances = () => <div>Finances Page</div>;

// Nhập các trang thực tế từ codebase
import Students from './pages/Students';
import Employees from './pages/Employees';
import Classes from './pages/Classes';
import Facilities from './pages/Facilities';
import AITools from './pages/AITools';
import AICommands from './pages/AICommands';
import DatabaseSchema from './pages/DatabaseSchema';
import NotFound from './pages/NotFound';

const routes = [
  // Auth routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // Dashboard routes
  {
    path: "/",
    element: <DashboardLayout><div /></DashboardLayout>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "employees/:id",
        element: <EmployeeDetails />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "classes/:id",
        element: <ClassDetails />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "students/:id",
        element: <StudentDetails />,
      },
      {
        path: "teaching-sessions/:id",
        element: <SessionDetails />,
      },
      {
        path: "facilities",
        element: <Facilities />,
      },
      {
        path: "facilities/:id",
        element: <FacilityDetails />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "employee-files",
        element: <EmployeeFiles />,
      },
      {
        path: "assets/:id",
        element: <AssetDetails />,
      },
      {
        path: "finances",
        element: <Finances />,
      },
      {
        path: "ai-tools",
        element: <AITools />,
      },
      {
        path: "ai-commands",
        element: <AICommands />,
      },
      {
        path: "database-schema",
        element: <DatabaseSchema />,
      },
      {
        path: "/employee-dashboard",
        element: <EmployeeDashboard />,
      },
    ],
  },

  // Error routes
  {
    path: "*",
    element: <BlankLayout><NotFound /></BlankLayout>,
  },
];

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
}
