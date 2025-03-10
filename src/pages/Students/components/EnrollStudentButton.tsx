
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { enrollmentService, classService, studentService } from '@/lib/supabase';
import { Class, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface EnrollStudentButtonProps {
  student?: any;
  studentId?: string;
  classId?: string;
  onEnrollmentCreated: () => Promise<void>;
}

const EnrollStudentButton: React.FC<EnrollStudentButtonProps> = ({ student, studentId, classId, onEnrollmentCreated }) => {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(classId || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load pre-selected class or all classes if no class provided
  const { data: classes = [], isLoading: isClassesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const result = await classService.getAll();
      // Filter for active classes only
      return result.filter(c => c.tinh_trang === 'active');
    }
  });

  // Only load students if we don't have a student already and selectedClassId is empty
  // This is for when classId is provided but studentId is not
  const { data: students = [], isLoading: isStudentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const result = await studentService.getAll();
      // Filter for active students only
      return result.filter(s => s.trang_thai === 'active');
    },
    // Only run this query if we need to select a student
    enabled: !studentId && !!classId
  });

  useEffect(() => {
    if (classId) {
      setSelectedClassId(classId);
    }
    if (studentId) {
      setSelectedStudentId(studentId);
    }
  }, [classId, studentId]);

  const handleSubmit = async () => {
    // If we have pre-selected class but need to select student
    if (!selectedStudentId && selectedClassId) {
      if (!selectedStudentId) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn học sinh",
          variant: "destructive"
        });
        return;
      }
    }
    
    // If we have pre-selected student but need to select class
    if (!selectedClassId && selectedStudentId) {
      if (!selectedClassId) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn lớp học",
          variant: "destructive"
        });
        return;
      }
    }

    // Normal case - check both values
    if (!selectedClassId || !selectedStudentId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn lớp học và học sinh",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const enrollmentData = {
        hoc_sinh_id: selectedStudentId,
        lop_chi_tiet_id: selectedClassId,
        tinh_trang_diem_danh: 'pending'
      };

      await enrollmentService.create(enrollmentData);
      
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

  // Determine if the component is in "pre-selected class" mode or "pre-selected student" mode
  const isSelectingStudent = !!classId && !studentId;
  const isSelectingClass = !classId && !!studentId;
  const isSelectingBoth = !classId && !studentId;

  return (
    <>
      {!classId && !studentId && (
        <Button onClick={() => setOpen(true)}>Đăng ký vào lớp</Button>
      )}
      
      {/* If we're in the dialog already (classId provided but student needs to be selected) */}
      {(!!classId || !!studentId) && (
        <div className="space-y-4">
          {isSelectingStudent && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Học sinh</label>
              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={isStudentsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học sinh" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: Student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.ten_hoc_sinh || 'Học sinh không tên'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(isSelectingClass || isSelectingBoth) && (
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
                  {classes.map((cls: Class) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.ten_lop_full || cls.ten_lop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || (!selectedClassId && !selectedStudentId)}>
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </div>
        </div>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký học sinh vào lớp</DialogTitle>
            <DialogDescription>
              {student ? `Chọn lớp học để đăng ký học sinh ${student?.ten_hoc_sinh}` : 'Chọn học sinh và lớp học để đăng ký'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!studentId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Học sinh</label>
                <Select 
                  value={selectedStudentId} 
                  onValueChange={setSelectedStudentId}
                  disabled={isStudentsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student: Student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.ten_hoc_sinh || 'Học sinh không tên'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
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
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedClassId || (!studentId && !selectedStudentId)}>
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
