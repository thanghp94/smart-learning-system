
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, CheckSquare, Clock, Plus, School 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  employeeService, 
  taskService, 
  teachingSessionService,
  facilityService
} from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Task, Employee, TeachingSession, Facility } from '@/lib/types';
import TablePageLayout from '@/components/common/TablePageLayout';
import { supabase } from '@/lib/supabase/client';

const PersonalDashboard = () => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [todayClasses, setTodayClasses] = useState<TeachingSession[]>([]);
  const [facilityClasses, setFacilityClasses] = useState<TeachingSession[]>([]);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get employee data by auth user
          const employees = await employeeService.getAll();
          const employee = employees.find((emp) => emp.email === user.email);
          
          if (employee) {
            setCurrentUser(employee);
            
            // If this is a teacher, fetch their classes for today
            if (employee.vai_tro === 'teacher') {
              fetchTodayClasses(employee.id);
            }
            
            // Fetch tasks assigned to this employee
            fetchUserTasks(employee.id);
            
            // If the employee is associated with a facility, fetch facility info
            if (employee.co_so_id) {
              fetchFacilityInfo(employee.co_so_id);
              fetchFacilityClasses(employee.co_so_id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const fetchUserTasks = async (employeeId: string) => {
    try {
      // Use getByUser which was implemented in the task-service
      const tasks = await taskService.getByUser(employeeId);
      setUserTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  const fetchTodayClasses = async (teacherId: string) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const sessions = await teachingSessionService.getByTeacher(teacherId);
      
      // Filter for today's sessions
      const todaySessions = sessions.filter(
        (session) => session.ngay_hoc === today
      );
      
      setTodayClasses(todaySessions);
    } catch (error) {
      console.error('Error fetching today classes:', error);
    }
  };
  
  const fetchFacilityInfo = async (facilityId: string) => {
    try {
      const facilityData = await facilityService.getById(facilityId);
      setFacility(facilityData);
    } catch (error) {
      console.error('Error fetching facility info:', error);
    }
  };
  
  const fetchFacilityClasses = async (facilityId: string) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const sessions = await teachingSessionService.getByFacility(facilityId);
      
      // Filter for today's sessions
      const todaySessions = sessions.filter(
        (session) => session.ngay_hoc === today
      );
      
      setFacilityClasses(todaySessions);
    } catch (error) {
      console.error('Error fetching facility classes:', error);
    }
  };
  
  const handleAddTask = () => {
    navigate('/tasks', { state: { openAddForm: true } });
  };
  
  const formatTime = (time: string) => {
    return time ? time.substring(0, 5) : ''; // Format HH:MM
  };
  
  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };
  
  const handleClassClick = (sessionId: string) => {
    navigate(`/teaching-sessions/${sessionId}`);
  };

  if (isLoading) {
    return (
      <TablePageLayout
        title="Bảng điều khiển cá nhân"
        description="Xem thông tin công việc và lớp học hôm nay của bạn"
      >
        <div className="flex items-center justify-center h-60">
          <p>Đang tải dữ liệu...</p>
        </div>
      </TablePageLayout>
    );
  }

  return (
    <TablePageLayout
      title="Bảng điều khiển cá nhân" 
      description={`Xin chào, ${currentUser?.ten_nhan_su || 'Người dùng'}!`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Công việc của tôi
            </CardTitle>
            <Button size="sm" onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </Button>
          </CardHeader>
          <CardContent>
            {userTasks.length > 0 ? (
              <div className="space-y-4">
                {userTasks
                  .filter(task => task.trang_thai !== 'completed')
                  .slice(0, 5)
                  .map((task) => (
                    <div 
                      key={task.id}
                      className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.ten_viec}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.dien_giai || 'Không có diễn giải'}
                          </p>
                        </div>
                        <Badge
                          variant={
                            task.cap_do === 'high' ? 'destructive' : 
                            task.cap_do === 'medium' ? 'secondary' : 'outline'
                          }
                        >
                          {task.cap_do === 'high' ? 'Cao' : 
                           task.cap_do === 'medium' ? 'Vừa' : 'Thấp'}
                        </Badge>
                      </div>
                      {task.ngay_den_han && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(task.ngay_den_han), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      )}
                    </div>
                  ))
                }
                
                {userTasks.filter(task => task.trang_thai !== 'completed').length > 5 && (
                  <Button variant="link" onClick={() => navigate('/tasks')} className="p-0">
                    Xem tất cả công việc
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Bạn chưa có công việc nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <div className="text-4xl font-bold">
                {format(new Date(), 'dd', { locale: vi })}
              </div>
              <div className="text-xl">
                {format(new Date(), 'MMMM yyyy', { locale: vi })}
              </div>
              <div className="mt-2">
                {format(new Date(), 'EEEE', { locale: vi })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes section - shown only for teachers */}
        {currentUser?.vai_tro === 'teacher' && todayClasses.length > 0 && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="mr-2 h-5 w-5" />
                Lớp học của tôi hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((session) => (
                  <div 
                    key={session.id}
                    className="p-3 border rounded-md hover:bg-muted cursor-pointer flex justify-between items-center"
                    onClick={() => handleClassClick(session.id)}
                  >
                    <div>
                      <h3 className="font-medium">{session.class_name || 'Lớp không có tên'}</h3>
                      <div className="text-sm text-muted-foreground">
                        <span>Buổi {session.session_id}</span>
                        {session.phong_hoc_id && (
                          <span> · Phòng {session.phong_hoc_id}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Facility classes section - shown only for facility managers */}
        {facility && facilityClasses.length > 0 && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="mr-2 h-5 w-5" />
                Lớp học tại {facility.ten_co_so} hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facilityClasses.map((session) => (
                  <div 
                    key={session.id}
                    className="p-3 border rounded-md hover:bg-muted cursor-pointer flex justify-between items-center"
                    onClick={() => handleClassClick(session.id)}
                  >
                    <div>
                      <h3 className="font-medium">{session.class_name || 'Lớp không có tên'}</h3>
                      <div className="text-sm text-muted-foreground">
                        <span>Buổi {session.session_id}</span>
                        {session.phong_hoc_id && (
                          <span> · Phòng {session.phong_hoc_id}</span>
                        )}
                        {session.giao_vien && (
                          <span> · GV: {session.giao_vien}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatTime(session.thoi_gian_bat_dau)} - {formatTime(session.thoi_gian_ket_thuc)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TablePageLayout>
  );
};

export default PersonalDashboard;
