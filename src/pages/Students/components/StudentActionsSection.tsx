
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RotateCw } from 'lucide-react';
import { Student } from '@/lib/types';
import EnrollStudentButton from './EnrollStudentButton';
import { useToast } from '@/hooks/use-toast';

interface StudentActionsSectionProps {
  student: Student;
  studentId: string;
  refreshEnrollments: () => Promise<void>;
}

const StudentActionsSection: React.FC<StudentActionsSectionProps> = ({ 
  student, 
  studentId, 
  refreshEnrollments 
}) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="flex items-center">
          <RotateCw className="mr-2 h-5 w-5" />
          Hành động
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-start gap-4">
        <EnrollStudentButton 
          student={student}
          studentId={studentId}
          onEnrollmentCreated={async () => {
            toast({
              title: 'Thành công',
              description: 'Đã ghi danh học sinh vào lớp',
            });
            
            await refreshEnrollments();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StudentActionsSection;
