
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/lib/types';
import { employeeService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import EmployeeBasicInfoTab from './EmployeeBasicInfoTab';
import Loader from '@/components/ui/Loader';

interface EmployeeDetailWrapperProps {
  children?: React.ReactNode;
}

const EmployeeDetailWrapper: React.FC<EmployeeDetailWrapperProps> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const fetchedEmployee = await employeeService.getById(id);
        if (fetchedEmployee) {
          setEmployee(fetchedEmployee);
        } else {
          toast({
            title: "Không tìm thấy",
            description: "Không tìm thấy thông tin nhân viên",
            variant: "destructive",
          });
          navigate('/employees');
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate, toast]);

  const handleGoBack = () => {
    navigate('/employees');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!employee) {
    return <div>Không tìm thấy thông tin nhân viên</div>;
  }

  // Pass the employee data to children using React.cloneElement
  const childrenWithProps = React.Children.map(children, (child) => {
    // Check if child is a valid React element
    if (React.isValidElement(child)) {
      // Clone the child with employee prop
      return React.cloneElement(child, { 
        employee 
      } as any);
    }
    return child;
  });

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={handleGoBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{employee.ten_nhan_su}</h1>
        <p className="text-muted-foreground">{employee.chuc_danh || 'Không có chức danh'}</p>
      </div>

      {childrenWithProps || <EmployeeBasicInfoTab employee={employee} />}
    </div>
  );
};

export default EmployeeDetailWrapper;
