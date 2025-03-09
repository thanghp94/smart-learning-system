
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import Index from '@/pages/Index';
import Students from '@/pages/Students';
import StudentForm from '@/pages/Students/StudentForm';
import Employees from '@/pages/Employees';
import Classes from '@/pages/Classes';
import TeachingSessions from '@/pages/TeachingSessions';
import Assets from '@/pages/Assets';
import TransferManagement from '@/pages/Assets/TransferManagement';
import DatabaseSchema from '@/pages/DatabaseSchema';
import NotFound from '@/pages/NotFound';
import Evaluations from '@/pages/Evaluations';
import Facilities from '@/pages/Facilities';
import Events from '@/pages/Events';
import Tasks from '@/pages/Tasks';
import Enrollments from '@/pages/Enrollments';
import Images from '@/pages/Images';
import Settings from '@/pages/Settings';
import Payroll from '@/pages/Payroll';
import Finance from '@/pages/Finance';
import Files from '@/pages/Files';
import Requests from '@/pages/Requests';
import Contacts from '@/pages/Contacts';
import Lessons from '@/pages/Lessons';
import Sessions from '@/pages/Sessions';

import '@/App.css';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/add" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/teaching-sessions" element={<TeachingSessions />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/transfers" element={<TransferManagement />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/images" element={<Images />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/files" element={<Files />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/database-schema" element={<DatabaseSchema />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </DatabaseProvider>
  );
}

export default App;
