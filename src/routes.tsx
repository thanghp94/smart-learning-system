
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import { Spinner } from '@/components/ui/spinner';

// Layouts
const BlankLayout = lazy(() => import('./layouts/BlankLayout'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/Auth/Login'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPassword'));

// Dashboard Pages
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const EnumManagerPage = lazy(() => import('./pages/Settings/EnumManager'));
const EmployeesPage = lazy(() => import('./pages/Employees'));
const EmployeeDetailsPage = lazy(() => import('./pages/Employees/EmployeeDetails'));
const ClassesPage = lazy(() => import('./pages/Classes'));
const ClassDetailsPage = lazy(() => import('./pages/Classes/ClassDetails'));
const StudentsPage = lazy(() => import('./pages/Students'));
const StudentDetailsPage = lazy(() => import('./pages/Students/StudentDetails'));
const TeachingSessionsPage = lazy(() => import('./pages/TeachingSessions'));
const TeachingSessionDetailsPage = lazy(() => import('./pages/TeachingSessions/SessionDetails'));
const FacilitiesPage = lazy(() => import('./pages/Facilities'));
const FacilityDetailsPage = lazy(() => import('./pages/Facilities/FacilityDetails'));
const TasksPage = lazy(() => import('./pages/Tasks'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const AttendancePage = lazy(() => import('./pages/Attendance'));
const EmployeeFilesPage = lazy(() => import('./pages/EmployeeFiles'));
const AssetsPage = lazy(() => import('./pages/Assets'));
const AssetDetailsPage = lazy(() => import('./pages/Assets/AssetDetails'));
const EventsPage = lazy(() => import('./pages/Events'));
const ContactsPage = lazy(() => import('./pages/Contacts'));
const FinancesPage = lazy(() => import('./pages/Finances'));
const RequestsPage = lazy(() => import('./pages/Requests'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Route definitions
const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/enum-manager', element: <EnumManagerPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'employees/:id', element: <EmployeeDetailsPage /> },
      { path: 'classes', element: <ClassesPage /> },
      { path: 'classes/:id', element: <ClassDetailsPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'students/:id', element: <StudentDetailsPage /> },
      { path: 'teaching-sessions', element: <TeachingSessionsPage /> },
      { path: 'teaching-sessions/:id', element: <TeachingSessionDetailsPage /> },
      { path: 'facilities', element: <FacilitiesPage /> },
      { path: 'facilities/:id', element: <FacilityDetailsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'employee-files', element: <EmployeeFilesPage /> },
      { path: 'assets', element: <AssetsPage /> },
      { path: 'assets/:id', element: <AssetDetailsPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'finances', element: <FinancesPage /> },
      { path: 'requests', element: <RequestsPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '*',
    element: <BlankLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const getLoadingFallback = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export default routes;
