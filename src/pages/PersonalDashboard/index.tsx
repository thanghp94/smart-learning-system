
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Task, TeachingSession, Employee } from '@/lib/types';
import { taskService, teachingSessionService, employeeService } from '@/lib/supabase';
import { CheckSquare, Calendar, School, Plus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import TaskForm from '../Tasks/components/TaskForm';
import { supabase } from '@/lib/supabase/client';

const PersonalDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayClasses, setTodayClasses] = useState<TeachingSession[]>([]);
  const [facilityClasses, setFacilityClasses] = useState<TeachingSession[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // For demo purposes, we'll use the first employee
        const employees = await employeeService.getAll();
        if (employees.length > 0) {
          const user = employees[0];
          setCurrentUser(user);
          setIsTeacher(user.vai_tro === 'Giáo viên');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      if (!currentUser) return;

      // Fetch tasks assigned to the user
      const userTasks = await taskService.getByUser(currentUser.id);
      setTasks(userTasks.filter(task => task.trang_thai !== 'completed').slice(0, 5));

      // Get today's date
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch today's classes for this teacher
      if (isTeacher) {
        const teacherClasses = await teachingSessionService.getByTeacher(currentUser.id);
        setTodayClasses(
          teacherClasses
            .filter(session => session.ngay_hoc === today)
            .sort((a, b) => {
              if (a.thoi_gian_bat_dau && b.thoi_gian_bat_dau) {
                return a.thoi_gian_bat_dau.localeCompare(b.thoi_gian_bat_dau);
              }
              return 0;
            })
        );
      }

      // Fetch today's classes for this facility
      if (currentUser.co_so_id) {
        const facilityClasses = await teachingSessionService.getByFacility(currentUser.co_so_id);
        setFacilityClasses(
          facilityClasses
            .filter(session => session.ngay_hoc === today)
            .sort((a, b) => {
              if (a.thoi_gian_bat_dau && b.thoi_gian_bat_dau) {
                return a.thoi_gian_bat_dau.localeCompare(b.thoi_gian_bat_dau);
              }
              return 0;
            })
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu người dùng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setShowAddTaskForm(true);
  };

  const handleTaskFormSubmit = async () => {
    setShowAddTaskForm(false);
    await fetchUserData();
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.complete(taskId);
      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành công việc',
      });
      fetchUserData();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái công việc',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '--:--';
    return time;
  };

  return (
    <div className="container mx-auto py-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard cá nhân</h1>
          <p className="text-muted-foreground">
            Xin chào, {currentUser?.ten_nhan_su || 'Người dùng'}
          </p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-1" /> Thêm công việc
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Công việc cần làm
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">Đang tải...</div>
            ) : tasks.length > 0 ? (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{task.ten_viec}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.ngay_den_han ? format(new Date(task.ngay_den_han), 'dd/MM/yyyy') : 'Không có hạn'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Không có công việc cần làm
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/tasks'}>
                Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {isTeacher && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lớp của tôi hôm nay
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">Đang tải...</div>
              ) : todayClasses.length > 0 ? (
                <ul className="space-y-2">
                  {todayClasses.map((session) => (
                    <li
                      key={session.id}
                      className="border-b pb-2"
                    >
                      <p className="font-medium">
                        {session.class_name || 'Lớp chưa đặt tên'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Không có lớp học hôm nay
                </div>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/teaching-sessions'}>
                  Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lớp học hôm nay tại cơ sở {currentUser?.co_so_name || ''}
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">Đang tải...</div>
            ) : facilityClasses.length > 0 ? (
              <ul className="space-y-2">
                {facilityClasses.map((session) => (
                  <li
                    key={session.id}
                    className="border-b pb-2"
                  >
                    <p className="font-medium">
                      {session.class_name || 'Lớp chưa đặt tên'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Không có lớp học hôm nay tại cơ sở
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/teaching-sessions'}>
                Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddTaskForm} onOpenChange={setShowAddTaskForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Công Việc Mới</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleTaskFormSubmit} onCancel={() => setShowAddTaskForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalDashboard;
