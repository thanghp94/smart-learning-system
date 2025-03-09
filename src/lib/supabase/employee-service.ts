
import { Employee } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const data = await fetchAll<Employee>('employees');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAll employees:', error);
      return [];
    }
  },
  getById: async (id: string): Promise<Employee | null> => {
    try {
      return await fetchById<Employee>('employees', id);
    } catch (error) {
      console.error('Error in getById employee:', error);
      return null;
    }
  },
  create: (employee: Partial<Employee>) => insert<Employee>('employees', employee),
  update: (id: string, updates: Partial<Employee>) => update<Employee>('employees', id, updates),
  delete: (id: string) => remove('employees', id),
  getByFacility: async (facilityId: string): Promise<Employee[]> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .contains('co_so_id', [facilityId]);
      
      if (error) {
        console.error('Error fetching employees by facility:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getByFacility employees:', error);
      return [];
    }
  },
  getByRole: async (role: string): Promise<Employee[]> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('chuc_danh', role);
      
      if (error) {
        console.error('Error fetching employees by role:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getByRole employees:', error);
      return [];
    }
  }
};
