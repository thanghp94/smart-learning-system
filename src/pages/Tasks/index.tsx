
import React, { useState, useEffect } from 'react';
import TablePageLayout from '@/components/common/TablePageLayout';
import { Button } from '@/components/ui/button';
import { Plus, Filter, RotateCw, CheckSquare, Clock } from 'lucide-react';
import { taskService } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import TaskFilters from './components/TaskFilters';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
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

  const handleAddTask = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async () => {
    setShowAddForm(false);
    await fetchTasks();
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await taskService.complete(taskId);
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

  const filteredTasks = tasks.filter((task) => {
    let matchesStatus = true;
    let matchesPriority = true;
    let matchesAssignee = true;

    if (filters.status) {
      matchesStatus = task.trang_thai === filters.status;
    }

    if (filters.priority) {
      matchesPriority = task.cap_do === filters.priority;
    }

    if (filters.assignee) {
      matchesAssignee = task.nguoi_phu_trach === filters.assignee;
    }

    return matchesStatus && matchesPriority && matchesAssignee;
  });

  const tableActions = (
    <div className="flex items-center space-x-2">
      <TaskFilters 
        filters={filters} 
        setFilters={setFilters} 
      />
      
      <Button variant="outline" size="sm" className="h-8" onClick={fetchTasks}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      
      <Button size="sm" className="h-8" onClick={handleAddTask}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Công Việc
      </Button>
    </div>
  );

  return (
    <TablePageLayout
      title="Công Việc"
      description="Quản lý các công việc và nhiệm vụ"
      icon={<CheckSquare className="h-6 w-6" />}
      actions={tableActions}
    >
      <TaskTable 
        tasks={filteredTasks} 
        isLoading={isLoading} 
        onTaskComplete={handleTaskComplete} 
      />

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Công Việc Mới</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleFormSubmit} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
    </TablePageLayout>
  );
};

export default Tasks;
