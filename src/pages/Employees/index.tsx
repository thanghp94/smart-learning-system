
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
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

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    // Test Supabase connection
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      const { data, error } = await supabase.from('employees').select('count');
      
      if (error) {
        console.error("Supabase connection test failed:", error);
        setConnectionError(`Database connection error: ${error.message}`);
      } else {
        console.log("Supabase connection successful:", data);
        setConnectionError(null);
      }
    } catch (err) {
      console.error("Unexpected error testing connection:", err);
      setConnectionError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching employees data...");
      const data = await employeeService.getAll();
      console.log("Employees data received:", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
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
      console.error("Error adding employee:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm nhân viên mới",
        variant: "destructive"
      });
    }
  };

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
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
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
        data={employees}
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
          <EmployeeDetail employee={selectedEmployee} />
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
