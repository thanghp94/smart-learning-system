import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, FileText, Edit, Trash, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { employeeService } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import TablePageLayout from '@/components/common/TablePageLayout';
import { DataTable } from '@/components/ui/DataTable';
import { format } from 'date-fns';

const Employees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate('/employees/new');
  };

  const handleEditEmployee = (id: string) => {
    navigate(`/employees/${id}`);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      return;
    }

    try {
      await employeeService.delete(id);
      setEmployees(employees.filter(employee => employee.id !== id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa nhân viên',
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa nhân viên',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'ten_nhan_su',
      header: 'Tên nhân viên',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={employee.hinh_anh || '/placeholder.svg'}
                alt={employee.ten_nhan_su}
              />
            </div>
            <div>
              <div className="font-medium">{employee.ten_nhan_su}</div>
              <div className="text-sm text-muted-foreground">{employee.chuc_danh}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'dien_thoai',
      header: 'Điện thoại',
    },
    {
      accessorKey: 'bo_phan',
      header: 'Bộ phận',
    },
    {
      accessorKey: 'tinh_trang_lao_dong',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.tinh_trang_lao_dong;
        let statusClass = 'bg-gray-100 text-gray-800';
        
        if (status === 'active') {
          statusClass = 'bg-green-100 text-green-800';
        } else if (status === 'inactive') {
          statusClass = 'bg-red-100 text-red-800';
        } else if (status === 'leave') {
          statusClass = 'bg-yellow-100 text-yellow-800';
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
            {status === 'active' ? 'Đang làm việc' : 
             status === 'inactive' ? 'Đã nghỉ việc' : 
             status === 'leave' ? 'Nghỉ phép' : status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditEmployee(employee.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEmployee(employee.id)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <TablePageLayout
      title="Quản lý nhân viên"
      description="Xem và quản lý tất cả nhân viên trong hệ thống"
      actions={
        <Button onClick={handleAddEmployee}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      }
    >
      <Card>
        <DataTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          emptyMessage="Không có dữ liệu nhân viên nào"
          searchPlaceholder="Tìm kiếm nhân viên..."
          searchColumn="ten_nhan_su"
        />
      </Card>
    </TablePageLayout>
  );
};

export default Employees;
