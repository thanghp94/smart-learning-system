
import React from 'react';
import AIAssistant from './components/AIAssistant';
import TasksOverview from './components/TasksOverview';
import TodayAttendanceCard from './components/TodayAttendanceCard';
import TodayClassesList from './components/TodayClassesList';

const EmployeeDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển nhân viên</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodayAttendanceCard />
        <TodayClassesList />
        <TasksOverview />
        <AIAssistant />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
