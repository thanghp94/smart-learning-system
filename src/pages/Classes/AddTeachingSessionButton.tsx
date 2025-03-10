
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Class, TeachingSession } from '@/lib/types';
import { teachingSessionService } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SessionForm from '../TeachingSessions/SessionForm';

interface AddTeachingSessionButtonProps {
  classData: Class;
  onSuccess?: () => void;
}

const AddTeachingSessionButton: React.FC<AddTeachingSessionButtonProps> = ({ classData, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddSession = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (sessionData: Partial<TeachingSession>) => {
    try {
      setIsLoading(true);
      console.log('Creating teaching session for class:', classData.id);
      
      // Make sure to set the class ID
      const data = {
        ...sessionData,
        lop_chi_tiet_id: classData.id
      };
      
      await teachingSessionService.create(data);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm buổi học mới vào lớp',
      });
      
      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding teaching session:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm buổi học mới: ' + (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleAddSession}
      >
        <Calendar className="h-4 w-4 mr-1" />
        Thêm buổi học
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Buổi Học cho lớp: {classData.ten_lop_full}</DialogTitle>
            <DialogDescription>
              Nhập thông tin buổi học mới vào biểu mẫu bên dưới
            </DialogDescription>
          </DialogHeader>
          <SessionForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={{
              lop_chi_tiet_id: classData.id,
              giao_vien: classData.gv_chinh
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTeachingSessionButton;
