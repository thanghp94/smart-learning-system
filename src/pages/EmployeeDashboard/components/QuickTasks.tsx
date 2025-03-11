
import React from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { taskService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface QuickTasksProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

const QuickTasks: React.FC<QuickTasksProps> = ({ tasks, onTaskUpdate }) => {
  const { toast } = useToast();

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>Không có công việc nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.update(taskId, {
        trang_thai: 'completed',
        ngay_hoan_thanh: format(new Date(), 'yyyy-MM-dd')
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành công việc',
      });
      
      onTaskUpdate();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái công việc',
        variant: 'destructive'
      });
    }
  };

  const getTaskPriorityStyles = (task: Task) => {
    if (!task.ngay_den_han) return {};
    
    if (isPast(new Date(task.ngay_den_han)) && task.trang_thai !== 'completed') {
      return { borderLeft: '4px solid #ef4444', paddingLeft: '12px' }; // Red for overdue
    }
    
    if (isToday(new Date(task.ngay_den_han))) {
      return { borderLeft: '4px solid #f97316', paddingLeft: '12px' }; // Orange for due today
    }
    
    if (task.cap_do === 'Cao') {
      return { borderLeft: '4px solid #fbbf24', paddingLeft: '12px' }; // Yellow for high priority
    }
    
    return { borderLeft: '4px solid #22c55e', paddingLeft: '12px' }; // Green for normal
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div 
              className="flex justify-between items-start" 
              style={getTaskPriorityStyles(task)}
            >
              <div className="space-y-1">
                <div className="font-medium">{task.ten_viec}</div>
                <div className="text-sm text-muted-foreground">{task.dien_giai}</div>
                {task.ngay_den_han && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    <span className={`${isPast(new Date(task.ngay_den_han)) && task.trang_thai !== 'completed' ? 'text-destructive font-medium' : ''}`}>
                      {format(new Date(task.ngay_den_han), 'dd/MM/yyyy')}
                      {isToday(new Date(task.ngay_den_han)) && (
                        <span className="ml-1 text-amber-500 font-medium">(Hôm nay)</span>
                      )}
                      {isPast(new Date(task.ngay_den_han)) && task.trang_thai !== 'completed' && (
                        <span className="ml-1 text-destructive font-medium">(Quá hạn)</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleCompleteTask(task.id)}
                className="mt-1"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickTasks;
