import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckSquare, Clock, User, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { Employee, TeachingSession, Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { employeeService, teachingSessionService, taskService } from '@/lib/supabase';
import TodayClassesList from '../EmployeeDashboard/components/TodayClassesList';
import TodayAttendance from '../EmployeeDashboard/components/TodayAttendance';
import QuickTasks from '../EmployeeDashboard/components/QuickTasks';
import { supabase } from '@/lib/supabase/client';

const PersonalDashboard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'Chưa có thông tin';
    try {
      return date instanceof Date 
        ? date.toLocaleDateString('vi-VN') 
        : new Date(date).toLocaleDateString('vi-VN');
    } catch (e) {
      return String(date);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: 'Chưa đăng nhập',
            description: 'Vui lòng đăng nhập để xem thông tin cá nhân',
            variant: 'destructive',
          });
          return;
        }
        
        // Fetch employee data by email
        const employeeData = await employeeService.getByEmail(user.email || '');
        setEmployee(employeeData);
        
        if (employeeData) {
          // Fetch today's teaching sessions
          const today = new Date().toISOString().split('T')[0];
          const todaySessions = await teachingSessionService.getByTeacherAndDate(employeeData.id, today);
          setSessions(todaySessions);
        }
        
      } catch (error) {
        console.error('Error fetching personal dashboard data:', error);
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
  }, [toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Không tìm thấy thông tin cá nhân</p>
        <Button onClick={() => window.location.href = '/'}>Quay lại trang chủ</Button>
      </div>
    );
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
            <p className="text-muted-foreground">{employee.chuc_danh || 'Nhân viên'}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-md">
            <Clock className="w-4 h-4 mr-2" />
            <span>Ca làm việc hôm nay: 8:00 - 17:00</span>
          </div>
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
                  <p>{formatDate(employee.ngay_sinh)}</p>
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

          <Tabs defaultValue="classes">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="classes">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Lịch dạy hôm nay
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="w-4 h-4 mr-2" />
                Công việc
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Thông báo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="classes" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <TodayClassesList sessions={sessions} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <QuickTasks employeeId={employee.id} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center py-6 text-muted-foreground">
                    Không có thông báo mới
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <TodayAttendance employeeId={employee.id} />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Cơ sở làm việc</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {employee.co_so_name ? (
                <div>
                  <p className="font-medium">{employee.co_so_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">Địa chỉ: {employee.co_so_name}</p>
                </div>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  Chưa có thông tin cơ sở
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Liên kết nhanh</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem lịch dạy
                </Button>
                <Button variant="outline" className="justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Quản lý công việc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;
