import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee, Task, Asset, Finance } from '@/lib/types';
import { employeeService } from '@/lib/supabase/employee-service';
import { taskService } from '@/lib/supabase/task-service';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { assetService } from '@/lib/supabase/asset-service';
import { financeService } from '@/lib/supabase/finance-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatStatus } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EmployeeClockInOut } from '@/lib/types/employee-clock-in-out';

interface EmployeeDetailProps {
  employeeId: string;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<EmployeeClockInOut[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee details
        const empData = await employeeService.getById(employeeId);
        setEmployee(empData);
        
        // Fetch related tasks
        const tasksData = await taskService.getByEmployeeId(employeeId);
        setTasks(tasksData);
        
        // Fetch attendance records
        const attendanceData = await employeeClockInService.getByEmployee(employeeId);
        // Set default values for any missing required properties
        const formattedAttendance = attendanceData.map(item => ({
          ...item,
          xac_nhan: item.xac_nhan ?? false,
          trang_thai: item.trang_thai || 'pending'
        })) as EmployeeClockInOut[];
        
        setAttendance(formattedAttendance);

        // Fetch assets
        try {
          // Use getByOwner instead of getByEmployeeId
          const assetsData = await assetService.getByOwner('employee', employeeId);
          setAssets(assetsData || []);
        } catch (error) {
          console.error('Error fetching employee assets:', error);
          setAssets([]);
        }

        // Fetch finances
        try {
          // Use getByEmployee instead of getByEmployeeId
          const financesData = await financeService.getByEmployee(employeeId);
          setFinances(financesData || []);
        } catch (error) {
          console.error('Error fetching employee finances:', error);
          setFinances([]);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu nhân viên',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId, toast]);

  // Column definitions for Tasks table
  const taskColumns = [
    {
      title: 'Tên công việc',
      key: 'ten_viec',
    },
    {
      title: 'Deadline',
      key: 'ngay_den_han',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Cấp độ',
      key: 'cap_do',
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: (_: string, task: Task) => (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tasks/${task.id}`}>
            Xem chi tiết
          </Link>
        </Button>
      ),
    },
  ];

  // Column definitions for Attendance table
  const attendanceColumns = [
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Giờ vào',
      key: 'thoi_gian_bat_dau',
    },
    {
      title: 'Giờ ra',
      key: 'thoi_gian_ket_thuc',
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      render: (value: string) => (
        <Badge variant={value === 'approved' ? 'success' : 'secondary'}>
          {formatStatus(value || 'pending')}
        </Badge>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: (_: string, record: EmployeeClockInOut) => (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/attendance?employeeId=${employeeId}&date=${record.ngay}`}>
            Xem chấm công
          </Link>
        </Button>
      ),
    },
  ];

  // Column definitions for Assets table
  const assetColumns = [
    {
      title: 'Tên tài sản',
      key: 'ten_csvc',
    },
    {
      title: 'Loại',
      key: 'loai',
    },
    {
      title: 'Số lượng',
      key: 'so_luong',
    },
    {
      title: 'Trạng thái',
      key: 'tinh_trang',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {formatStatus(value)}
        </Badge>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: (_: string, asset: Asset) => (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/assets/${asset.id}`}>
            Xem chi tiết
          </Link>
        </Button>
      ),
    },
  ];

  // Column definitions for Finances table
  const financeColumns = [
    {
      title: 'Ngày',
      key: 'ngay',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Loại',
      key: 'loai_thu_chi',
    },
    {
      title: 'Diễn giải',
      key: 'dien_giai',
    },
    {
      title: 'Số tiền',
      key: 'tong_tien',
      render: (value: number) => value?.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: (_: string, finance: Finance) => (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/finance/${finance.id}`}>
            Xem chi tiết
          </Link>
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!employee) {
    return <div>Không tìm thấy thông tin nhân viên</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{employee.ten_nhan_su}</h2>
          <p className="text-muted-foreground">{employee.chuc_danh || 'Chưa có chức danh'}</p>
        </div>
        <Button onClick={() => navigate(`/employees/edit/${employeeId}`)} className="flex items-center gap-1">
          <PenSquare className="h-4 w-4" /> Chỉnh sửa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Họ và tên</p>
            <p>{employee.ten_nhan_su}</p>
          </div>
          {employee.ten_tieng_anh && (
            <div>
              <p className="text-sm font-medium">Tên tiếng Anh</p>
              <p>{employee.ten_tieng_anh}</p>
            </div>
          )}
          {employee.dien_thoai && (
            <div>
              <p className="text-sm font-medium">Điện thoại</p>
              <p>{employee.dien_thoai}</p>
            </div>
          )}
          {employee.email && (
            <div>
              <p className="text-sm font-medium">Email</p>
              <p>{employee.email}</p>
            </div>
          )}
          {employee.dia_chi && (
            <div>
              <p className="text-sm font-medium">Địa chỉ</p>
              <p>{employee.dia_chi}</p>
            </div>
          )}
          {employee.gioi_tinh && (
            <div>
              <p className="text-sm font-medium">Giới tính</p>
              <p>{employee.gioi_tinh}</p>
            </div>
          )}
          {employee.ngay_sinh && (
            <div>
              <p className="text-sm font-medium">Ngày sinh</p>
              <p>{formatDate(employee.ngay_sinh)}</p>
            </div>
          )}
          {employee.bo_phan && (
            <div>
              <p className="text-sm font-medium">Bộ phận</p>
              <p>{employee.bo_phan}</p>
            </div>
          )}
          {employee.chuc_danh && (
            <div>
              <p className="text-sm font-medium">Chức danh</p>
              <p>{employee.chuc_danh}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Trạng thái</p>
            <Badge variant={employee.tinh_trang_lao_dong === 'active' ? 'success' : 'destructive'}>
              {formatStatus(employee.tinh_trang_lao_dong)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="assets">Tài sản</TabsTrigger>
          <TabsTrigger value="finances">Thu chi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Công việc</CardTitle>
              <CardDescription>Danh sách công việc được giao cho nhân viên này</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground">Chưa có công việc nào được giao</p>
              ) : (
                <DataTable columns={taskColumns} data={tasks} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Chấm công</CardTitle>
              <CardDescription>Lịch sử chấm công</CardDescription>
            </CardHeader>
            <CardContent>
              {attendance.length === 0 ? (
                <p className="text-muted-foreground">Chưa có dữ liệu chấm công</p>
              ) : (
                <DataTable columns={attendanceColumns} data={attendance} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Tài sản</CardTitle>
              <CardDescription>Tài sản được giao cho nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <p className="text-muted-foreground">Chưa có tài sản nào được giao</p>
              ) : (
                <DataTable columns={assetColumns} data={assets} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Thu chi</CardTitle>
              <CardDescription>Các giao dịch tài chính liên quan</CardDescription>
            </CardHeader>
            <CardContent>
              {finances.length === 0 ? (
                <p className="text-muted-foreground">Chưa có giao dịch tài chính nào</p>
              ) : (
                <DataTable columns={financeColumns} data={finances} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
