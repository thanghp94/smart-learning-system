
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { taskService } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { CheckSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from '@/pages/Tasks/components/TaskForm';

interface QuickTasksProps {
  employeeId: string;
}

const QuickTasks: React.FC<QuickTasksProps> = ({ employeeId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Get tasks by user instead of getByEmployeeId
        const data = await taskService.getByUser(employeeId);
        // Filter to active tasks only (not completed)
        const activeTasks = data.filter(task => task.trang_thai !== 'completed');
        setTasks(activeTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [employeeId, refreshTrigger]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Use update method to set status to completed
      await taskService.update(taskId, { trang_thai: 'completed' });
      // Refresh the task list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleAddTask = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = () => {
    setShowAddForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Công việc cần làm</CardTitle>
          <Button size="sm" variant="ghost" onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-1" /> Thêm
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Không có công việc nào</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start justify-between p-2 border rounded hover:bg-muted/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{task.ten_viec}</p>
                  <div className="flex space-x-2 items-center">
                    {task.cap_do && (
                      <Badge variant={task.cap_do === 'high' ? 'destructive' : task.cap_do === 'medium' ? 'default' : 'outline'} className="text-xs">
                        {task.cap_do === 'high' ? 'Cao' : task.cap_do === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                    )}
                    {task.ngay_den_han && (
                      <span className="text-xs text-muted-foreground">
                        Hạn: {new Date(task.ngay_den_han).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleCompleteTask(task.id)}
                  className="h-7 w-7 p-0"
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {tasks.length > 5 && (
              <Button variant="link" className="w-full text-xs" asChild>
                <a href="/tasks">Xem tất cả công việc ({tasks.length})</a>
              </Button>
            )}
          </div>
        )}

        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm Công Việc Mới</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => setShowAddForm(false)}
              initialValues={{ nguoi_phu_trach: employeeId }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuickTasks;
