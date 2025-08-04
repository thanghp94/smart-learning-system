import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { employeeService } from '@/lib/database';
import EmployeeForm from './EmployeeForm';
import { Employee } from '@/lib/types';

interface EmployeeFormContainerProps {
  isAdd?: boolean;
}

const EmployeeFormContainer: React.FC<EmployeeFormContainerProps> = ({ isAdd = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [initialData, setInitialData] = React.useState<Partial<Employee> | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(!isAdd);

  React.useEffect(() => {
    if (!isAdd && id) {
      fetchEmployee();
    }
  }, [isAdd, id]);

  const fetchEmployee = async () => {
    try {
      if (!id) return;
      
      setIsLoading(true);
      const employee = await employeeService.getById(id);
      if (employee) {
        setInitialData(employee);
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy nhân viên",
          variant: "destructive"
        });
        navigate('/employees');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin nhân viên",
        variant: "destructive"
      });
      navigate('/employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Employee>) => {
    try {
      if (isAdd) {
        await employeeService.create(data);
        toast({
          title: "Thành công",
          description: "Đã thêm nhân viên mới",
        });
      } else if (id) {
        await employeeService.update(id, data);
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin nhân viên",
        });
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Lỗi",
        description: isAdd ? "Không thể thêm nhân viên" : "Không thể cập nhật nhân viên",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isAdd ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}
        </h1>
      </div>
      
      <EmployeeForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EmployeeFormContainer;