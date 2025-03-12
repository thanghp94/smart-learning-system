import { supabase } from './client';
import { Attendance, AttendanceWithDetails } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

class AttendanceService {
  async getAll() {
    return fetchAll<Attendance>('attendances');
  }

  async getById(id: string) {
    return fetchById<Attendance>('attendances', id);
  }

  async create(data: Partial<Attendance>) {
    return insert<Attendance>('attendances', data);
  }

  async update(id: string, data: Partial<Attendance>) {
    return update<Attendance>('attendances', id, data);
  }

  async delete(id: string) {
    return remove('attendances', id);
  }

  async getByEnrollment(enrollmentId: string) {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select('*')
        .eq('enrollment_id', enrollmentId);
      
      if (error) throw error;
      return data as Attendance[];
    } catch (error) {
      console.error('Error fetching attendances by enrollment:', error);
      throw error;
    }
  }

  async getByTeachingSession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select('*')
        .eq('teaching_session_id', sessionId);
      
      if (error) throw error;
      return data as Attendance[];
    } catch (error) {
      console.error('Error fetching attendances by teaching session:', error);
      throw error;
    }
  }

  async getWithDetails(studentId?: string, classId?: string) {
    try {
      let query = supabase
        .from('attendances_with_details')
        .select('*');
      
      if (studentId) {
        query = query.eq('hoc_sinh_id', studentId);
      }
      
      if (classId) {
        query = query.eq('lop_id', classId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as AttendanceWithDetails[];
    } catch (error) {
      console.error('Error fetching attendances with details:', error);
      throw error;
    }
  }

  async saveAttendance(attendanceRecords: any[]) {
    try {
      if (attendanceRecords.length > 0) {
        const sessionId = attendanceRecords[0].teaching_session_id || attendanceRecords[0].session_id;
        
        if (sessionId) {
          await supabase
            .from('attendances')
            .delete()
            .eq('teaching_session_id', sessionId);
        }
      }
      
      const { data, error } = await supabase
        .from('attendances')
        .insert(attendanceRecords)
        .select();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving attendance records:', error);
      throw error;
    }
  }

  async createEmployeeAttendance(data: any) {
    try {
      const { data: result, error } = await supabase
        .from('employee_clock_in_out')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error('Error creating employee attendance:', error);
      return { data: null, error };
    }
  }

  async updateEmployeeAttendance(id: string, data: any) {
    try {
      const { data: result, error } = await supabase
        .from('employee_clock_in_out')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error('Error updating employee attendance:', error);
      return { data: null, error };
    }
  }

  async getDailyAttendance(date: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('attendances_with_details')
        .select('*')
        .eq('ngay_hoc', date);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
