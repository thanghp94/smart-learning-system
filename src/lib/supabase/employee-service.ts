
import { Employee } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const employeeService = {
  getAll: () => fetchAll<Employee>('employees'),
  getById: (id: string) => fetchById<Employee>('employees', id),
  create: (employee: Partial<Employee>) => insert<Employee>('employees', employee),
  update: (id: string, updates: Partial<Employee>) => update<Employee>('employees', employee),
  delete: (id: string) => remove('employees', id),
  
  // Get employees by role/position
  getByRole: async (role: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('bo_phan', role)
      .eq('tinh_trang_lao_dong', 'active');
    
    if (error) {
      console.error('Error fetching employees by role:', error);
      throw error;
    }
    
    return data as Employee[];
  },
  
  // Get active employees
  getActive: async (): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('tinh_trang_lao_dong', 'active');
    
    if (error) {
      console.error('Error fetching active employees:', error);
      throw error;
    }
    
    return data as Employee[];
  }
};
