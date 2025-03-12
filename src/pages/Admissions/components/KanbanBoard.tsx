
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdmissionStatus, ADMISSION_STATUS_MAP, Admission } from '@/lib/types/admission';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  getAdmissionsByStatus: (status: AdmissionStatus) => Admission[];
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, status: AdmissionStatus) => void;
  handleDragStart: (e: React.DragEvent, admission: Admission) => void;
  onCardClick: (admission: Admission) => void;
  isLoading: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  getAdmissionsByStatus,
  handleDragOver,
  handleDrop,
  handleDragStart,
  onCardClick,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="kanban">
      <TabsContent value="kanban" className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-2">
          {Object.entries(ADMISSION_STATUS_MAP).map(([status, label]) => (
            <KanbanColumn 
              key={status}
              status={status as AdmissionStatus}
              label={label}
              admissions={getAdmissionsByStatus(status as AdmissionStatus)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onCardClick={onCardClick}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default KanbanBoard;
