import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Auth from './pages/Auth';
import Students from './pages/Students';
import StudentDetail from './pages/Students/StudentDetail';
import StudentForm from './pages/Students/StudentForm';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import EmployeeForm from './pages/Employees/EmployeeForm';
import ClassDetail from './pages/Classes/ClassDetail';
import ClassForm from './pages/Classes/ClassForm';
import Classes from './pages/Classes';
import Enrollments from './pages/Enrollments';
import TeachingSessionForm from './pages/Sessions/SessionForm';
import FacilityDetails from './pages/Facilities/FacilityDetails';
import FacilityForm from './pages/Facilities/FacilityForm';
import Facilities from './pages/Facilities';
import Finances from './pages/Finance';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/Tasks/TaskDetail';
import AssetDetails from './pages/Assets/AssetDetails';
import AssetForm from './pages/Assets/AssetForm';
import Assets from './pages/Assets';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/Contacts/ContactDetail';
import ContactForm from './pages/Contacts/ContactForm';
import ImageDetailView from './pages/Images/ImageDetailView';
import ImageUploadForm from './pages/Images/ImageUploadForm';
import Images from './pages/Images';
import Files from './pages/Files';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFound';
import BlankLayout from './layouts/BlankLayout';
import AuthLayout from './layouts/AuthLayout';
import TeacherSchedule from './pages/TeacherSchedule';
import Admissions from './pages/Admissions';
import KanbanView from './pages/Admissions/KanbanView';
import FinanceDetail from './pages/Finance/FinanceDetail';
import Attendance from './pages/Attendance';
import EmployeeAttendance from './pages/Attendance/EmployeeAttendance';
import StudentAttendance from './pages/Attendance/StudentAttendance';
import AITools from './pages/AITools';
import PersonalDashboard from './pages/PersonalDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ContractTemplateManagerPage from './pages/Employees/ContractTemplateManagerPage';
import Payroll from './pages/Payroll';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

const routes = [
  {
    path: "/",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    errorElement: <BlankLayout><NotFoundPage /></BlankLayout>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "my-dashboard", element: <PersonalDashboard /> },
      { path: "employee-dashboard", element: <EmployeeDashboard /> },
      { path: "students", element: <Students /> },
      { path: "students/:id", element: <StudentDetail /> },
      { path: "students/new", element: (
        <ProtectedRoute>
          <StudentForm 
            onSubmit={async () => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      )},
      { path: "students/:id/edit", element: (
        <ProtectedRoute>
          <StudentForm 
            onSubmit={async () => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      )},
      { path: "employees", element: <Employees /> },
      { path: "employees/:employeeId", element: <EmployeeDetail employeeId="" /> },
      { path: "employees/new", element: (
        <ProtectedRoute>
          <EmployeeForm 
            onSubmit={async () => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      )},
      { path: "employees/:id/edit", element: (
        <ProtectedRoute>
          <EmployeeForm 
            onSubmit={async () => {}} 
            onCancel={() => {}} 
          />
        </ProtectedRoute>
      )},
      { path: "employees/templates", element: <ContractTemplateManagerPage /> },
      { path: "classes", element: <Classes /> },
      { path: "classes/:id", element: <ClassDetail classItem={{} as any} /> },
      { path: "classes/add", element: <ClassForm onSubmit={() => {}} onCancel={() => {}} /> },
      { path: "classes/:id/edit", element: <ClassForm onSubmit={() => {}} onCancel={() => {}} /> },
      { path: "enrollments", element: <Enrollments /> },
      { path: "sessions/add", element: <TeachingSessionForm onSubmit={() => Promise.resolve()} onCancel={() => {}} /> },
      { path: "facilities", element: <Facilities /> },
      { path: "facilities/add", element: <FacilityForm /> },
      { path: "facilities/:facilityId", element: <FacilityDetails facilityId="" /> },
      { path: "assets", element: <Assets /> },
      { path: "assets/add", element: <AssetForm /> },
      { path: "assets/:id", element: <AssetDetails asset={{} as any} /> },
      { path: "contacts", element: <Contacts /> },
      { path: "contacts/add", element: <ContactForm /> },
      { path: "contacts/:id", element: <ContactDetail contact={{} as any} /> },
      { path: "images", element: <Images /> },
      { path: "images/add", element: <ImageUploadForm /> },
      { path: "images/:id", element: <ImageDetailView image={{} as any} /> },
      { path: "files", element: <Files /> },
      { path: "finances", element: <Finances /> },
      { path: "finances/:id", element: <FinanceDetail /> },
      { path: "tasks", element: <Tasks /> },
      { path: "tasks/:id", element: <TaskDetail /> },
      { path: "teacher-schedule", element: <TeacherSchedule /> },
      { path: "admissions", element: <Admissions /> },
      { path: "admissions/kanban", element: <KanbanView /> },
      { path: "attendance", element: <Attendance /> },
      { path: "attendance/employees", element: <EmployeeAttendance /> },
      { path: "attendance/students", element: <StudentAttendance /> },
      { path: "ai-tools", element: <AITools /> },
      { path: "payroll", element: <Payroll /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout><Auth /></AuthLayout>,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default createBrowserRouter(routes);
