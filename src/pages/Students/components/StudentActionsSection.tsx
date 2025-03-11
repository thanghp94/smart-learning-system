
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RotateCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import EnrollStudentButton from './EnrollStudentButton';
import { useToast } from '@/hooks/use-toast';
import StudentEmailForm from './StudentEmailForm';

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
  const [showEmailDialog, setShowEmailDialog] = useState(false);

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

        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowEmailDialog(true)}
        >
          <Mail className="h-4 w-4" />
          Gửi email
        </Button>

        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Gửi email cho phụ huynh/học sinh</DialogTitle>
            </DialogHeader>
            <StudentEmailForm 
              student={student} 
              onClose={() => setShowEmailDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StudentActionsSection;
