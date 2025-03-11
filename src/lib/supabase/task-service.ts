
import { Task } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data as Task[];
  },
  
  getById: (id: string): Promise<Task> => fetchById<Task>('tasks', id),
  
  create: (task: Partial<Task>): Promise<Task> => insert<Task>('tasks', task),
  
  update: (id: string, updates: Partial<Task>): Promise<Task> => update<Task>('tasks', id, updates),
  
  delete: (id: string): Promise<void> => remove('tasks', id),
  
  getByUser: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_phu_trach', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks by user:', error);
      throw error;
    }
    
    return data as Task[];
  },
  
  getByStatus: async (status: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('trang_thai', status)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }
    
    return data as Task[];
  },
  
  getByPriority: async (priority: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('cap_do', priority)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks by priority:', error);
      throw error;
    }
    
    return data as Task[];
  },
  
  complete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ trang_thai: 'completed' })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },
  
  getByEntityType: async (entityType: string, entityId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('doi_tuong', entityType)
      .eq('doi_tuong_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks by entity:', error);
      throw error;
    }
    
    return data as Task[];
  }
};
