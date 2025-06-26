
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ClassForm from '../ClassForm';
import { Class } from '@/lib/types';

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: Partial<Class>) => Promise<void>;
  onCancel: () => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm Lớp Học Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin lớp học mới vào mẫu dưới đây
          </DialogDescription>
        </DialogHeader>
        <ClassForm 
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
