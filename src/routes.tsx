
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import ClassDetail from './pages/Classes/ClassDetail';
import Admissions from './pages/Admissions';
import Tasks from './pages/Tasks';
import Files from './pages/Files';
import Finance from './pages/Finance';
import Employee from './pages/Employee';
import ContactList from './pages/ContactList';
import EmployeeDetail from './pages/Employee/EmployeeDetail';
import TeachingSchedule from './pages/TeachingSchedules';
import TeachingScheduleDetail from './pages/TeachingSchedules/TeachingScheduleDetail';
import TeachingSessions from './pages/TeachingSessions';
import TeachingSessionDetail from './pages/TeachingSessions/TeachingSessionDetail';
import Student from './pages/Student';
import StudentDetail from './pages/Student/StudentDetail';
import Facility from './pages/Facility';
import FacilityDetail from './pages/Facility/FacilityDetail';
import NotFound from './pages/NotFound';
import Redirect from './pages/Redirect';
import Calendar from './pages/Calendar';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import Assets from './pages/Assets';
import AssetDetail from './pages/Assets/AssetDetail';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/classes/:id" element={<ClassDetail />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/files" element={<Files />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/employees" element={<Employee />} />
      <Route path="/employees/:id" element={<EmployeeDetail />} />
      <Route path="/contacts" element={<ContactList />} />
      <Route path="/teaching-schedules" element={<TeachingSchedule />} />
      <Route path="/teaching-schedules/:id" element={<TeachingScheduleDetail />} />
      <Route path="/teaching-sessions" element={<TeachingSessions />} />
      <Route path="/teaching-sessions/:id" element={<TeachingSessionDetail />} />
      <Route path="/students" element={<Student />} />
      <Route path="/students/:id" element={<StudentDetail />} />
      <Route path="/facilities" element={<Facility />} />
      <Route path="/facilities/:id" element={<FacilityDetail />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/assets/:id" element={<AssetDetail />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/redirect" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
