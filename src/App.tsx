
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import Index from '@/pages/Index';
import Students from '@/pages/Students';
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
