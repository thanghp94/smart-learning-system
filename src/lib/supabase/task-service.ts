
import { Task } from '../types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';

export const taskService = {
  getAll: () => fetchAll<Task>('tasks'),
  getById: (id: string) => fetchById<Task>('tasks', id),
  create: (task: Partial<Task>) => insert<Task>('tasks', task),
  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    // If completing a task, set the completion date
    if (updates.trang_thai === 'completed' && !updates.ngay_hoan_thanh) {
      updates.ngay_hoan_thanh = new Date().toISOString().split('T')[0];
    }
    
    // Log status change if it's changing
    const currentTask = await fetchById<Task>('tasks', id);
    if (currentTask && updates.trang_thai && currentTask.trang_thai !== updates.trang_thai) {
      await logActivity(
        'Cập nhật trạng thái',
        'Công việc',
        `${currentTask.ten_viec}: ${currentTask.trang_thai} -> ${updates.trang_thai}`,
        'Hệ thống'
      );
    }
    
    return update<Task>('tasks', id, updates);
  },
  delete: (id: string) => remove('tasks', id),
  getByAssignee: async (employeeId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_phu_trach', employeeId);
    
    if (error) {
      console.error('Error fetching tasks by assignee:', error);
      throw error;
    }
    
    return data as Task[];
  },
  // Get overdue tasks
  getOverdueTasks: async (): Promise<Task[]> => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .lt('ngay_den_han', today)
      .neq('trang_thai', 'completed');
    
    if (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
    
    return data as Task[];
  },
  // Get tasks due soon (within 7 days)
  getTasksDueSoon: async (days: number = 7): Promise<Task[]> => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('ngay_den_han', todayStr)
      .lte('ngay_den_han', futureDateStr)
      .neq('trang_thai', 'completed');
    
    if (error) {
      console.error('Error fetching tasks due soon:', error);
      throw error;
    }
    
    return data as Task[];
  },
  // Mark a task as completed
  markAsCompleted: async (id: string): Promise<Task> => {
    const today = new Date().toISOString().split('T')[0];
    
    return update<Task>('tasks', id, {
      trang_thai: 'completed',
      ngay_hoan_thanh: today
    });
  },
  // Auto-update overdue task statuses
  autoUpdateOverdueTasks: async (): Promise<number> => {
    const overdueTasks = await taskService.getOverdueTasks();
    
    // Update the status of each overdue task
    for (const task of overdueTasks) {
      await supabase
        .from('tasks')
        .update({ trang_thai: 'overdue' })
        .eq('id', task.id)
        .neq('trang_thai', 'overdue');
      
      // Log the status change
      await logActivity(
        'Tự động cập nhật',
        'Công việc quá hạn',
        task.ten_viec,
        'Hệ thống',
        'overdue'
      );
    }
    
    return overdueTasks.length;
  }
};
