
import { Employee } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const employeeService = {
  getAll: () => fetchAll<Employee>('employees'),
  getById: (id: string) => fetchById<Employee>('employees', id),
  create: (employee: Partial<Employee>) => insert<Employee>('employees', employee),
  update: (id: string, updates: Partial<Employee>) => update<Employee>('employees', id, updates),
  delete: (id: string) => remove('employees', id),
  getByFacility: async (facilityId: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .contains('co_so_id', [facilityId]);
    
    if (error) {
      console.error('Error fetching employees by facility:', error);
      throw error;
    }
    
    return data as Employee[];
  },
  getByRole: async (role: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('chuc_danh', role);
    
    if (error) {
      console.error('Error fetching employees by role:', error);
      throw error;
    }
    
    return data as Employee[];
  }
};
