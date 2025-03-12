
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
  
  // Get today's attendance for the dashboard
  getTodayAttendance: async (): Promise<EmployeeClockInOut[]> => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('ngay', today);
    
    if (error) throw error;
    return data || [];
  },
  
  // Clock in for an employee
  clockIn: async (employeeId: string): Promise<EmployeeClockInOut> => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Check if employee already clocked in today
    const { data: existing } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', today)
      .maybeSingle();
    
    if (existing) {
      // Update existing record
      return employeeClockInService.update(existing.id, {
        thoi_gian_vao: now,
        thoi_gian_bat_dau: now
      });
    } else {
      // Create new record
      return employeeClockInService.create({
        nhan_vien_id: employeeId,
        ngay: today,
        thoi_gian_vao: now,
        thoi_gian_bat_dau: now,
        trang_thai: 'present'
      });
    }
  },
  
  // Clock out for an employee
  clockOut: async (employeeId: string): Promise<EmployeeClockInOut> => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Find employee's clock-in record for today
    const { data: existing, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', today)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!existing) {
      throw new Error('No clock-in record found for today');
    }
    
    // Update with clock-out time
    return employeeClockInService.update(existing.id, {
      thoi_gian_ra: now,
      thoi_gian_ket_thuc: now
    });
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
