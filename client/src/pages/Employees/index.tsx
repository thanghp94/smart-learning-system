import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import TablePageLayout from '@/components/common/TablePageLayout';
import DataTable from '@/components/ui/data-table';
import { Employee } from '@/lib/types';
import { employeeService } from '@/lib/database';
import { Plus, FileDown, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmployeeFilters from './components/EmployeeFilters';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ facility: 'all', status: 'all' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, filters]);

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

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      console.log("Submitting employee data:", employeeData);
      
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, employeeData);
      } else {
        await employeeService.create(employeeData);
      }
      
      await fetchEmployees();
      setIsFormOpen(false);
      setEditingEmployee(null);
      
      toast({
        title: "Thành công",
        description: editingEmployee ? "Cập nhật nhân viên thành công" : "Tạo nhân viên thành công",
      });
    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast({
        title: "Lỗi",
        description: `Không thể lưu nhân viên: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...employees];

    // Filter by facility
    if (filters.facility !== 'all') {
      filtered = filtered.filter(employee => employee.co_so === filters.facility);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(employee => {
        const status = employee.trang_thai;
        if (filters.status === 'active') {
          return status === 'active' || status === 'Đang làm việc';
        } else if (filters.status === 'inactive') {
          return status === 'inactive' || status === 'Đã nghỉ việc';
        } else if (filters.status === 'on_leave') {
          return status === 'on_leave' || status === 'Tạm nghỉ';
        }
        return true;
      });
    }

    setFilteredEmployees(filtered);
  };

  const handleFilterChange = (newFilters: { facility: string; status: string }) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ facility: 'all', status: 'all' });
  };

  const handleRowClick = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleAddClick = () => {
    navigate('/employees/add');
  };

  const columns = [
    {
      title: "Họ và tên",
      key: "ten_nhan_vien",
      sortable: true,
      thumbnail: true,
      width: "25%",
      render: (value: string, record: Employee) => {
        return record.ten_nhan_vien || `Employee ${record.id}`;
      },
    },
    {
      title: "Bộ phận",
      key: "bo_phan",
      sortable: true,
      width: "15%",
    },
    {
      title: "Chức danh",
      key: "chuc_danh",
      sortable: true,
      width: "20%",
    },
    {
      title: "Email",
      key: "email",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      key: "dien_thoai",
      width: "12%",
    },
    {
      title: "Trạng thái",
      key: "tinh_trang_lao_dong",
      width: "8%",
      className: "text-center",
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
      <EmployeeFilters 
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
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
        data={filteredEmployees}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm nhân viên..."
      />
    </TablePageLayout>
  );
};

export default Employees;