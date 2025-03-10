
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export interface EmployeeClockIn {
  id: string;
  nhan_vien_id: string;
  ngay: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  buoi_day_id?: string;
  xac_nhan?: boolean;
  ghi_chu?: string;
  trang_thai?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyAttendanceSummary {
  employee_id: string;
  employee_name: string;
  attendance_date: string;
  day_of_month: number;
  status: string;
  present_count: number;
  absent_count: number;
  late_count: number;
}

class EmployeeClockInService {
  async getAll() {
    return fetchAll<EmployeeClockIn>('employee_clock_in_out');
  }

  async getById(id: string) {
    return fetchById<EmployeeClockIn>('employee_clock_in_out', id);
  }

  async create(data: Partial<EmployeeClockIn>) {
    return insert<EmployeeClockIn>('employee_clock_in_out', data);
  }

  async update(id: string, data: Partial<EmployeeClockIn>) {
    return update<EmployeeClockIn>('employee_clock_in_out', id, data);
  }

  async delete(id: string) {
    return remove('employee_clock_in_out', id);
  }

  async getByEmployee(employeeId: string) {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .order('ngay', { ascending: false });
      
      if (error) throw error;
      return data as EmployeeClockIn[];
    } catch (error) {
      console.error('Error fetching employee clock in records:', error);
      throw error;
    }
  }

  async getByTeachingSession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('buoi_day_id', sessionId);
      
      if (error) throw error;
      return data as EmployeeClockIn[];
    } catch (error) {
      console.error('Error fetching employee clock in by teaching session:', error);
      throw error;
    }
  }
  
  async getMonthlySummary(month: number, year: number) {
    try {
      const { data, error } = await supabase
        .rpc('get_monthly_attendance_summary', {
          p_month: month,
          p_year: year
        });
      
      if (error) throw error;
      return data as MonthlyAttendanceSummary[];
    } catch (error) {
      console.error('Error fetching monthly attendance summary:', error);
      throw error;
    }
  }
  
  async getByDateRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select(`
          *,
          employees:nhan_vien_id (
            id,
            ten_nhan_su
          )
        `)
        .gte('ngay', startDate)
        .lte('ngay', endDate)
        .order('ngay', { ascending: true });
      
      if (error) throw error;
      
      // Map to add employee_name to each record
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching employee clock in records by date range:', error);
      throw error;
    }
  }
}

export const employeeClockInService = new EmployeeClockInService();
