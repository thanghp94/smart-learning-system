import { supabase } from './client';
import { Task } from '../types';

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        employees:nguoi_phu_trach (
          ten_nhan_su
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    // Transform data to include employee name
    return (data || []).map(task => ({
      ...task,
      ten_nguoi_phu_trach: task.employees?.ten_nhan_su || null
    }));
  },

  getById: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        employees:nguoi_phu_trach (
          ten_nhan_su
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }

    return {
      ...data,
      ten_nguoi_phu_trach: data.employees?.ten_nhan_su || null
    };
  },

  getByAssignee: async (employeeId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        employees:nguoi_phu_trach (
          ten_nhan_su
        )
      `)
      .eq('nguoi_phu_trach', employeeId)
      .order('ngay_den_han', { ascending: true });

    if (error) {
      console.error('Error fetching tasks by assignee:', error);
      throw error;
    }

    // Transform data to include employee name
    return (data || []).map(task => ({
      ...task,
      ten_nguoi_phu_trach: task.employees?.ten_nhan_su || null
    }));
  },

  getByEmployeeId: async (employeeId: string): Promise<Task[]> => {
    return this.getByAssignee(employeeId);
  },

  create: async (task: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        tg_tao: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  complete: async (id: string): Promise<Task> => {
    return taskService.update(id, {
      trang_thai: 'completed',
      ngay_hoan_thanh: new Date().toISOString().split('T')[0]
    });
  }
};

export default taskService;
