import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

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
import Admissions from '@/pages/Admissions';

// AI Tools import
import AITools from '@/pages/AITools';
import ImageGenerator from '@/pages/AITools/ImageGenerator';

// Wrapper components to fix prop passing for routes
const EmployeeDetailWrapper = () => <EmployeeDetail employeeId="0" />;
const EmployeeFormWrapper = () => <EmployeeForm onSubmit={async () => {}} />;
const ClassDetailWrapper = () => <ClassDetail classItem={{} as any} />;
const ClassFormWrapper = () => <ClassForm onSubmit={async () => {}} onCancel={() => {}} />;
const FacilityDetailWrapper = () => <FacilityDetail facilityId="0" />;
const FacilityFormWrapper = () => <FacilityForm onSubmit={async () => {}} />;
const SessionDetailWrapper = () => <SessionDetail session={{} as any} />;
const TeachingSessionFormWrapper = () => <TeachingSessionForm onSubmit={async (data) => {}} onCancel={() => {}} />;
const SessionFormWrapper = () => <SessionForm onSubmit={async () => {}} onCancel={() => {}} />;
const EventFormWrapper = () => <EventForm onSubmit={async () => {}} onCancel={() => {}} />;
const TaskDetailWrapper = () => <TaskDetail task={{} as any} />;
const TaskFormWrapper = () => <TaskForm onSubmit={async () => {}} onCancel={() => {}} />;
const LessonDetailWrapper = () => <LessonDetail lesson={{} as any} />;
const LessonFormWrapper = () => <LessonForm onSubmit={async () => {}} onCancel={() => {}} />;
const EvaluationFormWrapper = () => <EvaluationForm initialData={{} as any} onSubmit={async () => {}} />;
const FinanceDetailWrapper = () => <FinanceDetail finance={{} as any} />;
const FinanceFormWrapper = () => <FinanceForm onSubmit={async (formData) => {}} onCancel={() => {}} />;
const FileFormWrapper = () => <FileForm onSubmit={async () => {}} onCancel={() => {}} />;
const ContactDetailWrapper = () => <ContactDetail contact={{} as any} />;
const ContactFormWrapper = () => <ContactForm onSubmit={async () => {}} onCancel={() => {}} />;
const AssetDetailWrapper = () => <AssetDetail asset={{} as any} />;
const AssetFormWrapper = () => <AssetForm onSubmit={async () => {}} onCancel={() => {}} />;
const AssetTransferWrapper = () => <AssetTransfer asset={{} as any} onTransferComplete={() => {}} />;
const PayrollFormWrapper = () => <PayrollForm onSubmit={async () => {}} onCancel={() => {}} />;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="students/add" element={<StudentFormContainer isAdd={true} />} />
            <Route path="students/edit/:id" element={<StudentFormContainer />} />
            
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetailWrapper />} />
            <Route path="employees/add" element={<EmployeeFormWrapper />} />
            <Route path="employees/edit/:id" element={<EmployeeFormWrapper />} />
            <Route path="employees/contracts" element={<ContractTemplateManagerPage />} />
            
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetailWrapper />} />
            <Route path="classes/add" element={<ClassFormWrapper />} />
            <Route path="classes/edit/:id" element={<ClassFormWrapper />} />
            
            <Route path="facilities" element={<Facilities />} />
            <Route path="facilities/:id" element={<FacilityDetailWrapper />} />
            <Route path="facilities/add" element={<FacilityFormWrapper />} />
            <Route path="facilities/edit/:id" element={<FacilityFormWrapper />} />
            
            <Route path="teaching-sessions" element={<TeachingSessions />} />
            <Route path="teaching-sessions/:id" element={<SessionDetailWrapper />} />
            <Route path="teaching-sessions/add" element={<TeachingSessionFormWrapper />} />
            <Route path="teaching-sessions/edit/:id" element={<TeachingSessionFormWrapper />} />
            
            <Route path="sessions" element={<Sessions />} />
            <Route path="sessions/add" element={<SessionFormWrapper />} />
            <Route path="sessions/edit/:id" element={<SessionFormWrapper />} />
            
            <Route path="events" element={<Events />} />
            <Route path="events/add" element={<EventFormWrapper />} />
            <Route path="events/edit/:id" element={<EventFormWrapper />} />
            
            <Route path="enrollments" element={<Enrollments />} />
            
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskDetailWrapper />} />
            <Route path="tasks/add" element={<TaskFormWrapper />} />
            <Route path="tasks/edit/:id" element={<TaskFormWrapper />} />
            
            <Route path="lessons" element={<Lessons />} />
            <Route path="lessons/:id" element={<LessonDetailWrapper />} />
            <Route path="lessons/add" element={<LessonFormWrapper />} />
            <Route path="lessons/edit/:id" element={<LessonFormWrapper />} />
            
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="evaluations/add" element={<EvaluationFormWrapper />} />
            <Route path="evaluations/edit/:id" element={<EvaluationFormWrapper />} />
            
            <Route path="finance" element={<Finance />} />
            <Route path="finance/:id" element={<FinanceDetailWrapper />} />
            <Route path="finance/add" element={<FinanceFormWrapper />} />
            <Route path="finance/edit/:id" element={<FinanceFormWrapper />} />
            
            <Route path="images" element={<Images />} />
            
            <Route path="files" element={<Files />} />
            <Route path="files/add" element={<FileFormWrapper />} />
            <Route path="files/edit/:id" element={<FileFormWrapper />} />
            
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetailWrapper />} />
            <Route path="contacts/add" element={<ContactFormWrapper />} />
            <Route path="contacts/edit/:id" element={<ContactFormWrapper />} />
            
            <Route path="assets" element={<Assets />} />
            <Route path="assets/:id" element={<AssetDetailWrapper />} />
            <Route path="assets/add" element={<AssetFormWrapper />} />
            <Route path="assets/edit/:id" element={<AssetFormWrapper />} />
            <Route path="assets/transfer" element={<AssetTransferWrapper />} />
            <Route path="assets/transfer-management" element={<TransferManagement />} />
            
            <Route path="requests" element={<Requests />} />
            
            <Route path="payroll" element={<Payroll />} />
            <Route path="payroll/add" element={<PayrollFormWrapper />} />
            <Route path="payroll/edit/:id" element={<PayrollFormWrapper />} />
            
            <Route path="attendance" element={<Attendance />} />
            <Route path="teacher-schedule" element={<TeacherSchedule />} />
            <Route path="settings" element={<Settings />} />
            
            <Route path="database-schema" element={<DatabaseSchema />} />
            
            <Route path="enum-manager" element={<EnumManager />} />
            <Route path="ai-tools" element={<AITools />} />
            <Route path="ai-tools/image-generator" element={<ImageGenerator />} />
            <Route path="admissions" element={<Admissions />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
