import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { employeeService } from "@/lib/supabase";
import { Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DetailPanel from "@/components/ui/DetailPanel";
import EmployeeDetail from "./EmployeeDetail";
import EmployeeForm from "./EmployeeForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getAll();
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
      title: "Tên Nhân Viên",
      key: "ten_nhan_su",
      sortable: true,
    },
    {
      title: "Bộ Phận",
      key: "bo_phan",
      sortable: true,
    },
    {
      title: "Chức Danh",
      key: "chuc_danh",
      sortable: true,
    },
    {
      title: "SĐT",
      key: "dien_thoai",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Trạng Thái",
      key: "tinh_trang_lao_dong",
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "secondary"}>
          {value === "active" ? "Đang làm việc" : value}
        </Badge>
      ),
    },
    {
      title: "Ngày Sinh",
      key: "ngay_sinh",
      sortable: true,
      render: (value: string) => <span>{formatDate(value)}</span>,
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
