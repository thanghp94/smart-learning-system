
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
import { Employee, Finance, EmployeeClockInOut } from "@/lib/types";
import { employeeService, financeService, fileService, payrollService, employeeClockInService } from "@/lib/supabase";
import DataTable from "@/components/ui/DataTable"; // Fixed import

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [clockIns, setClockIns] = useState<EmployeeClockInOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch employee details
      const employeeData = await employeeService.getById(id!);
      setEmployee(employeeData);
      
      // Fetch related data if employee exists
      if (employeeData) {
        // Fetch finances related to this employee
        const financesData = await financeService.getByEmployee(id!);
        setFinances(financesData || []);
        
        // Fetch files related to this employee
        const filesData = await fileService.getByEntity('employee', id!);
        setFiles(filesData || []);
        
        // Fetch payroll data for this employee
        const payrollsData = await payrollService.getByEmployee(id!);
        setPayrolls(payrollsData || []);
        
        // Fetch clock in/out records
        const clockInData = await employeeClockInService.getByEmployeeId(id!);
        setClockIns(clockInData || []);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleBackClick = () => {
    navigate('/employees');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy nhân viên</h2>
          <Button onClick={handleBackClick} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
        </div>
        <Button onClick={handleEditClick}>
          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="payroll">Bảng lương</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhân viên</CardTitle>
              <CardDescription>Chi tiết thông tin cá nhân và liên hệ</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Tên nhân sự</h3>
                <p className="text-lg">{employee.ten_nhan_su}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Giới tính</h3>
                <p className="text-lg">{employee.gioi_tinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ngày sinh</h3>
                <p className="text-lg">{employee.ngay_sinh ? new Date(employee.ngay_sinh).toLocaleDateString() : "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-lg">{employee.email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Điện thoại</h3>
                <p className="text-lg">{employee.dien_thoai || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Địa chỉ</h3>
                <p className="text-lg">{employee.dia_chi || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Bộ phận</h3>
                <p className="text-lg">{employee.bo_phan || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Chức danh</h3>
                <p className="text-lg">{employee.chuc_danh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Tình trạng lao động</h3>
                <p className="text-lg">{employee.tinh_trang_lao_dong || "Đang làm việc"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ghi chú</h3>
                <p className="text-lg">{employee.ghi_chu || "Không có ghi chú"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Tài chính</CardTitle>
              <CardDescription>Các giao dịch tài chính liên quan đến nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              {finances.length > 0 ? (
                <DataTable 
                  data={finances} 
                  columns={[
                    { accessorKey: 'ngay', header: 'Ngày' },
                    { accessorKey: 'loai_thu_chi', header: 'Loại thu chi' },
                    { accessorKey: 'dien_giai', header: 'Diễn giải' },
                    { accessorKey: 'tong_tien', header: 'Tổng tiền' },
                    { accessorKey: 'tinh_trang', header: 'Tình trạng' }
                  ]}
                />
              ) : (
                <p>Không có dữ liệu tài chính</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu</CardTitle>
              <CardDescription>Tài liệu liên quan đến nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              {files.length > 0 ? (
                <DataTable 
                  data={files} 
                  columns={[
                    { accessorKey: 'ten_tai_lieu', header: 'Tên tài liệu' },
                    { accessorKey: 'nhom_tai_lieu', header: 'Nhóm tài liệu' },
                    { accessorKey: 'ngay_cap', header: 'Ngày cấp' },
                    { accessorKey: 'trang_thai', header: 'Trạng thái' }
                  ]}
                />
              ) : (
                <p>Không có tài liệu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Bảng lương</CardTitle>
              <CardDescription>Lịch sử bảng lương của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              {payrolls.length > 0 ? (
                <DataTable 
                  data={payrolls} 
                  columns={[
                    { accessorKey: 'thang', header: 'Tháng' },
                    { accessorKey: 'nam', header: 'Năm' },
                    { accessorKey: 'tong_luong_thuc_te', header: 'Tổng lương thực tế' },
                    { accessorKey: 'trang_thai', header: 'Trạng thái' }
                  ]}
                />
              ) : (
                <p>Không có dữ liệu bảng lương</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Chấm công</CardTitle>
              <CardDescription>Lịch sử chấm công của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              {clockIns.length > 0 ? (
                <DataTable 
                  data={clockIns} 
                  columns={[
                    { accessorKey: 'ngay', header: 'Ngày' },
                    { accessorKey: 'thoi_gian_bat_dau', header: 'Giờ vào' },
                    { accessorKey: 'thoi_gian_ket_thuc', header: 'Giờ ra' },
                    { accessorKey: 'xac_nhan', header: 'Xác nhận' },
                    { accessorKey: 'trang_thai', header: 'Trạng thái' }
                  ]}
                />
              ) : (
                <p>Không có dữ liệu chấm công</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
