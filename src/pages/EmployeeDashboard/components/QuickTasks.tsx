
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Task } from '@/lib/types';
import { taskService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface QuickTasksProps {
  employeeId: string;
}

const taskSchema = z.object({
  ten_viec: z.string().min(1, "Vui lòng nhập tên công việc"),
  dien_giai: z.string().optional(),
  cap_do: z.string().default("medium"),
  ngay_den_han: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const QuickTasks: React.FC<QuickTasksProps> = ({ employeeId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ten_viec: "",
      dien_giai: "",
      cap_do: "medium",
      ngay_den_han: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  const fetchTasks = async () => {
    if (!employeeId) return;
    
    try {
      setIsLoading(true);
      const data = await taskService.getByAssignee(employeeId);
      // Filter incomplete tasks and sort by deadline
      const incompleteTasks = data
        .filter(task => task.trang_thai !== 'completed')
        .sort((a, b) => {
          if (!a.ngay_den_han) return 1;
          if (!b.ngay_den_han) return -1;
          return new Date(a.ngay_den_han).getTime() - new Date(b.ngay_den_han).getTime();
        });
      setTasks(incompleteTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách công việc',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (values: TaskFormValues) => {
    try {
      setIsLoading(true);
      await taskService.create({
        ten_viec: values.ten_viec,
        dien_giai: values.dien_giai,
        cap_do: values.cap_do,
        ngay_den_han: values.ngay_den_han,
        nguoi_phu_trach: employeeId,
        trang_thai: 'pending',
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm công việc mới',
      });
      
      setShowAddTask(false);
      form.reset();
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm công việc',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await taskService.update(taskId, {
        trang_thai: 'completed',
        ngay_hoan_thanh: new Date().toISOString().split('T')[0],
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành công việc',
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái công việc',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: string | undefined) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Thấp</Badge>;
      case 'medium':
        return <Badge variant="secondary">Trung bình</Badge>;
      case 'high':
        return <Badge variant="warning">Cao</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      default:
        return <Badge variant="secondary">Trung bình</Badge>;
    }
  };

  const isTaskOverdue = (deadline: string | undefined) => {
    if (!deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            Công việc gần đây
          </div>
          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm công việc mới</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddTask)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ten_viec"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên công việc</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên công việc" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dien_giai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diễn giải</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả chi tiết công việc" 
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cap_do"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cấp độ ưu tiên</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn cấp độ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Thấp</SelectItem>
                              <SelectItem value="medium">Trung bình</SelectItem>
                              <SelectItem value="high">Cao</SelectItem>
                              <SelectItem value="urgent">Khẩn cấp</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ngay_den_han"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày đến hạn</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading}>Thêm mới</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Không có công việc nào
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start justify-between border p-3 rounded-md">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{task.ten_viec}</span>
                    {getPriorityBadge(task.cap_do)}
                  </div>
                  {task.ngay_den_han && (
                    <div className="flex items-center text-xs">
                      {isTaskOverdue(task.ngay_den_han) ? (
                        <AlertTriangle className="h-3 w-3 text-destructive mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      <span className={isTaskOverdue(task.ngay_den_han) ? "text-destructive" : "text-muted-foreground"}>
                        {format(new Date(task.ngay_den_han), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {tasks.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm" className="text-xs">
                  Xem tất cả ({tasks.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickTasks;
