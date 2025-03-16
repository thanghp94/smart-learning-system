
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task } from '@/lib/types';
import TaskForm from '@/pages/Tasks/components/TaskForm';

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({ 
  isOpen, 
  onClose,
  onTaskCreated
}) => {
  const handleFormSubmit = () => {
    // The TaskForm component will handle the actual submission
    // We just need to notify our parent that the task has been created
    const newTask = {
      id: `temp-${Date.now()}`,
      ten_viec: "Công việc mới",
      dien_giai: "Mô tả công việc mới",
      trang_thai: "pending",
      cap_do: "medium",
      ngay_den_han: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      nguoi_phu_trach: "123", // Current user ID
      loai_viec: "admin",
      doi_tuong: "task",
      doi_tuong_id: "0"
    } as Task;
    
    onTaskCreated(newTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm công việc mới</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết công việc cần thực hiện
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm 
          onSubmit={handleFormSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
