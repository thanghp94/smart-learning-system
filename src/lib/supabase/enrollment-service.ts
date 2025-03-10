
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { Enrollment } from '@/lib/types';

const table = 'enrollments';

class EnrollmentService {
  async getAll() {
    return fetchAll<Enrollment>(table);
  }

  async getById(id: string) {
    return fetchById<Enrollment>(table, id);
  }

  async getDetailedEnrollments() {
    try {
      const { data, error } = await supabase
        .from('student_enrollments_with_details')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching detailed enrollments:', error);
      throw error;
    }
  }

  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('student_enrollments_with_details')
        .select('*')
        .eq('lop_chi_tiet_id', classId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching enrollments by class:', error);
      throw error;
    }
  }

  async getByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_enrollments_with_details')
        .select('*')
        .eq('hoc_sinh_id', studentId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching enrollments by student:', error);
      throw error;
    }
  }

  async getBySession(sessionId: string) {
    try {
      const { data: teachingSession, error: sessionError } = await supabase
        .from('teaching_sessions')
        .select('lop_chi_tiet_id')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      if (!teachingSession || !teachingSession.lop_chi_tiet_id) {
        throw new Error('Teaching session not found or has no class ID');
      }
      
      return this.getByClass(teachingSession.lop_chi_tiet_id);
    } catch (error) {
      console.error('Error fetching enrollments by session:', error);
      throw error;
    }
  }

  async create(data: Partial<Enrollment>) {
    try {
      const result = await insert<Enrollment>(table, data);
      await logActivity('create', 'enrollment', 'Ghi danh học sinh', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Enrollment>) {
    try {
      const result = await update<Enrollment>(table, id, data);
      await logActivity('update', 'enrollment', 'Cập nhật ghi danh', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await remove(table, id);
      await logActivity('delete', 'enrollment', 'Xóa ghi danh', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();
