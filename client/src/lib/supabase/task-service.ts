
import { supabase } from './client';
import { Task } from '@/lib/types';

class TaskService {
  async getAll(): Promise<Task[]> {
    try {
      console.log('Fetching all tasks...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching all tasks:', error);
        throw error;
      }
      console.log('Successfully fetched tasks:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getAll tasks:', error);
      throw error; // Re-throw error to be handled by caller
    }
  }
  
  async getById(id: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error(`Error fetching task with id ${id}:`, error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      return null;
    }
  }

  async getByAssignee(employeeId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('nguoi_phu_trach', employeeId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error(`Error fetching tasks for employee ${employeeId}:`, error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error(`Error fetching tasks for employee ${employeeId}:`, error);
      return [];
    }
  }
  
  // Method to ensure backward compatibility
  async getByEmployeeId(employeeId: string): Promise<Task[]> {
    return this.getByAssignee(employeeId);
  }

  async create(task: Partial<Task>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error(`Error updating task ${id}:`, error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting task ${id}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  async complete(id: string): Promise<Task | null> {
    return this.update(id, { 
      trang_thai: 'completed',
      ngay_hoan_thanh: new Date().toISOString()
    });
  }
}

export const taskService = new TaskService();
