
import React, { useState, useEffect } from "react";
import { Employee, Task, Finance, File, EmployeeClockIn } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, FileText, DollarSign, ClipboardCheck } from "lucide-react";
import { taskService, financeService, fileService } from "@/lib/supabase";
import { employeeClockInService } from "@/lib/supabase/employee-clock-in-service";

interface EmployeeDetailProps {
  employee: Employee;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [attendances, setAttendances] = useState<EmployeeClockIn[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, financesData, filesData, attendancesData] = await Promise.all([
          taskService.getByEntity("employee", employee.id),
          financeService.getByEntity("employee", employee.id),
          fileService.getByEntity("employee", employee.id),
          employeeClockInService.getByEmployee(employee.id)
        ]);
        
        setTasks(tasksData);
        setFinances(financesData);
        setFiles(filesData);
        setAttendances(attendancesData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    
    fetchData();
  }, [employee.id]);

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return date;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // Format HH:MM
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{employee.ten_nhan_su}</h2>
        {employee.ten_tieng_anh && (
          <p className="text-muted-foreground">{employee.ten_tieng_anh}</p>
        )}
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Chức danh:</p>
          <p>{employee.chuc_danh || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Bộ phận:</p>
          <p>{employee.bo_phan || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Giới tính:</p>
          <p>{employee.gioi_tinh || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Ngày sinh:</p>
          <p>{formatDate(employee.ngay_sinh)}</p>
        </div>
        <div>
          <p className="font-medium">Điện thoại:</p>
          <p>{employee.dien_thoai || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Email:</p>
          <p>{employee.email || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Địa chỉ:</p>
          <p>{employee.dia_chi || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Tình trạng:</p>
          <Badge variant={employee.tinh_trang_lao_dong === "active" ? "default" : "secondary"}>
            {employee.tinh_trang_lao_dong === "active" ? "Đang làm việc" : employee.tinh_trang_lao_dong}
          </Badge>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="attendance">
            <Calendar className="h-4 w-4 mr-2" />
            Chấm công
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Công việc
          </TabsTrigger>
          <TabsTrigger value="finances">
            <DollarSign className="h-4 w-4 mr-2" />
            Tài chính
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="py-4">
          {attendances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Bắt đầu</TableHead>
                  <TableHead>Kết thúc</TableHead>
                  <TableHead>Buổi dạy</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{formatDate(attendance.ngay)}</TableCell>
                    <TableCell>{formatTime(attendance.thoi_gian_bat_dau)}</TableCell>
                    <TableCell>{formatTime(attendance.thoi_gian_ket_thuc)}</TableCell>
                    <TableCell>{attendance.buoi_day_id || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={attendance.xac_nhan ? "default" : "outline"}>
                        {attendance.xac_nhan ? "Đã xác nhận" : attendance.trang_thai || "Chờ xác nhận"}
                      </Badge>
                    </TableCell>
                    <TableCell>{attendance.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu chấm công</p>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="py-4">
          {tasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên công việc</TableHead>
                  <TableHead>Loại việc</TableHead>
                  <TableHead>Hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.ten_viec}</TableCell>
                    <TableCell>{task.loai_viec || "N/A"}</TableCell>
                    <TableCell>{formatDate(task.ngay_den_han)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.trang_thai === "completed" ? "default" : 
                          task.trang_thai === "pending" ? "outline" : "secondary"
                        }
                      >
                        {task.trang_thai === "completed" ? "Hoàn thành" : 
                         task.trang_thai === "pending" ? "Đang chờ" : task.trang_thai}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có công việc</p>
          )}
        </TabsContent>

        <TabsContent value="finances" className="py-4">
          {finances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tên phí</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell>{formatDate(finance.ngay)}</TableCell>
                    <TableCell>{finance.loai_thu_chi || "N/A"}</TableCell>
                    <TableCell>{finance.ten_phi || finance.dien_giai || "N/A"}</TableCell>
                    <TableCell>{formatCurrency(finance.tong_tien)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          finance.tinh_trang === "completed" ? "default" : 
                          finance.tinh_trang === "pending" ? "outline" : "secondary"
                        }
                      >
                        {finance.tinh_trang === "completed" ? "Hoàn thành" : 
                         finance.tinh_trang === "pending" ? "Đang chờ" : finance.tinh_trang}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có dữ liệu tài chính</p>
          )}
        </TabsContent>

        <TabsContent value="files" className="py-4">
          {files.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Nhóm tài liệu</TableHead>
                  <TableHead>Ngày cấp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.ten_tai_lieu}</TableCell>
                    <TableCell>{file.nhom_tai_lieu || "N/A"}</TableCell>
                    <TableCell>{formatDate(file.ngay_cap)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={file.trang_thai === "active" ? "default" : "secondary"}
                      >
                        {file.trang_thai === "active" ? "Đang sử dụng" : file.trang_thai}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.ghi_chu || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Không có tài liệu</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
