
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePersonalDashboardData } from './hooks/usePersonalDashboardData';
import EmployeeInfo from './components/EmployeeInfo';
import StatsCards from './components/StatsCards';
import TasksPanel from './components/TasksPanel';
import RequestsPanel from './components/RequestsPanel';
import AdditionalInfoCards from './components/AdditionalInfoCards';
import NewTaskDialog from './components/NewTaskDialog';
import NewRequestDialog from './components/NewRequestDialog';

const PersonalDashboard = () => {
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  
  const {
    employee,
    tasks,
    requests,
    isLoading,
    fetchPersonalData,
    handleTaskCreated,
    handleRequestCreated
  } = usePersonalDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {employee && (
        <>
          <div className="mb-8">
            <EmployeeInfo employee={employee} />
            <StatsCards />
          </div>

          <ResizablePanelGroup 
            direction="horizontal" 
            className="mb-8 rounded-lg border"
          >
            <ResizablePanel defaultSize={50} minSize={30}>
              <TasksPanel 
                tasks={tasks} 
                onRefresh={fetchPersonalData} 
                onAddNew={() => setShowNewTaskDialog(true)} 
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <RequestsPanel 
                requests={requests} 
                onRefresh={fetchPersonalData} 
                onAddNew={() => setShowNewRequestDialog(true)} 
              />
            </ResizablePanel>
          </ResizablePanelGroup>

          <AdditionalInfoCards />

          {/* Dialogs */}
          <NewTaskDialog 
            isOpen={showNewTaskDialog} 
            onClose={() => setShowNewTaskDialog(false)}
            onTaskCreated={handleTaskCreated}
          />
          
          <NewRequestDialog
            isOpen={showNewRequestDialog}
            onClose={() => setShowNewRequestDialog(false)}
            onRequestCreated={handleRequestCreated}
          />
        </>
      )}
    </div>
  );
};

export default PersonalDashboard;
