
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import Index from '@/pages/Index';
import Students from '@/pages/Students';
import Employees from '@/pages/Employees';
import Classes from '@/pages/Classes';
import TeachingSessions from '@/pages/TeachingSessions';
import NotFound from '@/pages/NotFound';

import '@/App.css';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <div>
          <MainLayout />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/students" element={<Students />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/teaching-sessions" element={<TeachingSessions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </DatabaseProvider>
  );
}

export default App;
