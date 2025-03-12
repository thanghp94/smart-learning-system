
import { supabase } from './client';
import { EmployeeClockInOut, MonthlyAttendanceSummary } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class EmployeeClockInService {
  tableName = 'employee_clock_in_out';

  async getByEmployeeId(employeeId: string): Promise<EmployeeClockInOut[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .order('ngay', { ascending: false });

    if (error) {
      console.error('Error fetching employee clock-in records:', error);
      throw error;
    }

    return data || [];
  }

  async getByDate(date: string): Promise<EmployeeClockInOut[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, employees(ten_nhan_su, chuc_vu, phong_ban)')
      .eq('ngay', date)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching clock-in records by date:', error);
      throw error;
    }

    return data?.map(record => ({
      ...record,
      employee_name: record.employees?.ten_nhan_su,
      position: record.employees?.chuc_vu,
      department: record.employees?.phong_ban
    })) || [];
  }

  async getMonthlyAttendance(month: number, year: number): Promise<MonthlyAttendanceSummary[]> {
    const { data, error } = await supabase
      .rpc('get_monthly_attendance_summary', { month_param: month, year_param: year });

    if (error) {
      console.error('Error fetching monthly attendance summary:', error);
      throw error;
    }

    return data || [];
  }

  async getTodayAttendance(employeeId: string): Promise<EmployeeClockInOut> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .eq('ngay', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching today attendance:', error);
      throw error;
    }

    return data || null;
  }

  async clockIn(employeeId: string, employeeName: string): Promise<EmployeeClockInOut> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    const clockInRecord = {
      nhan_vien_id: employeeId,
      ngay: today,
      thoi_gian_bat_dau: now.toLocaleTimeString('vi-VN'),
      gio_vao: now.toLocaleTimeString('vi-VN'),
      trang_thai: 'present',
      employee_name: employeeName
    };
    
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(clockInRecord)
      .select()
      .single();

    if (error) {
      console.error('Error clocking in:', error);
      throw error;
    }

    return data;
  }

  async clockOut(recordId: string): Promise<EmployeeClockInOut> {
    const now = new Date();
    
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        thoi_gian_ket_thuc: now.toLocaleTimeString('vi-VN'),
        gio_ra: now.toLocaleTimeString('vi-VN')
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      console.error('Error clocking out:', error);
      throw error;
    }

    return data;
  }

  // Additional methods needed by components
  async create(data: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    return insert<EmployeeClockInOut>(this.tableName, data);
  }

  async getAll(): Promise<EmployeeClockInOut[]> {
    return fetchAll<EmployeeClockInOut>(this.tableName);
  }

  async getById(id: string): Promise<EmployeeClockInOut> {
    return fetchById<EmployeeClockInOut>(this.tableName, id);
  }

  async update(id: string, data: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    return update<EmployeeClockInOut>(this.tableName, id, data);
  }

  async delete(id: string): Promise<void> {
    return remove(this.tableName, id);
  }

  async getDailyReport(date: string): Promise<EmployeeClockInOut[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, employees(ten_nhan_su, chuc_vu, phong_ban, hinh_anh)')
      .eq('ngay', date);

    if (error) {
      console.error('Error fetching daily report:', error);
      throw error;
    }

    return data?.map(record => ({
      ...record,
      employee_name: record.employees?.ten_nhan_su,
      position: record.employees?.chuc_vu,
      department: record.employees?.phong_ban,
      employee_image: record.employees?.hinh_anh
    })) || [];
  }

  async getAttendanceForEmployee(employeeId: string, month: number, year: number): Promise<EmployeeClockInOut[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('nhan_vien_id', employeeId)
      .gte('ngay', startDate)
      .lte('ngay', endDate)
      .order('ngay', { ascending: true });

    if (error) {
      console.error('Error fetching employee attendance:', error);
      throw error;
    }

    return data || [];
  }
}

export const employeeClockInService = new EmployeeClockInService();
