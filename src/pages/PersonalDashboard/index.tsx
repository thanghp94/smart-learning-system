
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeService, facilityService, teachingSessionService, taskService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Employee, Facility, Task, TeachingSession } from '@/lib/types';
import { format } from 'date-fns';
import { Calendar, CheckSquare, Clock, Home, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TodayAttendance from '../EmployeeDashboard/components/TodayAttendance';
import TodayClassesList from '../EmployeeDashboard/components/TodayClassesList';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import QuickTasks from '../EmployeeDashboard/components/QuickTasks';

const PersonalDashboard = () => {
  const [userProfile, setUserProfile] = useState<Employee | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [todayClasses, setTodayClasses] = useState<TeachingSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Placeholder user ID - in a real app, this would come from auth
  const userId = "1234"; // Replace with actual user ID

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const employees = await employeeService.getAll();
        const currentUser = employees[0]; // Placeholder - would use userId to find
        
        if (currentUser) {
          setUserProfile(currentUser);
          
          // Fetch facilities for this employee
          if (currentUser.co_so_id && currentUser.co_so_id.length > 0) {
            const allFacilities = await facilityService.getAll();
            const userFacilities = allFacilities.filter(
              (facility) => currentUser.co_so_id.includes(facility.id)
            );
            setFacilities(userFacilities);
          }
          
          // Fetch today's tasks
          const userTasks = await taskService.getByAssignee(currentUser.id);
          setTasks(userTasks.filter(task => 
            task.trang_thai !== 'completed' && 
            new Date(task.ngay_den_han || '') >= new Date()
          ));
          
          // Fetch today's classes based on role
          const isTeacher = currentUser.bo_phan === 'Giáo viên';
          
          if (isTeacher) {
            // Fetch classes where this employee is the teacher
            const teacherClasses = await teachingSessionService.getByTeacher(
              currentUser.id, 
              today
            );
            setTodayClasses(teacherClasses);
          } else {
            // Fetch classes for the employee's facilities
            let facilityClasses: TeachingSession[] = [];
            
            for (const facilityId of currentUser.co_so_id || []) {
              const classes = await teachingSessionService.getByFacility(
                facilityId.toString(),
                today
              );
              facilityClasses = [...facilityClasses, ...classes];
            }
            
            setTodayClasses(facilityClasses);
          }
        }
      } catch (error) {
        console.error('Error fetching personal dashboard data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu bảng điều khiển cá nhân',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển cá nhân</h1>
          <p className="text-muted-foreground">
            Xin chào, {userProfile?.ten_nhan_su}! Hôm nay là {format(new Date(), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi học hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayClasses.length > 0 
                ? `Buổi học đầu tiên lúc ${todayClasses[0]?.thoi_gian_bat_dau || 'N/A'}`
                : 'Không có buổi học nào hôm nay'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công việc đang chờ</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length > 0 
                ? `${tasks.filter(t => t.ngay_den_han === today).length} việc đến hạn hôm nay`
                : 'Không có công việc đang chờ'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cơ sở làm việc</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.length > 0 
                ? facilities.map(f => f.ten_co_so).join(', ')
                : 'Chưa được gán cơ sở nào'}
            </p>
          </CardContent>
        </Card>
      </div>

      {userProfile && (
        <TodayAttendance employeeId={userProfile.id} />
      )}

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
          <TabsTrigger value="classes">Buổi học hôm nay</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Công việc cần làm</h2>
            <Button onClick={() => navigate('/tasks/new')} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Thêm việc
            </Button>
          </div>
          
          <QuickTasks tasks={tasks} onTaskUpdate={() => {
            // Refresh tasks after update
          }} />
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {userProfile?.bo_phan === 'Giáo viên' 
                ? 'Lịch dạy hôm nay của tôi' 
                : 'Lịch học hôm nay của cơ sở'}
            </h2>
            <Button onClick={() => navigate('/teaching-sessions')} size="sm" variant="outline">
              Xem tất cả
            </Button>
          </div>
          
          <TodayClassesList sessions={todayClasses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalDashboard;
