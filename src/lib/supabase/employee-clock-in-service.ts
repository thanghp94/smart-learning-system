
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { EmployeeClockInOut, MonthlyAttendanceSummary } from '@/lib/types/employee-clock-in-out';

class EmployeeClockInService {
  async getAll() {
    return fetchAll<EmployeeClockInOut>('employee_clock_in_out');
  }

  async getById(id: string) {
    return fetchById<EmployeeClockInOut>('employee_clock_in_out', id);
  }

  async create(data: Partial<EmployeeClockInOut>) {
    return insert<EmployeeClockInOut>('employee_clock_in_out', data);
  }

  async update(id: string, data: Partial<EmployeeClockInOut>) {
    return update<EmployeeClockInOut>('employee_clock_in_out', id, data);
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
      return data as EmployeeClockInOut[];
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
      return data as EmployeeClockInOut[];
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
  
  async getEmployeeAttendanceSummary(employeeId: string, month: number, year: number) {
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
        .eq('nhan_vien_id', employeeId)
        .gte('ngay', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lt('ngay', month === 12 
          ? `${year + 1}-01-01` 
          : `${year}-${(month + 1).toString().padStart(2, '0')}-01`
        );
      
      if (error) throw error;
      
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching employee attendance summary:', error);
      throw error;
    }
  }
  
  async getDailyReport(date: string) {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select(`
          *,
          employees:nhan_vien_id (
            id,
            ten_nhan_su,
            bo_phan,
            chuc_danh
          )
        `)
        .eq('ngay', date)
        .order('thoi_gian_bat_dau', { ascending: true });
      
      if (error) throw error;
      
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
        department: record.employees?.bo_phan || '',
        position: record.employees?.chuc_danh || '',
      }));
    } catch (error) {
      console.error('Error fetching daily attendance report:', error);
      throw error;
    }
  }
}

export const employeeClockInService = new EmployeeClockInService();
