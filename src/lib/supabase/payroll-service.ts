
import { Payroll } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const payrollService = {
  getAll: () => fetchAll<Payroll>('payrolls'),
  getById: (id: string) => fetchById<Payroll>('payrolls', id),
  create: (payroll: Partial<Payroll>) => insert<Payroll>('payrolls', payroll),
  update: (id: string, updates: Partial<Payroll>) => update<Payroll>('payrolls', id, updates),
  delete: (id: string) => remove('payrolls', id),
  
  // Get payrolls by employee
  getByEmployee: async (employeeId: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('nhan_su_id', employeeId)
      .order('nam', { ascending: false })
      .order('thang', { ascending: false });
    
    if (error) {
      console.error(`Error fetching payrolls for employee ${employeeId}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  },
  
  // Get payrolls by month and year
  getByPeriod: async (month: string, year: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('thang', month)
      .eq('nam', year);
    
    if (error) {
      console.error(`Error fetching payrolls for period ${month}/${year}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  },
  
  // Get payrolls by facility
  getByFacility: async (facilityId: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('co_so_id', facilityId);
    
    if (error) {
      console.error(`Error fetching payrolls for facility ${facilityId}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  },
  
  // Get payrolls by status
  getByStatus: async (status: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('trang_thai', status);
    
    if (error) {
      console.error(`Error fetching payrolls by status ${status}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  }
};
