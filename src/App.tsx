import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import Assets from './pages/Assets';
import Classes from './pages/Classes';
import Contacts from './pages/Contacts';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Enrollments from './pages/Enrollments';
import Evaluations from './pages/Evaluations';
import Events from './pages/Events';
import Facilities from './pages/Facilities';
import Finance from './pages/Finance';
import Lessons from './pages/Lessons';
import Payroll from './pages/Payroll';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import Students from './pages/Students';
import Tasks from './pages/Tasks';
import TeachingSessions from './pages/TeachingSessions';
import Admissions from './pages/Admissions';
import Attendance from './pages/Attendance';
import FilesPage from './pages/Files';
import EmployeeDetailWrapper from './pages/Employees/components/EmployeeDetailWrapper';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/assets">Assets</Link>
            </li>
            <li>
              <Link to="/classes">Classes</Link>
            </li>
            <li>
              <Link to="/contacts">Contacts</Link>
            </li>
            <li>
              <Link to="/employees">Employees</Link>
            </li>
             <li>
              <Link to="/enrollments">Enrollments</Link>
            </li>
            <li>
              <Link to="/evaluations">Evaluations</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/facilities">Facilities</Link>
            </li>
            <li>
              <Link to="/finance">Finance</Link>
            </li>
             <li>
              <Link to="/lessons">Lessons</Link>
            </li>
            <li>
              <Link to="/payroll">Payroll</Link>
            </li>
            <li>
              <Link to="/requests">Requests</Link>
            </li>
            <li>
              <Link to="/sessions">Sessions</Link>
            </li>
            <li>
              <Link to="/students">Students</Link>
            </li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
            <li>
              <Link to="/teaching-sessions">Teaching Sessions</Link>
            </li>
            <li>
              <Link to="/admissions">Admissions</Link>
            </li>
            <li>
              <Link to="/attendance">Attendance</Link>
            </li>
            <li>
              <Link to="/files">Files</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/events" element={<Events />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/teaching-sessions" element={<TeachingSessions />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailWrapper employeeId={useParams<{ id: string }>().id || ''} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
