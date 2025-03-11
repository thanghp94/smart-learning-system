
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

// Define dummy placeholder components for missing modules
const DashboardLayout = () => <div>Dashboard Layout</div>;
const AuthLayout = () => <div>Auth Layout</div>;
const BlankLayout = () => <div>Blank Layout</div>;

// Auth Pages (placeholders)
const LoginPage = () => <div>Login Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;

// Dashboard Pages (placeholders)
const DashboardPage = () => <div>Dashboard Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const EnumManagerPage = () => <div>Enum Manager Page</div>;
const EmployeesPage = () => <div>Employees Page</div>;
const EmployeeDetailsPage = () => <div>Employee Details Page</div>;
const ClassesPage = () => <div>Classes Page</div>;
const ClassDetailsPage = () => <div>Class Details Page</div>;
const StudentsPage = () => <div>Students Page</div>;
const StudentDetailsPage = () => <div>Student Details Page</div>;
const TeachingSessionsPage = () => <div>Teaching Sessions Page</div>;
const TeachingSessionDetailsPage = () => <div>Teaching Session Details Page</div>;
const FacilitiesPage = () => <div>Facilities Page</div>;
const FacilityDetailsPage = () => <div>Facility Details Page</div>;
const TasksPage = () => <div>Tasks Page</div>;
const CalendarPage = () => <div>Calendar Page</div>;
const AttendancePage = () => <div>Attendance Page</div>;
const EmployeeFilesPage = () => <div>Employee Files Page</div>;
const AssetsPage = () => <div>Assets Page</div>;
const AssetDetailsPage = () => <div>Asset Details Page</div>;
const EventsPage = () => <div>Events Page</div>;
const ContactsPage = () => <div>Contacts Page</div>;
const FinancesPage = () => <div>Finances Page</div>;
const RequestsPage = () => <div>Requests Page</div>;
const NotFoundPage = () => <div>Not Found Page</div>;

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
