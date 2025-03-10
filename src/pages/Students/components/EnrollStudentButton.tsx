
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { enrollmentService, classService } from '@/lib/supabase';
import { Class, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface EnrollStudentButtonProps {
  student: Student;
  onEnrollmentComplete: () => void;
}

const EnrollStudentButton: React.FC<EnrollStudentButtonProps> = ({ student, onEnrollmentComplete }) => {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const result = await classService.getAll();
      // Filter for active classes only
      return result.filter(c => c.tinh_trang === 'active');
    }
  });

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn lớp học",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const enrollmentData = {
        hoc_sinh_id: student.id,
        lop_chi_tiet_id: selectedClassId,
        tinh_trang_diem_danh: 'pending'
      };

      await enrollmentService.create(enrollmentData);
      
      toast({
        title: "Thành công",
        description: "Đã đăng ký học sinh vào lớp học"
      });
      
      setOpen(false);
      onEnrollmentComplete();
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng ký học sinh. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Đăng ký vào lớp</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký học sinh vào lớp</DialogTitle>
            <DialogDescription>
              Chọn lớp học để đăng ký học sinh {student.ten_hoc_sinh}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lớp học</label>
              <Select 
                value={selectedClassId} 
                onValueChange={setSelectedClassId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: Class) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.ten_lop_full || cls.ten_lop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedClassId}>
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnrollStudentButton;
