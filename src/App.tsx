
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Students from "@/pages/Students";
import Classes from "@/pages/Classes";
import Employees from "@/pages/Employees";
import Facilities from "@/pages/Facilities";
import Events from "@/pages/Events";
import Tasks from "@/pages/Tasks";
import TeachingSessions from "@/pages/TeachingSessions";
import Lessons from "@/pages/Lessons";
import Enrollments from "@/pages/Enrollments";
import Images from "@/pages/Images";
import Evaluations from "@/pages/Evaluations";
import Files from "@/pages/Files";
import Contacts from "@/pages/Contacts";
import Assets from "@/pages/Assets";
import Finance from "@/pages/Finance";
import Requests from "@/pages/Requests";
import DatabaseSchema from "@/pages/DatabaseSchema";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="employees" element={<Employees />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="teaching-sessions" element={<TeachingSessions />} />
          <Route path="events" element={<Events />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="files" element={<Files />} />
          <Route path="images" element={<Images />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="assets" element={<Assets />} />
          <Route path="finance" element={<Finance />} />
          <Route path="requests" element={<Requests />} />
          <Route path="database-schema" element={<DatabaseSchema />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
