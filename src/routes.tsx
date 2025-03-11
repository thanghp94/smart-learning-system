
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import your layouts and pages
import App from './App';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import ClassDetail from './pages/Classes/ClassDetail';
import Students from './pages/Students';
import Employees from './pages/Employees'; 
import Contacts from './pages/Contacts';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import TeachingSchedules from './pages/TeachingSchedules';
import TeachingSessions from './pages/TeachingSessions';
import SessionDetail from './pages/TeachingSessions/SessionDetail';
import StudentDetail from './pages/Students/StudentDetail';
import Facilities from './pages/Facilities';
import FacilityDetail from './pages/Facilities/FacilityDetail';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/classes', element: <Classes /> },
          { path: '/classes/:id', element: <ClassDetail classItem={{id: '', ten_lop: '', ten_lop_full: ''}} /> },
          { path: '/students', element: <Students /> },
          { path: '/students/:id', element: <StudentDetail /> },
          { path: '/employees', element: <Employees /> },
          { path: '/employees/:id', element: <EmployeeDetail employeeId="" /> },
          { path: '/facilities', element: <Facilities /> },
          { path: '/facilities/:id', element: <FacilityDetail facilityId="" /> },
          { path: '/teaching-schedules', element: <TeachingSchedules /> },
          { path: '/teaching-sessions', element: <TeachingSessions /> },
          { path: '/teaching-sessions/:id', element: <SessionDetail session={{id: '', loai_bai_hoc: ''}} /> },
          { path: '/contacts', element: <Contacts /> },
          { path: '/assets/:id', element: <div>Asset Detail Page</div> }
        ],
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
