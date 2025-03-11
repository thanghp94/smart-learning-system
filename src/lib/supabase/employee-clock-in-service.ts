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

  async getMonthlyAttendance(month: number, year: number) {
    try {
      const { data, error } = await supabase
        .rpc('get_monthly_attendance_summary', {
          p_month: month,
          p_year: year
        });
      
      if (error) throw error;
      return data as EmployeeClockInOut[];
    } catch (error) {
      console.error('Error fetching monthly attendance summary:', error);
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
            ten_nhan_su,
            hinh_anh,
            chuc_danh,
            bo_phan
          )
        `)
        .gte('ngay', startDate)
        .lte('ngay', endDate)
        .order('ngay', { ascending: true });
      
      if (error) throw error;
      
      // Map to add employee_name and image to each record
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
        employee_image: record.employees?.hinh_anh || null,
        department: record.employees?.bo_phan || 'Unknown',
        position: record.employees?.chuc_danh || 'Unknown'
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
            ten_nhan_su,
            hinh_anh,
            chuc_danh,
            bo_phan
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
        employee_image: record.employees?.hinh_anh || null,
        department: record.employees?.bo_phan || '',
        position: record.employees?.chuc_danh || '',
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
            hinh_anh,
            bo_phan,
            chuc_danh
          ),
          teaching_sessions:buoi_day_id (
            id,
            ngay_hoc,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc,
            lop_chi_tiet_id,
            classes:lop_chi_tiet_id (
              id,
              ten_lop_full
            )
          )
        `)
        .eq('ngay', date)
        .order('thoi_gian_bat_dau', { ascending: true });
      
      if (error) throw error;
      
      return data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.ten_nhan_su || 'Unknown',
        employee_image: record.employees?.hinh_anh || null,
        department: record.employees?.bo_phan || '',
        position: record.employees?.chuc_danh || '',
        class_name: record.teaching_sessions?.classes?.ten_lop_full || 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching daily attendance report:', error);
      throw error;
    }
  }

  async getMonthlyCalendarView(month: number, year: number) {
    try {
      // First get all employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, ten_nhan_su, hinh_anh, bo_phan, chuc_danh')
        .eq('tinh_trang_lao_dong', 'active');
      
      if (employeesError) throw employeesError;
      
      // Then get all attendance records for the month
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = month === 12 
        ? `${year + 1}-01-01`
        : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
      
      const { data: records, error: recordsError } = await supabase
        .from('employee_clock_in_out')
        .select('*')
        .gte('ngay', startDate)
        .lt('ngay', endDate);
      
      if (recordsError) throw recordsError;
      
      // Get number of days in month
      const daysInMonth = new Date(year, month, 0).getDate();
      
      // Create calendar view
      const calendarView = employees.map((employee: any) => {
        const employeeRecords = records.filter((record: any) => record.nhan_vien_id === employee.id);
        
        // Create attendance by day
        const attendanceByDay: Record<string, any> = {};
        for (let day = 1; day <= daysInMonth; day++) {
          const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dayRecord = employeeRecords.find((record: any) => record.ngay === dateString);
          
          attendanceByDay[day] = dayRecord ? {
            present: true,
            status: dayRecord.trang_thai || 'present',
            startTime: dayRecord.thoi_gian_bat_dau,
            endTime: dayRecord.thoi_gian_ket_thuc,
            note: dayRecord.ghi_chu
          } : {
            present: false,
            status: 'absent'
          };
        }
        
        return {
          employee: {
            id: employee.id,
            name: employee.ten_nhan_su,
            image: employee.hinh_anh,
            department: employee.bo_phan,
            position: employee.chuc_danh
          },
          attendanceByDay,
          statistics: {
            present: employeeRecords.filter((r: any) => r.trang_thai === 'present').length,
            absent: daysInMonth - employeeRecords.length,
            late: employeeRecords.filter((r: any) => r.trang_thai === 'late').length,
            total: daysInMonth
          }
        };
      });
      
      return calendarView;
    } catch (error) {
      console.error('Error generating monthly calendar view:', error);
      throw error;
    }
  }
}

export const employeeClockInService = new EmployeeClockInService();
