
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/Admin';
import TableManager from '@/pages/Admin/TableManager';
import SQLRunner from '@/pages/Admin/SQLRunner';
import SchemaViewer from '@/pages/Admin/SchemaViewer';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/table/:tableName" element={<TableManager />} />
      <Route path="/sql" element={<SQLRunner />} />
      <Route path="/schema" element={<SchemaViewer />} />
    </Routes>
  );
}

export default AdminRoutes;
