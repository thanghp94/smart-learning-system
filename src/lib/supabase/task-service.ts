
import { supabase } from './client';
import { Task } from '@/lib/types';

class TaskService {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  
  async getById(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async getByAssignee(employeeId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_nhan', employeeId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  
  // Add this method to fix the import error
  async getByEmployeeId(employeeId: string): Promise<Task[]> {
    return this.getByAssignee(employeeId);
  }

  async create(task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }

  async complete(id: string): Promise<Task> {
    return this.update(id, { 
      trang_thai: 'completed',
      ngay_hoan_thanh: new Date().toISOString()
    });
  }
}

export const taskService = new TaskService();
