
import { supabase } from './client';

export const employeeClockInService = {
  async getByEmployeeId(employeeId: string) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('employee_id', employeeId)
      .order('clock_in_time', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getAllForDate(date: string) {
    // Get records for a specific date
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .gte('clock_in_time', `${date}T00:00:00`)
      .lt('clock_in_time', `${date}T23:59:59`)
      .order('clock_in_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async create(clockInData: any) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .insert(clockInData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateClockOut(id: string, clockOutTime: string) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .update({ 
        clock_out_time: clockOutTime 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Add missing methods
  async getByEmployeeAndDate(employeeId: string, date: string) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', date)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getMonthlyReport(year: number, month: number) {
    // Get monthly attendance summary
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
    
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*, employees(id, ten_nhan_su)')
      .gte('clock_in_time', `${startDate}T00:00:00`)
      .lt('clock_in_time', `${endDate}T23:59:59`)
      .order('clock_in_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Add missing methods for DailyAttendance.tsx
  async getDailyReport(date: string) {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*, employees(id, ten_nhan_su, hinh_anh, phong_ban, vi_tri)')
      .eq('ngay', date)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Format the data to include employee details
    return data.map((record) => ({
      ...record,
      employee_name: record.employees?.ten_nhan_su || 'Unknown',
      employee_image: record.employees?.hinh_anh || null,
      department: record.employees?.phong_ban || 'Unassigned',
      position: record.employees?.vi_tri || 'No position'
    }));
  },
  
  // Add missing methods for MonthlyAttendanceSummary.tsx
  async getAll() {
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*, employees(id, ten_nhan_su)')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Add missing methods for EmployeeAttendance.tsx
  async getMonthlyAttendance(month: number, year: number) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    
    const { data, error } = await supabase
      .from('employee_clock_in_out')
      .select('*, employees(id, ten_nhan_su)')
      .gte('ngay', startDate)
      .lte('ngay', endDate)
      .order('ngay', { ascending: true });
      
    if (error) throw error;
    
    // Format the data to include employee name
    return data.map((record) => ({
      ...record,
      employee_name: record.employees?.ten_nhan_su || 'Unknown Employee'
    }));
  }
};
