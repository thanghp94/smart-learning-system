
import React, { useState, useEffect } from 'react';
import TablePageLayout from '@/components/common/TablePageLayout';
import { taskService } from '@/lib/supabase';
import { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import TaskFilters from './components/TaskFilters';
import PlaceholderPage from '@/components/common/PlaceholderPage';
import { CheckSquare } from 'lucide-react';
import TasksActionBar from './TasksActionBar';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    facility: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching tasks...');
      const data = await taskService.getAll();
      console.log('Fetched tasks:', data);
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
      await taskService.update(taskId, { trang_thai: 'completed' });
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
    let matchesFacility = true;

    if (filters.status) {
      matchesStatus = task.trang_thai === filters.status;
    }

    if (filters.priority) {
      matchesPriority = task.cap_do === filters.priority;
    }

    if (filters.assignee) {
      matchesAssignee = task.nguoi_phu_trach === filters.assignee;
    }

    if (filters.facility && task.doi_tuong === 'co_so') {
      matchesFacility = task.doi_tuong_id === filters.facility;
    } else if (filters.facility) {
      matchesFacility = false;
    }

    return matchesStatus && matchesPriority && matchesAssignee && matchesFacility;
  });

  if (tasks.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Công Việc"
        description="Quản lý các công việc và nhiệm vụ"
        icon={<CheckSquare className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddTask}
      />
    );
  }

  return (
    <TablePageLayout
      title="Công Việc"
      description="Quản lý các công việc và nhiệm vụ"
      actions={
        <div className="flex items-center space-x-2">
          <TaskFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
          <TasksActionBar
            onRefresh={fetchTasks}
            onAddClick={handleAddTask}
          />
        </div>
      }
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
