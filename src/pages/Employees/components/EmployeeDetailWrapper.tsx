
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import EmployeeDetails from '../EmployeeDetails';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EmployeeDetailWrapperProps {
  employeeId?: string;
}

const EmployeeDetailWrapper: React.FC<EmployeeDetailWrapperProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, toast]);

  const handleBack = () => {
    navigate('/employees');
  };

  if (isLoading) {
    return <div className="p-4">Đang tải thông tin nhân viên...</div>;
  }

  if (!employee) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <p className="mt-4">Không tìm thấy thông tin nhân viên</p>
      </div>
    );
  }

  return <EmployeeDetails employee={employee} />;
};

export default EmployeeDetailWrapper;
