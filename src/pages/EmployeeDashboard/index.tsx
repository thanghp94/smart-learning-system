
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, TeachingSession } from '@/lib/types';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { employeeService, teachingSessionService } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Bell, CalendarDays, CheckSquare, Clock, Mail, Phone, User } from 'lucide-react';
import TodayAttendance from './components/TodayAttendance';
import TodayClassesList from './components/TodayClassesList';
import QuickTasks from './components/QuickTasks';

const EmployeeDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (!id) return;
        
        // Fetch employee data
        const employeeData = await employeeService.getById(id);
        setEmployee(employeeData);
        
        // Fetch today's teaching sessions
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = await teachingSessionService.getByTeacherAndDate(id, today);
        setSessions(todaySessions);
        
      } catch (error) {
        console.error('Error fetching employee dashboard data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (!employee) {
    return <div className="flex justify-center items-center h-screen">Không tìm thấy thông tin nhân viên</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-muted flex items-center justify-center">
            {employee.hinh_anh ? (
              <img
                src={employee.hinh_anh}
                alt={employee.ten_nhan_su}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{employee.ten_nhan_su}</h1>
            <p className="text-muted-foreground">{employee.chuc_danh || 'Chưa có chức danh'}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Gửi email
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Gọi điện
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{employee.email || 'Chưa có thông tin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                  <p>{employee.dien_thoai || 'Chưa có thông tin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                  <p>{employee.dia_chi || 'Chưa có thông tin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
                  <p>{employee.ngay_sinh || 'Chưa có thông tin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Bộ phận</p>
                  <p>{employee.bo_phan || 'Chưa có thông tin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Vai trò</p>
                  <p>{employee.vai_tro || 'Chưa có thông tin'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <TodayClassesList sessions={sessions} />
        </div>

        <div className="space-y-6">
          <TodayAttendance employeeId={id || ''} />
          <QuickTasks employeeId={id || ''} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
