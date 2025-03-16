
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CreditCard, User2Icon, Clock, BookOpen, CheckSquare, RotateCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { taskService } from '@/lib/supabase';

const PersonalDashboard = () => {
  const [employee, setEmployee] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const fetchPersonalData = async () => {
    try {
      setIsLoading(true);
      // For now, mock data - in a real app this would come from auth context or API
      const userData = {
        id: '123',
        ten_nhan_su: 'Nguyễn Văn A',
        chuc_danh: 'Giáo viên',
        bo_phan: 'Đào tạo',
        ngay_sinh: '1990-01-01',
        dien_thoai: '0923456789',
        email: 'nguyen.van.a@example.com'
      };
      setEmployee(userData);

      // Fetch tasks
      try {
        const tasksData = await taskService.getAll();
        setTasks(tasksData.slice(0, 5)); // Just get the first 5 tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching personal data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu cá nhân',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        employee && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{employee.ten_nhan_su}</h1>
                  <p className="text-muted-foreground">{employee.chuc_danh} ({employee.bo_phan})</p>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>{employee.ngay_sinh ? format(new Date(employee.ngay_sinh), 'dd/MM/yyyy') : 'N/A'}</span>
                    
                    <span className="font-medium">Điện thoại:</span>
                    <span>{employee.dien_thoai || 'N/A'}</span>
                    
                    <span className="font-medium">Email:</span>
                    <span>{employee.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Số ngày làm việc</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22</div>
                    <p className="text-sm text-muted-foreground">Tháng hiện tại</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lương</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,000,000 VNĐ</div>
                    <p className="text-sm text-muted-foreground">Đã thanh toán</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Giờ dạy</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48h</div>
                    <p className="text-sm text-muted-foreground">Tháng hiện tại</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Buổi học</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-sm text-muted-foreground">Tháng hiện tại</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Công việc cần làm</h2>
                <Button variant="outline" size="sm" onClick={fetchPersonalData}>
                  <RotateCw className="h-4 w-4 mr-1" /> Làm mới
                </Button>
              </div>
              
              <div className="bg-white rounded-md border">
                {tasks.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Không có công việc nào
                  </div>
                ) : (
                  <ScrollArea className="h-80">
                    {tasks.map((task, index) => (
                      <div 
                        key={task.id || index} 
                        className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{task.ten_viec || 'Công việc không tên'}</h3>
                          <Badge className={getTaskPriorityClass(task.cap_do)}>
                            {task.cap_do === 'high' ? 'Quan trọng' : 
                             task.cap_do === 'medium' ? 'Vừa' : 'Thấp'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.mo_ta || 'Không có mô tả'}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            {task.ngay_den_han ? `Hạn: ${format(new Date(task.ngay_den_han), 'dd/MM/yyyy')}` : 'Không có hạn'}
                          </span>
                          <Badge variant={task.trang_thai === 'completed' ? 'success' : 'outline'}>
                            {task.trang_thai === 'completed' ? 'Hoàn thành' : 
                             task.trang_thai === 'in_progress' ? 'Đang làm' : 'Chờ xử lý'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch hôm nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Không có lịch hôm nay</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Chưa có hoạt động nào gần đây</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default PersonalDashboard;
