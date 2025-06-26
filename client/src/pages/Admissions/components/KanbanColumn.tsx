
import React from 'react';
import { Admission, AdmissionStatus } from '@/lib/types/admission';
import AdmissionCard from './AdmissionCard';

interface KanbanColumnProps {
  status: AdmissionStatus;
  label: string;
  admissions: Admission[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: AdmissionStatus) => void;
  onCardClick: (admission: Admission) => void;
  onDragStart: (e: React.DragEvent, admission: Admission) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  label,
  admissions,
  onDragOver,
  onDrop,
  onCardClick,
  onDragStart
}) => {
  return (
    <div 
      className="bg-gray-50 rounded-lg p-2 flex flex-col" 
      style={{
        maxHeight: 'calc(100vh - 13rem)',
        height: 'calc(100vh - 13rem)'
      }}
      onDragOver={onDragOver}
      onDrop={e => onDrop(e, status)}
    >
      <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-50 p-1 z-10 border-b">
        <h3 className="font-medium text-gray-800">{label}</h3>
        <span className="text-sm font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
          {admissions?.length || 0}
        </span>
      </div>
      <div className="overflow-y-auto flex-grow space-y-1.5 pr-1">
        {admissions?.map(admission => (
          <AdmissionCard 
            key={admission.id} 
            admission={admission} 
            onClick={onCardClick}
            onDragStart={onDragStart}
          />
        ))}
        {admissions?.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Không có học sinh nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
