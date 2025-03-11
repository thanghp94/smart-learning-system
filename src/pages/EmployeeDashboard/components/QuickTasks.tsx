
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Plus, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/lib/types';
import { taskService } from '@/lib/supabase';
import { Input } from '@/components/ui/input';

interface QuickTasksProps {
  employeeId: string;
}

const QuickTasks: React.FC<QuickTasksProps> = ({ employeeId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // Fetch tasks assigned to the employee
      const tasksData = await taskService.getByAssignee(employeeId);
      // Sort by completion status and creation date
      const sortedTasks = [...tasksData].sort((a, b) => {
        // Sort by completion status first
        if ((a.trang_thai === 'completed') !== (b.trang_thai === 'completed')) {
          return a.trang_thai === 'completed' ? 1 : -1;
        }
        // Then by creation date (newest first for active tasks)
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
      setTasks(sortedTasks);
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

  useEffect(() => {
    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    
    try {
      setIsAddingTask(true);
      
      const newTask: Partial<Task> = {
        tieu_de: newTaskText,
        mo_ta: '',
        nguoi_thuc_hien: employeeId,
        nguoi_giao: employeeId, // Self-assigned
        ngay_bat_dau: new Date().toISOString(),
        han_hoan_thanh: null,
        muc_do_uu_tien: 'medium',
        trang_thai: 'active',
      };
      
      await taskService.create(newTask);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm công việc mới',
      });
      
      setNewTaskText('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm công việc',
        variant: 'destructive',
      });
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.update(taskId, {
        trang_thai: 'completed',
        ngay_hoan_thanh: new Date().toISOString(),
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
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.delete(taskId);
      
      toast({
        title: 'Thành công',
        description: 'Đã xóa công việc',
      });
      
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa công việc',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Công việc hôm nay</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Thêm công việc mới..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <Button onClick={handleAddTask} disabled={isAddingTask || !newTaskText.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-2">Đang tải...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-2 text-muted-foreground">Không có công việc nào</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-2 rounded border ${
                  task.trang_thai === 'completed' ? 'bg-muted line-through text-muted-foreground' : ''
                }`}
              >
                <span className="truncate mr-2">{task.tieu_de}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {task.trang_thai !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCompleteTask(task.id)}
                      title="Hoàn thành"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Xóa"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickTasks;
