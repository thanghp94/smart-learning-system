
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { taskService } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface QuickTasksProps {
  employeeId: string;
}

const QuickTasks: React.FC<QuickTasksProps> = ({ employeeId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const employeeTasks = await taskService.getByUser(employeeId);
      
      // Filter for tasks that are not completed
      const activeTasks = employeeTasks.filter(
        (task) => task.trang_thai !== 'completed'
      );
      
      // Sort by due date - closest first
      activeTasks.sort((a, b) => {
        if (!a.ngay_den_han) return 1;
        if (!b.ngay_den_han) return -1;
        return new Date(a.ngay_den_han).getTime() - new Date(b.ngay_den_han).getTime();
      });
      
      setTasks(activeTasks.slice(0, 3)); // Show at most 3 tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    navigate('/tasks');
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <CheckSquare className="mr-2 h-5 w-5" />
          Công việc
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={handleAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-1">{task.ten_viec}</h3>
                  <Badge
                    variant={
                      task.cap_do === 'high' ? 'destructive' : 
                      task.cap_do === 'medium' ? 'secondary' : 'outline'
                    }
                    className="ml-2 shrink-0"
                  >
                    {task.cap_do === 'high' ? 'Cao' : 
                     task.cap_do === 'medium' ? 'Vừa' : 'Thấp'}
                  </Badge>
                </div>
                {task.ngay_den_han && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Hạn: {format(new Date(task.ngay_den_han), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                )}
              </div>
            ))}
            
            <Button
              variant="link"
              className="w-full p-0 mt-2"
              onClick={() => navigate('/tasks')}
            >
              Xem tất cả công việc
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Không có công việc nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickTasks;
