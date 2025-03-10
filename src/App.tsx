
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { DatabaseProvider } from '@/contexts/DatabaseContext';

// Layouts
import MainLayout from '@/components/layout/MainLayout';

// Routes
import Index from '@/pages/Index';
import Students from '@/pages/Students';
import StudentDetail from '@/pages/Students/StudentDetail';
import StudentFormContainer from '@/pages/Students/components/StudentFormContainer';
import Employees from '@/pages/Employees';
import EmployeeDetail from '@/pages/Employees/EmployeeDetail';
import EmployeeForm from '@/pages/Employees/EmployeeForm';
import Classes from '@/pages/Classes';
import ClassDetail from '@/pages/Classes/ClassDetail';
import ClassForm from '@/pages/Classes/ClassForm';
import Facilities from '@/pages/Facilities';
import FacilityDetail from '@/pages/Facilities/FacilityDetail';
import FacilityForm from '@/pages/Facilities/FacilityForm';
import TeachingSessions from '@/pages/TeachingSessions';
import SessionDetail from '@/pages/TeachingSessions/SessionDetail';
import TeachingSessionForm from '@/pages/TeachingSessions/TeachingSessionForm';
import Sessions from '@/pages/Sessions';
import SessionForm from '@/pages/Sessions/SessionForm';
import Events from '@/pages/Events';
import EventForm from '@/pages/Events/EventForm';
import Enrollments from '@/pages/Enrollments';
import Tasks from '@/pages/Tasks';
import TaskDetail from '@/pages/Tasks/TaskDetail';
import TaskForm from '@/pages/Tasks/TaskForm';
import Lessons from '@/pages/Lessons';
import LessonDetail from '@/pages/Lessons/LessonDetail';
import LessonForm from '@/pages/Lessons/LessonForm';
import Evaluations from '@/pages/Evaluations';
import EvaluationForm from '@/pages/Evaluations/EvaluationForm';
import Finance from '@/pages/Finance';
import FinanceForm from '@/pages/Finance/FinanceForm';
import FinanceDetail from '@/pages/Finance/FinanceDetail';
import Images from '@/pages/Images';
import Files from '@/pages/Files';
import FileForm from '@/pages/Files/FileForm';
import Contacts from '@/pages/Contacts';
import ContactDetail from '@/pages/Contacts/ContactDetail';
import ContactForm from '@/pages/Contacts/ContactForm';
import Assets from '@/pages/Assets';
import AssetDetail from '@/pages/Assets/AssetDetail';
import AssetForm from '@/pages/Assets/AssetForm';
import Requests from '@/pages/Requests';
import Payroll from '@/pages/Payroll';
import PayrollForm from '@/pages/Payroll/PayrollForm';
import NotFound from '@/pages/NotFound';
import DatabaseSchema from '@/pages/DatabaseSchema';
import ContractTemplateManagerPage from '@/pages/Employees/ContractTemplateManagerPage';
import Attendance from '@/pages/Attendance';
import TeacherSchedule from '@/pages/TeacherSchedule';
import Settings from '@/pages/Settings';
import EnumManager from '@/pages/Settings/EnumManager';
import AssetTransfer from '@/pages/Assets/AssetTransfer';
import TransferManagement from '@/pages/Assets/TransferManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="students" element={<Students />} />
              <Route path="students/:id" element={<StudentDetail />} />
              <Route path="students/add" element={<StudentFormContainer isAdd={true} />} />
              <Route path="students/edit/:id" element={<StudentFormContainer />} />
              
              <Route path="employees" element={<Employees />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="employees/add" element={<EmployeeForm />} />
              <Route path="employees/edit/:id" element={<EmployeeForm />} />
              <Route path="employees/contracts" element={<ContractTemplateManagerPage />} />
              
              <Route path="classes" element={<Classes />} />
              <Route path="classes/:id" element={<ClassDetail />} />
              <Route path="classes/add" element={<ClassForm />} />
              <Route path="classes/edit/:id" element={<ClassForm />} />
              
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:id" element={<FacilityDetail />} />
              <Route path="facilities/add" element={<FacilityForm />} />
              <Route path="facilities/edit/:id" element={<FacilityForm />} />
              
              <Route path="teaching-sessions" element={<TeachingSessions />} />
              <Route path="teaching-sessions/:id" element={<SessionDetail />} />
              <Route path="teaching-sessions/add" element={<TeachingSessionForm />} />
              <Route path="teaching-sessions/edit/:id" element={<TeachingSessionForm />} />
              
              <Route path="sessions" element={<Sessions />} />
              <Route path="sessions/add" element={<SessionForm />} />
              <Route path="sessions/edit/:id" element={<SessionForm />} />
              
              <Route path="events" element={<Events />} />
              <Route path="events/add" element={<EventForm />} />
              <Route path="events/edit/:id" element={<EventForm />} />
              
              <Route path="enrollments" element={<Enrollments />} />
              
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/:id" element={<TaskDetail />} />
              <Route path="tasks/add" element={<TaskForm />} />
              <Route path="tasks/edit/:id" element={<TaskForm />} />
              
              <Route path="lessons" element={<Lessons />} />
              <Route path="lessons/:id" element={<LessonDetail />} />
              <Route path="lessons/add" element={<LessonForm />} />
              <Route path="lessons/edit/:id" element={<LessonForm />} />
              
              <Route path="evaluations" element={<Evaluations />} />
              <Route path="evaluations/add" element={<EvaluationForm />} />
              <Route path="evaluations/edit/:id" element={<EvaluationForm />} />
              
              <Route path="finance" element={<Finance />} />
              <Route path="finance/:id" element={<FinanceDetail />} />
              <Route path="finance/add" element={<FinanceForm />} />
              <Route path="finance/edit/:id" element={<FinanceForm />} />
              
              <Route path="images" element={<Images />} />
              
              <Route path="files" element={<Files />} />
              <Route path="files/add" element={<FileForm />} />
              <Route path="files/edit/:id" element={<FileForm />} />
              
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="contacts/add" element={<ContactForm />} />
              <Route path="contacts/edit/:id" element={<ContactForm />} />
              
              <Route path="assets" element={<Assets />} />
              <Route path="assets/:id" element={<AssetDetail />} />
              <Route path="assets/add" element={<AssetForm />} />
              <Route path="assets/edit/:id" element={<AssetForm />} />
              <Route path="assets/transfer" element={<AssetTransfer />} />
              <Route path="assets/transfer-management" element={<TransferManagement />} />
              
              <Route path="requests" element={<Requests />} />
              
              <Route path="payroll" element={<Payroll />} />
              <Route path="payroll/add" element={<PayrollForm />} />
              <Route path="payroll/edit/:id" element={<PayrollForm />} />
              
              <Route path="attendance" element={<Attendance />} />
              <Route path="teacher-schedule" element={<TeacherSchedule />} />
              <Route path="settings" element={<Settings />} />
              
              <Route path="database-schema" element={<DatabaseSchema />} />
              
              {/* Enum Manager Route */}
              <Route path="settings/enum-manager" element={<EnumManager />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </DatabaseProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
