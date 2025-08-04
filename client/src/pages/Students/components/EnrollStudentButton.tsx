
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { enrollmentService, classService, studentService } from "@/lib/database";
import { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader, X, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const { toast } = useToast();

  // Load active classes
  const { data: classes = [], isLoading: isClassesLoading } = useQuery({
    queryKey: ['active-classes'],
    queryFn: async () => {
      const result = await classService.getAll();
      return result.filter(c => c.tinh_trang === 'active');
    }
  });

  // Load students when needed
  const { data: students = [], isLoading: isStudentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
    enabled: !student && !studentId
  });

  useEffect(() => {
    if (classId) setSelectedClassId(classId);
    if (studentId) setSelectedStudentIds([studentId]);
    if (student?.id) setSelectedStudentIds([student.id]);
  }, [classId, studentId, student]);

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(prev => [...prev, studentId]);
    } else {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    }
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
  };

  const getSelectedStudents = () => {
    return students.filter(s => selectedStudentIds.includes(s.id));
  };

  const getFilteredStudents = () => {
    if (!studentSearchQuery) return students;
    return students.filter(student => {
      const name = student.ho_va_ten || student.ten_hoc_sinh || '';
      return name.toLowerCase().includes(studentSearchQuery.toLowerCase());
    });
  };

  const handleSubmit = async () => {
    const currentStudentIds = student || studentId ? [studentId || student!.id] : selectedStudentIds;
    
    if (!selectedClassId || currentStudentIds.length === 0) {
      toast({
        title: "Lỗi",
        description: !selectedClassId 
          ? "Vui lòng chọn lớp học" 
          : "Vui lòng chọn ít nhất một học sinh",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create enrollments for all selected students
      const enrollmentPromises = currentStudentIds.map(id =>
        enrollmentService.create({
          hoc_sinh_id: id,
          lop_chi_tiet_id: selectedClassId,
          tinh_trang_diem_danh: 'pending'
        })
      );

      await Promise.all(enrollmentPromises);

      toast({
        title: "Thành công",
        description: `Đã đăng ký ${currentStudentIds.length} học sinh vào lớp học`
      });

      setOpen(false);
      setSelectedStudentIds([]);
      await onEnrollmentCreated();
    } catch (error) {
      console.error("Error enrolling students:", error);
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

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ghi danh học sinh</DialogTitle>
          <DialogDescription>
            {student ? `Ghi danh ${student.ho_va_ten || student.ten_hoc_sinh} vào lớp học` : 'Chọn học sinh và lớp học để ghi danh'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!student && !studentId && (
            <div>
              <label className="text-sm font-medium mb-2 block">Học sinh</label>
              
              {/* Show selected students */}
              {selectedStudentIds.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2">
                    Đã chọn {selectedStudentIds.length} học sinh:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedStudents().map((student) => (
                      <Badge key={student.id} variant="secondary" className="px-2 py-1">
                        {student.ho_va_ten || student.ten_hoc_sinh}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => removeStudent(student.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Search input for students */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Student selection list */}
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {isStudentsLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="p-2">
                    {getFilteredStudents().map((student) => (
                      <div key={student.id} className="flex items-center space-x-2 py-2 px-2 hover:bg-muted rounded">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentToggle(student.id, checked as boolean)}
                        />
                        <label 
                          htmlFor={`student-${student.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {student.ho_va_ten || student.ten_hoc_sinh}
                        </label>
                      </div>
                    ))}
                    {getFilteredStudents().length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        {studentSearchQuery ? 'Không tìm thấy học sinh nào' : 'Không có học sinh nào'}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
