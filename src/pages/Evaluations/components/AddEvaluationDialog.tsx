
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EvaluationForm from '../EvaluationForm';
import { TeachingSession } from '@/lib/types';

interface AddEvaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TeachingSession>) => Promise<void>;
  initialData: TeachingSession;
}

const AddEvaluationDialog: React.FC<AddEvaluationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Thêm đánh giá mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin đánh giá giảng dạy mới
          </DialogDescription>
        </DialogHeader>
        <EvaluationForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEvaluationDialog;
