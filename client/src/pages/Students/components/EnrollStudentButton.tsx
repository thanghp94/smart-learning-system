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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} size="sm">
        {classId ? 'Thêm ghi danh' : 'Ghi danh'}
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi danh học sinh</DialogTitle>
          <DialogDescription>
            {student ? `Ghi danh ${student.ho_va_ten || student.ten_hoc_sinh} vào lớp học` : 'Chọn học sinh và lớp học để ghi danh'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!student && !studentId && (
            <div>
              <label className="text-sm font-medium">Học sinh</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học sinh" />
                </SelectTrigger>
                <SelectContent>
                  {isStudentsLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.ho_va_ten || student.ten_hoc_sinh}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {!classId && (
            <div>
              <label className="text-sm font-medium">Lớp học</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  {isClassesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.ten_lop_full || cls.ten_lop}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollStudentButton;