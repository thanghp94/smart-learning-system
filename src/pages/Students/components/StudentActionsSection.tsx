
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Student } from '@/lib/types';
import EnrollStudentButton from './EnrollStudentButton';
import StudentEmailService from './StudentEmailService';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <EnrollStudentButton 
            student={student} 
            studentId={studentId} 
            onEnrollmentCreated={refreshEnrollments} 
          />
          
          <StudentEmailService 
            student={student}
            buttonLabel="Gửi email"
            buttonVariant="outline"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentActionsSection;
