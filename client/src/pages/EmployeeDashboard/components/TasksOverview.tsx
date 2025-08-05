
import React, { useEffect, useState } from 'react';
import { taskService } from "@/lib/database";
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const TasksOverview = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data.filter(task => task.trang_thai !== 'completed').slice(0, 5));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    
    loadTasks();
  }, []);

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Không có công việc nào</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{task.ten_viec}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(task.ngay_den_han).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <Badge variant={task.cap_do === 'high' ? 'destructive' : 'default'}>
              {task.trang_thai}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksOverview;
