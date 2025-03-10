
import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { employeeService } from "@/lib/supabase";
import { Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import EmployeeDetail from "./EmployeeDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase/client";
import ExportButton from "@/components/ui/ExportButton";
import FilterButton, { FilterCategory } from "@/components/ui/FilterButton";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    // Test Supabase connection
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      console.log("Kiểm tra kết nối Supabase...");
      const { data, error } = await supabase.from('employees').select('count');
      
      if (error) {
        console.error("Kiểm tra kết nối Supabase thất bại:", error);
        setConnectionError(`Lỗi kết nối cơ sở dữ liệu: ${error.message}`);
      } else {
        console.log("Kết nối Supabase thành công:", data);
        setConnectionError(null);
      }
    } catch (err) {
      console.error("Lỗi không xác định khi kiểm tra kết nối:", err);
      setConnectionError(`Lỗi không xác định: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log("Đang tải dữ liệu nhân viên...");
      const data = await employeeService.getAll();
      console.log("Dữ liệu nhân viên đã nhận:", data);
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
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
    setSelectedEmployee(employee);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddEmployee = () => {
    setShowAddForm(true);
  };

  const handleEmployeeSubmit = async (employeeData: Partial<Employee>) => {
    try {
      await employeeService.create(employeeData);
      toast({
        title: "Thành công",
        description: "Đã thêm nhân viên mới vào hệ thống",
      });
      setShowAddForm(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm nhân viên mới",
        variant: "destructive"
      });
    }
  };

  // Extract departments for filter options
  const departmentOptions = useMemo(() => {
    const departments = [...new Set(employees.map(emp => emp.bo_phan || ''))].filter(Boolean);
    return departments.map(dept => ({
      label: dept,
      value: dept,
      type: 'other' as const
    }));
  }, [employees]);

  // Extract positions for filter options
  const positionOptions = useMemo(() => {
    const positions = [...new Set(employees.map(emp => emp.chuc_danh || ''))].filter(Boolean);
    return positions.map(pos => ({
      label: pos,
      value: pos,
      type: 'other' as const
    }));
  }, [employees]);

  // Status options
  const statusOptions = [
    { label: 'Đang làm việc', value: 'active', type: 'status' as const },
    { label: 'Đã nghỉ việc', value: 'inactive', type: 'status' as const }
  ];

  // Create filter categories
  const filterCategories = [
    {
      name: 'Bộ phận',
      type: 'other' as const,
      options: departmentOptions
    },
    {
      name: 'Chức danh',
      type: 'other' as const,
      options: positionOptions
    },
    {
      name: 'Trạng thái',
      type: 'status' as const,
      options: statusOptions
    }
  ];

  // Apply filters to data
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Check each filter
      for (const [category, value] of Object.entries(filters)) {
        if (value) {
          if (category === 'Bộ phận' && employee.bo_phan !== value) return false;
          if (category === 'Chức danh' && employee.chuc_danh !== value) return false;
          if (category === 'Trạng thái' && employee.tinh_trang_lao_dong !== value) return false;
        }
      }
      return true;
    });
  }, [employees, filters]);

  const columns = [
    {
      title: "Họ và tên",
      key: "ten_nhan_su",
      sortable: true,
    },
    {
      title: "Bộ phận",
      key: "bo_phan",
      sortable: true,
    },
    {
      title: "Chức danh",
      key: "chuc_danh",
      sortable: true,
    },
    {
      title: "Điện thoại",
      key: "dien_thoai",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Trạng thái",
      key: "tinh_trang_lao_dong",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "destructive"}>
          {value === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <FilterButton 
        categories={filterCategories} 
        onFilter={setFilters}
      />
      <ExportButton 
        data={filteredEmployees} 
        filename="Danh_sach_nhan_vien" 
        label="Xuất dữ liệu"
      />
      <Button size="sm" className="h-8" onClick={handleAddEmployee}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Nhân Viên
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Nhân Viên"
      description="Quản lý thông tin nhân viên trong hệ thống"
      actions={tableActions}
    >
      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Lỗi kết nối cơ sở dữ liệu</AlertTitle>
          <AlertDescription>
            {connectionError}
            <div className="mt-2">
              <p>Kiểm tra:</p>
              <ul className="list-disc pl-5">
                <li>Biến môi trường VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY đã được cấu hình</li>
                <li>Kết nối internet hoạt động</li>
                <li>Dịch vụ Supabase đang hoạt động</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testSupabaseConnection}
                className="mt-2"
              >
                Kiểm tra lại kết nối
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={filteredEmployees}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        searchable={true}
        searchPlaceholder="Tìm kiếm nhân viên..."
      />

      {selectedEmployee && (
        <DetailPanel
          title="Thông Tin Nhân Viên"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <EmployeeDetail employeeId={selectedEmployee.id} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
          </DialogHeader>
          <EmployeeForm onSubmit={handleEmployeeSubmit} />
        </DialogContent>
      </Dialog>
    </TablePageLayout>
  );
};

export default Employees;
