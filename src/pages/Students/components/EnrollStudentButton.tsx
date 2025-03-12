
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { enrollmentService, classService } from '@/lib/supabase';
import { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

interface EnrollStudentButtonProps {
  student?: Student;
  studentId?: string;
  classId?: string;
  onEnrollmentCreated: () => Promise<void>;
}

const EnrollStudentButton = ({ 
  student, 
  studentId, 
  classId, 
  onEnrollmentCreated 
}: EnrollStudentButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(classId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load active classes
  const { data: classes = [], isLoading: isClassesLoading } = useQuery({
    queryKey: ['active-classes'],
    queryFn: async () => {
      const result = await classService.getAll();
      return result.filter(c => c.tinh_trang === 'active');
    }
  });

  useEffect(() => {
    if (classId) setSelectedClassId(classId);
  }, [classId]);

  const handleSubmit = async () => {
    if (!selectedClassId || !studentId) {
      toast({
        title: "Lỗi",
        description: !selectedClassId 
          ? "Vui lòng chọn lớp học" 
          : "Không tìm thấy thông tin học sinh",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await enrollmentService.create({
        hoc_sinh_id: studentId,
        lop_chi_tiet_id: selectedClassId,
        tinh_trang_diem_danh: 'pending'
      });
      
      toast({
        title: "Thành công",
        description: "Đã đăng ký học sinh vào lớp học"
      });
      
      setOpen(false);
      await onEnrollmentCreated();
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
              {student ? `Chọn lớp học để đăng ký học sinh ${student?.ten_hoc_sinh}` : 'Chọn lớp học để đăng ký'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lớp học</label>
              <Select 
                value={selectedClassId} 
                onValueChange={setSelectedClassId}
                disabled={isClassesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.ten_lop_full || cls.ten_lop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedClassId}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnrollStudentButton;
