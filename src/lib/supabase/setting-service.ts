
import { Setting } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const settingService = {
  getAll: () => fetchAll<Setting>('settings'),
  getById: (id: string) => fetchById<Setting>('settings', id),
  create: (setting: Partial<Setting>) => insert<Setting>('settings', setting),
  update: (id: string, updates: Partial<Setting>) => update<Setting>('settings', id, updates),
  delete: (id: string) => remove('settings', id),
  
  // Get settings by department
  getByDepartment: async (department: string): Promise<Setting[]> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('bo_phan', department);
    
    if (error) {
      console.error(`Error fetching settings for department ${department}:`, error);
      throw error;
    }
    
    return data as Setting[];
  },
  
  // Get settings by process
  getByProcess: async (process: string): Promise<Setting[]> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('quy_trinh', process);
    
    if (error) {
      console.error(`Error fetching settings for process ${process}:`, error);
      throw error;
    }
    
    return data as Setting[];
  }
};
