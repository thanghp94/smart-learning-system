
import { Task } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

class TaskService {
  getAll = () => fetchAll<Task>('tasks');
  getById = (id: string) => fetchById<Task>('tasks', id);
  create = (task: Partial<Task>) => insert<Task>('tasks', task);
  update = (id: string, updates: Partial<Task>) => update<Task>('tasks', id, updates);
  delete = (id: string) => remove('tasks', id);
  
  // Method for setting a task as complete
  complete = async (id: string) => {
    return this.update(id, {
      trang_thai: 'completed',
      ngay_hoan_thanh: new Date().toISOString().split('T')[0]
    });
  };

  // Get tasks by assignee
  getByAssignee = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('nguoi_phu_trach', employeeId)
        .order('ngay_den_han', { ascending: true });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching tasks by assignee:', error);
      throw error;
    }
  };

  // Get tasks by entity type and ID (e.g., for a specific student, class, etc.)
  getByEntityType = async (entityType: string, entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('doi_tuong', entityType)
        .eq('doi_tuong_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching tasks by entity:', error);
      throw error;
    }
  };

  // Get overdue tasks
  getOverdueTasks = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .lt('ngay_den_han', today)
        .not('trang_thai', 'eq', 'completed')
        .order('ngay_den_han', { ascending: true });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
  };

  // Get tasks due today
  getTasksDueToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('ngay_den_han', today)
        .not('trang_thai', 'eq', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching tasks due today:', error);
      throw error;
    }
  };
  
  // Get tasks by employee
  getByEmployeeId = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('nguoi_phu_trach', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching tasks by employee:', error);
      throw error;
    }
  };
}

export const taskService = new TaskService();
