
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeClockInOut } from '@/lib/types';
import { Employee, Task } from '@/lib/types';
import { employeeService } from '@/lib/supabase/employee-service';
import { taskService } from '@/lib/supabase/task-service';
import { employeeClockInService } from '@/lib/supabase/employee-clock-in-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatStatus } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface EmployeeDetailProps {
  employeeId: string;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<EmployeeClockInOut[]>([]);
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
        const tasksData = await taskService.getByEntityId('employee', employeeId);
        setTasks(tasksData);
        
        // Fetch attendance records
        const attendanceData = await employeeClockInService.getByEmployeeId(employeeId);
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load employee data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  // Column definitions for Tasks table
  const taskColumns: ColumnDef<Task>[] = [
    {
      accessorKey: 'ten_viec',
      header: 'Tên công việc',
    },
    {
      accessorKey: 'ngay_den_han',
      header: 'Deadline',
      cell: ({ row }) => formatDate(row.original.ngay_den_han),
    },
    {
      accessorKey: 'cap_do',
      header: 'Cấp độ',
    },
    {
      accessorKey: 'trang_thai',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.trang_thai === 'completed' ? 'success' : 'secondary'}>
          {formatStatus(row.original.trang_thai)}
        </Badge>
      ),
    },
  ];

  // Column definitions for Attendance table
  const attendanceColumns: ColumnDef<EmployeeClockInOut>[] = [
    {
      accessorKey: 'ngay',
      header: 'Ngày',
      cell: ({ row }) => formatDate(row.original.ngay),
    },
    {
      accessorKey: 'thoi_gian_bat_dau',
      header: 'Giờ vào',
    },
    {
      accessorKey: 'thoi_gian_ket_thuc',
      header: 'Giờ ra',
    },
    {
      accessorKey: 'trang_thai',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.trang_thai === 'approved' ? 'success' : 'secondary'}>
          {formatStatus(row.original.trang_thai)}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{employee.ten_nhan_su}</h2>
          <p className="text-muted-foreground">{employee.chuc_danh || 'No position'}</p>
        </div>
        <Button onClick={() => navigate(`/employees/edit/${employeeId}`)} className="flex items-center gap-1">
          <PenSquare className="h-4 w-4" /> Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Full Name</p>
            <p>{employee.ten_nhan_su}</p>
          </div>
          {employee.ten_tieng_anh && (
            <div>
              <p className="text-sm font-medium">English Name</p>
              <p>{employee.ten_tieng_anh}</p>
            </div>
          )}
          {employee.dien_thoai && (
            <div>
              <p className="text-sm font-medium">Phone</p>
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
              <p className="text-sm font-medium">Address</p>
              <p>{employee.dia_chi}</p>
            </div>
          )}
          {employee.gioi_tinh && (
            <div>
              <p className="text-sm font-medium">Gender</p>
              <p>{employee.gioi_tinh}</p>
            </div>
          )}
          {employee.ngay_sinh && (
            <div>
              <p className="text-sm font-medium">Date of Birth</p>
              <p>{formatDate(employee.ngay_sinh)}</p>
            </div>
          )}
          {employee.bo_phan && (
            <div>
              <p className="text-sm font-medium">Department</p>
              <p>{employee.bo_phan}</p>
            </div>
          )}
          {employee.chuc_danh && (
            <div>
              <p className="text-sm font-medium">Position</p>
              <p>{employee.chuc_danh}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Status</p>
            <Badge variant={employee.tinh_trang_lao_dong === 'active' ? 'success' : 'destructive'}>
              {formatStatus(employee.tinh_trang_lao_dong)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Tasks assigned to this employee</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks assigned</p>
              ) : (
                <DataTable columns={taskColumns} data={tasks} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Clock in/out history</CardDescription>
            </CardHeader>
            <CardContent>
              {attendance.length === 0 ? (
                <p className="text-muted-foreground">No attendance records</p>
              ) : (
                <DataTable columns={attendanceColumns} data={attendance} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
