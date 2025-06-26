
import React from 'react';
import DetailPanel from '@/components/ui/DetailPanel';
import ClassDetail from '../ClassDetail';
import { Class } from '@/lib/types';

interface ClassDetailPanelProps {
  classItem: Class | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClassDetailPanel: React.FC<ClassDetailPanelProps> = ({ 
  classItem, 
  isOpen, 
  onClose 
}) => {
  if (!classItem) return null;
  
  return (
    <DetailPanel
      title="Thông Tin Lớp Học"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ClassDetail classItem={classItem} />
    </DetailPanel>
  );
};

export default ClassDetailPanel;
