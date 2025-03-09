
import { Employee } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const employeeService = {
  getAll: () => fetchAll<Employee>('employees'),
  getById: (id: string) => fetchById<Employee>('employees', id),
  create: (employee: Partial<Employee>) => insert<Employee>('employees', employee),
  update: (id: string, updates: Partial<Employee>) => update<Employee>('employees', id, updates),
  delete: (id: string) => remove('employees', id),
  
  // Get employees by facility
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
  
  // Get employees by department
  getByDepartment: async (department: string): Promise<Employee[]> => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('bo_phan', department);
    
    if (error) {
      console.error('Error fetching employees by department:', error);
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
  },
  
  // Get employees by role
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
