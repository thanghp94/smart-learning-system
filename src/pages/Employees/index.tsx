import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import DataTable from '@/components/ui/DataTable';
import { Employee } from '@/lib/types';
import { employeeService } from '@/lib/supabase';
import { format } from 'date-fns';
import { Plus, FileDown, Filter, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TableColumn {
  title: string;
  key: string;
  render?: (value: string) => React.ReactNode;
  sortable?: boolean;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        title: "Lỗi",
        description: "Không thể tải danh sách nhân viên",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleAddClick = () => {
    navigate('/employees/add');
  };

  const columns: TableColumn[] = [
    {
      title: "Họ và tên",
      key: "ten_nhan_su",
    },
    {
      title: "Bộ phận",
      key: "bo_phan",
    },
    {
      title: "Chức danh",
      key: "chuc_danh",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      key: "dien_thoai",
    },
    {
      title: "Trạng thái",
      key: "tinh_trang_lao_dong",
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchEmployees}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm nhân viên
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Nhân viên"
      description="Quản lý thông tin nhân viên"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm nhân viên..."
      />
    </TablePageLayout>
  );
};

export default Employees;
