
import { EmployeeClockInOut } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const employeeClockInService = {
  getAll: () => fetchAll<EmployeeClockInOut>('employee_clock_in_out'),
  
  getById: (id: string) => fetchById<EmployeeClockInOut>('employee_clock_in_out', id),
  
  create: (clockIn: Partial<EmployeeClockInOut>) => insert<EmployeeClockInOut>('employee_clock_in_out', clockIn),
  
  update: (id: string, updates: Partial<EmployeeClockInOut>) => 
    update<EmployeeClockInOut>('employee_clock_in_out', id, updates),
  
  delete: (id: string) => remove('employee_clock_in_out', id),
  
  // Get clock-in records for a specific employee
  getByEmployee: async (employeeId: string): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .order('ngay', { ascending: false });
    
    if (error) {
      console.error('Error fetching clock-in records:', error);
      throw error;
    }
    
    return data as EmployeeClockInOut[];
  },
  
  // Get clock-in records for a specific date
  getByDate: async (date: string): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('ngay', date);
    
    if (error) {
      console.error('Error fetching clock-in records by date:', error);
      throw error;
    }
    
    return data as EmployeeClockInOut[];
  },
  
  // Get clock-in records for a specific teaching session
  getByTeachingSession: async (sessionId: string): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('buoi_day_id', sessionId);
    
    if (error) {
      console.error('Error fetching clock-in records by teaching session:', error);
      throw error;
    }
    
    return data as EmployeeClockInOut[];
  },
  
  // Confirm clock-in
  confirmClockIn: async (id: string): Promise<EmployeeClockInOut> => {
    return update<EmployeeClockInOut>('employee_clock_in_out', id, { 
      xac_nhan: true,
      trang_thai: 'completed'
    });
  }
};
