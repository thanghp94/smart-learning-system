
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Student, Class, Enrollment } from '@/lib/types';
import { classService, enrollmentService } from '@/lib/supabase';
import EnrollmentForm from '../../Enrollments/EnrollmentForm';

interface EnrollStudentButtonProps {
  student: Student;
}

const EnrollStudentButton: React.FC<EnrollStudentButtonProps> = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const openSheet = async () => {
    try {
      setIsLoading(true);
      const classesData = await classService.getAll();
      setClasses(classesData || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách lớp học',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Enrollment>) => {
    try {
      setIsSubmitting(true);
      // Ensure the student ID is set
      const enrollmentData = {
        ...data,
        hoc_sinh_id: student.id,
      };
      
      await enrollmentService.create(enrollmentData);
      
      toast({
        title: 'Thành công',
        description: 'Ghi danh học sinh vào lớp thành công',
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể ghi danh học sinh',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        onClick={openSheet}
        disabled={isLoading}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Ghi danh lớp mới
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Ghi danh học sinh: {student.ten_hoc_sinh}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EnrollmentForm
              onSubmit={handleSubmit}
              students={[student]} // Only show the current student
              classes={classes}
              initialData={{ hoc_sinh_id: student.id }}
              isLoading={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EnrollStudentButton;
