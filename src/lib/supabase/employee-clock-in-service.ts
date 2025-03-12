
import { supabase } from './client';
import { EmployeeClockInOut, MonthlyAttendanceSummary } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class EmployeeClockInService {
  async getAll(): Promise<EmployeeClockInOut[]> {
    return fetchAll('employee_clock_in_out') as Promise<EmployeeClockInOut[]>;
  }

  async getById(id: string): Promise<EmployeeClockInOut> {
    return fetchById('employee_clock_in_out', id) as Promise<EmployeeClockInOut>;
  }

  async create(record: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    return insert('employee_clock_in_out', record) as Promise<EmployeeClockInOut>;
  }

  async update(id: string, data: Partial<EmployeeClockInOut>): Promise<EmployeeClockInOut> {
    return update('employee_clock_in_out', id, data) as Promise<EmployeeClockInOut>;
  }

  async delete(id: string): Promise<void> {
    return remove('employee_clock_in_out', id);
  }

  async getByEmployeeId(employeeId: string): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .order('ngay', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting employee clock-in records:', error);
      return [];
    }
  }

  async getTodayAttendance(): Promise<EmployeeClockInOut[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('ngay', today);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting today attendance:', error);
      return [];
    }
  }

  async getAttendanceForEmployee(employeeId: string): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .order('ngay', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting employee attendance:', error);
      return [];
    }
  }

  async getDailyReport(date: string): Promise<EmployeeClockInOut[]> {
    try {
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .select('*, employees(ten_nhan_su)')
        .eq('ngay', date);

      if (error) throw error;
      
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown'
      })) || [];
    } catch (error) {
      console.error('Error getting daily attendance report:', error);
      return [];
    }
  }

  async clockIn(employeeId: string): Promise<EmployeeClockInOut | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      // Check if there's already a record for today
      const { data: existingRecords, error: checkError } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .eq('ngay', today);
      
      if (checkError) throw checkError;
      
      // If record exists, update it
      if (existingRecords && existingRecords.length > 0) {
        const { data, error } = await supabase
          .from('employee_clock_in_out')
          .update({ 
            thoi_gian_bat_dau: now,
            gio_vao: now,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecords[0].id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
      // Create new record
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .insert({
          nhan_vien_id: employeeId,
          ngay: today,
          thoi_gian_bat_dau: now,
          gio_vao: now,
          trang_thai: 'present'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error clocking in:', error);
      return null;
    }
  }

  async clockOut(employeeId: string): Promise<EmployeeClockInOut | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      // Find today's record
      const { data: existingRecords, error: checkError } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .eq('nhan_vien_id', employeeId)
        .eq('ngay', today);
      
      if (checkError) throw checkError;
      
      if (!existingRecords || existingRecords.length === 0) {
        // If no record exists, create one with both in and out times
        const { data, error } = await supabase
          .from('employee_clock_in_out')
          .insert({
            nhan_vien_id: employeeId,
            ngay: today,
            thoi_gian_bat_dau: now, // Using current time as both start and end
            thoi_gian_ket_thuc: now,
            gio_vao: now,
            gio_ra: now,
            trang_thai: 'present'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
      // Update existing record with end time
      const { data, error } = await supabase
        .from('employee_clock_in_out')
        .update({ 
          thoi_gian_ket_thuc: now,
          gio_ra: now,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecords[0].id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error clocking out:', error);
      return null;
    }
  }

  async getMonthlyAttendance(month: number, year: number): Promise<MonthlyAttendanceSummary[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_monthly_attendance_summary', {
          month_param: month,
          year_param: year
        });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting monthly attendance:', error);
      return [];
    }
  }
}

export const employeeClockInService = new EmployeeClockInService();
