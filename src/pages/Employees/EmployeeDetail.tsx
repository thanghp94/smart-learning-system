
import React, { useState, useEffect } from "react";
import { Employee } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financeService, fileService, payrollService } from "@/lib/supabase";
import { FinanceLedgerEntry, File as FileDocument, Payroll } from "@/lib/types";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EmployeeDetailProps {
  employee: Employee;
}

const EmployeeDetail = ({ employee }: EmployeeDetailProps) => {
  const [finances, setFinances] = useState<FinanceLedgerEntry[]>([]);
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setIsLoading(true);
      try {
        // Fetch finances related to this employee
        const employeeFinances = await financeService.getByEntityId('employee', employee.id);
        setFinances(employeeFinances);

        // Fetch files related to this employee
        const employeeFiles = await fileService.getByEntity('nhan_vien', employee.id);
        setFiles(employeeFiles);

        // Fetch payrolls for this employee
        const employeePayrolls = await payrollService.getByEmployee(employee.id);
        setPayrolls(employeePayrolls);
      } catch (error) {
        console.error("Error fetching employee related data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu liên quan đến nhân viên",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (employee?.id) {
      fetchEmployeeData();
    }
  }, [employee, toast]);

  // Define finance columns
  const financeColumns = [
    {
      title: "Ngày",
      key: "ngay",
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '--',
    },
    {
      title: "Loại",
      key: "loai_thu_chi",
      render: (value: string) => value === 'income' ? 'Thu' : 'Chi',
    },
    {
      title: "Hạng mục",
      key: "loai_giao_dich",
    },
    {
      title: "Diễn giải",
      key: "dien_giai",
    },
    {
      title: "Tổng tiền",
      key: "tong_tien",
      render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: "Trạng thái",
      key: "tinh_trang",
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'secondary'}>
          {value === 'completed' ? 'Hoàn thành' : value === 'pending' ? 'Chờ xử lý' : value}
        </Badge>
      ),
    },
  ];

  // Define file columns
  const fileColumns = [
    {
      title: "Tên tài liệu",
      key: "ten_tai_lieu",
    },
    {
      title: "Nhóm",
      key: "nhom_tai_lieu",
    },
    {
      title: "Ngày cấp",
      key: "ngay_cap",
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '--',
    },
    {
      title: "Hạn tài liệu",
      key: "han_tai_lieu",
      render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy') : '--',
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {value === 'active' ? 'Hoạt động' : value}
        </Badge>
      ),
    },
  ];

  // Define payroll columns
  const payrollColumns = [
    {
      title: "Thời gian",
      key: "thang",
      render: (value: string, record: Payroll) => `${value}/${record.nam}`,
    },
    {
      title: "Lương",
      key: "luong",
      render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: "Phụ cấp",
      render: (_: any, record: Payroll) => {
        const total = (record.pc_tnhiem || 0) + (record.pc_an_o || 0) + 
                      (record.pc_dthoai || 0) + (record.pc_xang_xe || 0);
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
      },
    },
    {
      title: "Tổng thu nhập",
      key: "tong_thu_nhap",
      render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: "Công thực làm",
      key: "cong_thuc_lam",
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'secondary'}>
          {value === 'completed' ? 'Đã thanh toán' : value === 'pending' ? 'Chờ xử lý' : value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20">
          {employee.hinh_anh ? (
            <AvatarImage src={employee.hinh_anh} alt={employee.ten_nhan_su} />
          ) : null}
          <AvatarFallback className="text-2xl">
            {employee.ten_nhan_su?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-bold">{employee.ten_nhan_su}</h2>
          <p className="text-muted-foreground">{employee.chuc_danh}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={employee.tinh_trang_lao_dong === "active" ? "success" : "destructive"}>
              {employee.tinh_trang_lao_dong === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {employee.bo_phan}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal_info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal_info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="payroll">Bảng lương</TabsTrigger>
        </TabsList>

        <TabsContent value="personal_info" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Tên tiếng Anh:</span>
                  <span className="text-sm col-span-2">{employee.ten_tieng_anh || "Không có"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Giới tính:</span>
                  <span className="text-sm col-span-2">{employee.gioi_tinh}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Ngày sinh:</span>
                  <span className="text-sm col-span-2">{formatDate(employee.ngay_sinh)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Địa chỉ:</span>
                  <span className="text-sm col-span-2">{employee.dia_chi}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Liên Hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Điện thoại:</span>
                  <span className="text-sm col-span-2">{employee.dien_thoai}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <span className="text-sm col-span-2">{employee.email}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Công Việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Bộ phận:</span>
                  <span className="text-sm col-span-2">{employee.bo_phan}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Chức danh:</span>
                  <span className="text-sm col-span-2">{employee.chuc_danh}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Cơ sở:</span>
                  <span className="text-sm col-span-2">
                    {employee.co_so_id?.join(', ') || "Không có"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu tài chính</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={financeColumns}
                data={finances}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm giao dịch..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={fileColumns}
                data={files}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm tài liệu..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảng lương</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={payrollColumns}
                data={payrolls}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Tìm kiếm bảng lương..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
