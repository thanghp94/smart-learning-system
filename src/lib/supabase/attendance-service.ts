
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
}

export const attendanceService = new AttendanceService();
