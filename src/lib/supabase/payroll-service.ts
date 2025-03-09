
import { Payroll } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const payrollService = {
  getAll: () => fetchAll<Payroll>('payrolls'),
  getById: (id: string) => fetchById<Payroll>('payrolls', id),
  create: (payroll: Partial<Payroll>) => {
    // Remove any fields that don't exist in the database schema
    const payrollData = { ...payroll };
    if ('phu_cap' in payrollData) {
      delete (payrollData as any).phu_cap;
    }
    return insert<Payroll>('payrolls', payrollData);
  },
  update: (id: string, updates: Partial<Payroll>) => {
    // Remove any fields that don't exist in the database schema
    const updatesData = { ...updates };
    if ('phu_cap' in updatesData) {
      delete (updatesData as any).phu_cap;
    }
    return update<Payroll>('payrolls', id, updatesData);
  },
  delete: (id: string) => remove('payrolls', id),
  
  // Get payrolls by employee
  getByEmployee: async (employeeId: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('nhan_su_id', employeeId);
    
    if (error) {
      console.error(`Error fetching payrolls for employee ${employeeId}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  },
  
  // Get payrolls by month and year
  getByMonthYear: async (month: string, year: string): Promise<Payroll[]> => {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('thang', month)
      .eq('nam', year);
    
    if (error) {
      console.error(`Error fetching payrolls for ${month}/${year}:`, error);
      throw error;
    }
    
    return data as Payroll[];
  }
};
