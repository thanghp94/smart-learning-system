
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
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
      <div className="flex flex-col min-h-screen">
        <nav className="bg-slate-800 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold mb-4">Smart Learning System</h1>
            <ul className="flex flex-wrap gap-4">
              <li>
                <Link to="/" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link to="/assets" className="hover:underline">Assets</Link>
              </li>
              <li>
                <Link to="/classes" className="hover:underline">Classes</Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:underline">Contacts</Link>
              </li>
              <li>
                <Link to="/employees" className="hover:underline">Employees</Link>
              </li>
              <li>
                <Link to="/enrollments" className="hover:underline">Enrollments</Link>
              </li>
              <li>
                <Link to="/evaluations" className="hover:underline">Evaluations</Link>
              </li>
              <li>
                <Link to="/events" className="hover:underline">Events</Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:underline">Facilities</Link>
              </li>
              <li>
                <Link to="/finance" className="hover:underline">Finance</Link>
              </li>
              <li>
                <Link to="/lessons" className="hover:underline">Lessons</Link>
              </li>
              <li>
                <Link to="/payroll" className="hover:underline">Payroll</Link>
              </li>
              <li>
                <Link to="/requests" className="hover:underline">Requests</Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:underline">Sessions</Link>
              </li>
              <li>
                <Link to="/students" className="hover:underline">Students</Link>
              </li>
              <li>
                <Link to="/tasks" className="hover:underline">Tasks</Link>
              </li>
              <li>
                <Link to="/teaching-sessions" className="hover:underline">Teaching Sessions</Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:underline">Admissions</Link>
              </li>
              <li>
                <Link to="/attendance" className="hover:underline">Attendance</Link>
              </li>
              <li>
                <Link to="/files" className="hover:underline">Files</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-grow bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetailWrapper />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-800 text-white p-4 text-center">
          <p>© 2024 Smart Learning System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
