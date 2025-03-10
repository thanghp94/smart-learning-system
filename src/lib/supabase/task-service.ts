
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Task } from '@/lib/types';

class TaskService {
  async getAll() {
    return fetchAll<Task>('tasks');
  }
  
  async getById(id: string) {
    return fetchById<Task>('tasks', id);
  }
  
  async create(task: Partial<Task>) {
    return insert<Task>('tasks', task);
  }
  
  async update(id: string, updates: Partial<Task>) {
    return update<Task>('tasks', id, updates);
  }
  
  async delete(id: string) {
    return remove('tasks', id);
  }
  
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) throw error;
    return data as Task[];
  }
  
  async getByAssignee(assignee: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_thuc_hien', assignee);
    
    if (error) throw error;
    return data as Task[];
  }

  // Add a method to get tasks by entity
  async getByEntity(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    if (error) throw error;
    return data as Task[];
  }
  
  // Add a method to get tasks by employee ID
  async getByEmployeeId(employeeId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('nguoi_thuc_hien', employeeId);
    
    if (error) throw error;
    return data as Task[];
  }

  async autoUpdateOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: overdueTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .lt('ngay_den_han', today)
      .neq('trang_thai', 'completed');
    
    if (error) throw error;
    
    const updatePromises = overdueTasks.map(task => 
      this.update(task.id, { 
        trang_thai: 'overdue'
        // Remove the invalid updated_at property
      })
    );
    
    await Promise.all(updatePromises);
    return overdueTasks.length;
  }
}

export const taskService = new TaskService();
