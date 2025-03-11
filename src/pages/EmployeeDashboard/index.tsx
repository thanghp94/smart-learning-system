
import React from 'react';
import { CheckSquare, Calendar, Clock, Users } from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import TodayClassesList from './components/TodayClassesList';
import TodayAttendance from './components/TodayAttendance';
import QuickTasks from './components/QuickTasks';

const EmployeeDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Nhân Viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodayClassesList />
        <TodayAttendance />
        <QuickTasks />
        <AIAssistant />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
