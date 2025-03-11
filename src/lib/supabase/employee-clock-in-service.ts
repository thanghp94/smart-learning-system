
import { supabase } from './client';
import { EmployeeClockInOut } from '../types';

export const employeeClockInService = {
  getAll: async (): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employee clock in out records:', error);
      throw error;
    }

    return data || [];
  },

  getById: async (id: string): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee clock in out record:', error);
      throw error;
    }

    return data;
  },

  create: async (record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error('Error creating employee clock in out record:', error);
      throw error;
    }

    return data;
  },

  update: async (id: string, record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee clock in out record:', error);
      throw error;
    }

    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('employee_clock_in_out')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee clock in out record:', error);
      throw error;
    }
  },
  
  // Add specific methods for clock in/out operations
  clockIn: async (record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    return employeeClockInService.create(record);
  },
  
  clockOut: async (record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    if (!record.id) {
      throw new Error('ID is required for clock out');
    }
    return employeeClockInService.update(record.id, record);
  },
  
  // Get attendance records by employee and date
  getByEmployeeAndDate: async (employeeId: string, date: string): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employee attendance by date:', error);
      throw error;
    }

    return data || [];
  },
  
  // Get attendance records by date
  getByDate: async (date: string): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('ngay', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendance by date:', error);
      throw error;
    }

    return data || [];
  }
};

export default employeeClockInService;
