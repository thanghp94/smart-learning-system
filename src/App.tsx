
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import Index from '@/pages/Index';
import Students from '@/pages/Students';
import Employees from '@/pages/Employees';
import Classes from '@/pages/Classes';
import TeachingSessions from '@/pages/TeachingSessions';
import Assets from '@/pages/Assets';
import TransferManagement from '@/pages/Assets/TransferManagement';
import DatabaseSchema from '@/pages/DatabaseSchema';
import NotFound from '@/pages/NotFound';
import Evaluations from '@/pages/Evaluations';
import Facilities from '@/pages/Facilities';

import '@/App.css';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="/students" element={<Students />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/teaching-sessions" element={<TeachingSessions />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/transfers" element={<TransferManagement />} />
            <Route path="/facilities" element={<Facilities />} />
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
