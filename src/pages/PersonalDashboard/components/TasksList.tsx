
import React from 'react';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckSquare } from 'lucide-react';

interface TasksListProps {
  tasks: Task[];
}

export const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const getTaskPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground">
        <CheckSquare className="h-10 w-10 mb-2 opacity-30" />
        <p>Không có công việc nào</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
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
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.dien_giai || 'Không có mô tả'}</p>
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
  );
};
