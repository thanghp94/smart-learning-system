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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout><div /></AuthLayout>}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Dashboard routes */}
      <Route path="/" element={<DashboardLayout><div /></DashboardLayout>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="classes" element={<Classes />} />
        <Route path="classes/:id" element={<ClassDetails />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="teaching-sessions/:id" element={<SessionDetails />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="facilities/:id" element={<FacilityDetails />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="employee-files" element={<EmployeeFiles />} />
        <Route path="assets/:id" element={<AssetDetails />} />
        <Route path="finances" element={<Finances />} />
        <Route path="ai-tools" element={<AITools />} />
        <Route path="ai-commands" element={<AICommands />} />
        <Route path="database-schema" element={<DatabaseSchema />} />
      </Route>

      {/* Error routes */}
      <Route path="*" element={<BlankLayout><NotFound /></BlankLayout>} />
    </Routes>
  );
}
