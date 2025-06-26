
import React from 'react';
import DetailPanel from '@/components/ui/DetailPanel';
import EvaluationForm from '../EvaluationForm';
import { Class, Employee, TeachingSession } from '@/lib/types';

interface EvaluationDetailPanelProps {
  evaluation: TeachingSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TeachingSession>) => Promise<void>;
  classInfo?: Class;
  teacherInfo?: Employee;
}

const EvaluationDetailPanel: React.FC<EvaluationDetailPanelProps> = ({
  evaluation,
  isOpen,
  onClose,
  onSubmit,
  classInfo,
  teacherInfo
}) => {
  if (!evaluation) return null;

  return (
    <DetailPanel
      title="Chi tiết đánh giá"
      isOpen={isOpen}
      onClose={onClose}
    >
      <EvaluationForm
        initialData={evaluation}
        onSubmit={onSubmit}
        onCancel={onClose}
        classInfo={classInfo}
        teacherInfo={teacherInfo}
      />
    </DetailPanel>
  );
};

export default EvaluationDetailPanel;
