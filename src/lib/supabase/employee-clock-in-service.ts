
import { supabase } from './client';
import { EmployeeClockInOut } from '@/lib/types';

export const employeeClockInService = {
  getAll: async (): Promise<EmployeeClockInOut[]> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('employee_clock_in_out')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get attendance for a specific employee
  getAttendanceForEmployee: async (employeeId: string, month?: number, year?: number): Promise<EmployeeClockInOut[]> => {
    let query = supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .order('ngay', { ascending: false });
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      query = query
        .gte('ngay', startDate)
        .lte('ngay', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  // Get daily attendance report
  getDailyReport: async (date: string): Promise<any[]> => {
    const { data, error } = await supabase
      .rpc('get_daily_attendance_report', { check_date: date });

    if (error) throw error;
    return data || [];
  },
  
  // Get attendance by employee and date
  getByEmployeeAndDate: async (employeeId: string, date: string): Promise<EmployeeClockInOut | null> => {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', date)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },
  
  // Get monthly attendance for reports
  getMonthlyAttendance: async (month: number, year: number): Promise<any[]> => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .gte('ngay', startDate)
      .lte('ngay', endDate)
      .order('ngay', { ascending: true });
      
    if (error) throw error;
    return data || [];
  }
};
