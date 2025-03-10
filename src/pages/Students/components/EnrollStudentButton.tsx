
import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/lib/types';

interface EnrollStudentButtonProps {
  student: Student;
  onEnrollmentComplete: () => Promise<void>;
}

const EnrollStudentButton: React.FC<EnrollStudentButtonProps> = ({ 
  student, 
  onEnrollmentComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      // Enrollment logic will be implemented in a modal or separate page
      await onEnrollmentComplete();
    } catch (error) {
      console.error('Error enrolling student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="default" 
      onClick={handleEnroll} 
      disabled={isLoading}
      className="w-auto"
    >
      <Book className="mr-2 h-4 w-4" />
      Ghi danh vào lớp
    </Button>
  );
};

export default EnrollStudentButton;
