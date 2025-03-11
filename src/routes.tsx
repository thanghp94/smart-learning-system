
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/Employees/EmployeeDetails';
import Login from './pages/Auth/Login';
import TeachingSchedules from './pages/TeachingSchedules';
import TeachingSessions from './pages/TeachingSessions';
import Students from './pages/Students';
import StudentDetails from './pages/Students/StudentDetails';
import Facilities from './pages/Facilities';
import FacilityDetails from './pages/Facilities/FacilityDetails';
import NotFound from './pages/NotFound';
import Classes from './pages/Classes';
import ClassDetail from './pages/Classes/ClassDetail';
import Assets from './pages/Assets';
import AssetDetails from './pages/Assets/AssetDetails';
import Tasks from './pages/Tasks';
import Files from './pages/Files';
import Events from './pages/Events';
import Images from './pages/Images';
import ImageDetailView from './pages/Images/ImageDetailView';
import Settings from './pages/Settings';
import Requests from './pages/Requests';
import Attendance from './pages/Attendance';
import Contact from './pages/Contacts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'personal-dashboard', element: <PersonalDashboard /> },
      { path: 'employee-dashboard', element: <EmployeeDashboard /> },
      { path: 'employees', element: <Employees /> },
      { path: 'employees/:id', element: <EmployeeDetails /> },
      { path: 'teaching-schedules', element: <TeachingSchedules /> },
      { path: 'teaching-sessions', element: <TeachingSessions /> },
      { path: 'classes', element: <Classes /> },
      { path: 'classes/:id', element: <ClassDetail /> },
      { path: 'students', element: <Students /> },
      { path: 'students/:id', element: <StudentDetails /> },
      { path: 'facilities', element: <Facilities /> },
      { path: 'facilities/:id', element: <FacilityDetails /> },
      { path: 'assets', element: <Assets /> },
      { path: 'assets/:id', element: <AssetDetails /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'files', element: <Files /> },
      { path: 'events', element: <Events /> },
      { path: 'images', element: <Images /> },
      { path: 'images/:id', element: <ImageDetailView /> },
      { path: 'settings', element: <Settings /> },
      { path: 'requests', element: <Requests /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'contacts', element: <Contact /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
