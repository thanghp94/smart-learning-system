import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Pricing } from './pages/Pricing';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Classes } from './pages/Classes';
import { ClassDetail } from './pages/Classes/ClassDetail';
import { Admissions } from './pages/Admissions';
import { Tasks } from './pages/Tasks';
import { Files } from './pages/Files';
import { Finance } from './pages/Finance';
import { Employee } from './pages/Employee';
import { ContactList } from './pages/ContactList';
import { EmployeeDetail } from './pages/Employee/EmployeeDetail';
import { TeachingSchedules } from './pages/TeachingSchedules';
import { TeachingScheduleDetail } from './pages/TeachingSchedules/TeachingScheduleDetail';
import { TeachingSession } from './pages/TeachingSessions';
import { TeachingSessionDetail } from './pages/TeachingSessions/TeachingSessionDetail';
import { Student } from './pages/Student';
import { StudentDetail } from './pages/Student/StudentDetail';
import { Facility } from './pages/Facility';
import { FacilityDetail } from './pages/Facility/FacilityDetail';
import { NotFound } from './pages/NotFound';
import { Redirect } from './pages/Redirect';
import { Calendar } from './pages/Calendar';
import { EmployeeDashboard } from '@/pages/EmployeeDashboard';

const routes = [
  { path: '/', element: <Home />, key: 1 },
  { path: '/redirect', element: <Redirect />, key: 2 },
  { path: '/about', element: <About />, key: 3 },
  { path: '/contact', element: <Contact />, key: 4 },
  { path: '/pricing', element: <Pricing />, key: 5 },
  { path: '/terms', element: <Terms />, key: 6 },
  { path: '/privacy', element: <Privacy />, key: 7 },
  { path: '/classes', element: <Classes />, key: 8 },
  { path: '/classes/:id', element: <ClassDetail />, key: 9 },
  { path: '/admissions', element: <Admissions />, key: 10 },
  { path: '/tasks', element: <Tasks />, key: 11 },
  { path: '/files', element: <Files />, key: 12 },
  { path: '/finance', element: <Finance />, key: 13 },
  { path: '/employees', element: <Employee />, key: 14 },
  { path: '/employees/:id', element: <EmployeeDetail />, key: 15 },
  { path: '/teaching-schedules', element: <TeachingSchedules />, key: 16 },
  { path: '/teaching-schedules/:id', element: <TeachingScheduleDetail />, key: 17 },
  { path: '/teaching-sessions', element: <TeachingSession />, key: 18 },
  { path: '/teaching-sessions/:id', element: <TeachingSessionDetail />, key: 19 },
  { path: '/students', element: <Student />, key: 20 },
  { path: '/students/:id', element: <StudentDetail />, key: 21 },
  { path: '/facilities', element: <Facility />, key: 22 },
  { path: '/facilities/:id', element: <FacilityDetail />, key: 23 },
  { path: '/contacts', element: <ContactList />, key: 24 },
  { path: '/calendar', element: <Calendar />, key: 25 },
  {
    path: '/employee-dashboard',
    element: <EmployeeDashboard />,
  },
  { path: '*', element: <NotFound />, key: 26 },
];

export default routes;
