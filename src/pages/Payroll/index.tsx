
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { payrollService, employeeService, facilityService } from "@/lib/supabase";
import { Payroll, Employee, Facility } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import PayrollForm from "./PayrollForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
    fetchFacilities();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true);
      const data = await payrollService.getAll();
      setPayrolls(data);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu bảng lương",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.ten_nhan_su : 'N/A';
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Payroll>) => {
    try {
      console.log("Inserting record into payrolls:", formData);
      
      // Update required fields to ensure they're not undefined or empty
      const payrollData = {
        ...formData,
        luong: formData.luong || 0,
        tong_thu_nhap: formData.tong_thu_nhap || 0,
        cong_chuan: formData.cong_chuan || 22,
        cong_thuc_lam: formData.cong_thuc_lam || 22,
        trang_thai: formData.trang_thai || "pending"
      };
      
      // The phu_cap field will be removed in the service layer
      await payrollService.create(payrollData);
      
      toast({
        title: "Thành công",
        description: "Thêm bảng lương mới thành công",
      });
      setShowAddForm(false);
      fetchPayrolls();
    } catch (error) {
      console.error("Error adding payroll:", error);
      
      // Provide more specific error message based on the error type
      let errorMessage = "Không thể thêm bảng lương mới. Vui lòng kiểm tra lại dữ liệu.";
      
      // If it's a row-level security policy error
      if (error && typeof error === 'object' && 'code' in error && error.code === '42501') {
        errorMessage = "Bạn không có quyền thêm bảng lương. Vui lòng liên hệ quản trị viên.";
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Nhân Viên",
      key: "nhan_su_id",
      render: (value: string) => getEmployeeName(value),
      sortable: true,
    },
    {
      title: "Tháng/Năm",
      key: "thang",
      render: (value: string, record: Payroll) => `${value}/${record.nam}`,
      sortable: true,
    },
    {
      title: "Lương",
      key: "luong",
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      title: "Tổng Thu Nhập",
      key: "tong_thu_nhap",
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      render: (value: string) => 
        value === 'pending' ? 'Chờ duyệt' : 
        value === 'approved' ? 'Đã duyệt' : 
        value === 'paid' ? 'Đã thanh toán' : value,
      sortable: true,
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchPayrolls}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Tạo Bảng Lương
      </Button>
    </div>
  );

  return (
    <>
      {payrolls.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Lương"
          description="Quản lý bảng lương nhân viên"
          icon={<DollarSign className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
      ) : (
        <TablePageLayout
          title="Lương"
          description="Quản lý bảng lương nhân viên"
          actions={tableActions}
        >
          <DataTable
            columns={columns}
            data={payrolls}
            isLoading={isLoading}
            searchable={true}
            searchPlaceholder="Tìm kiếm bảng lương..."
          />
        </TablePageLayout>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo Bảng Lương Mới</DialogTitle>
          </DialogHeader>
          <PayrollForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
            employees={employees}
            facilities={facilities}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayrollPage;
