
import { Enrollment } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';

export const enrollmentService = {
  async getAll() {
    return fetchAll<Enrollment>('enrollments');
  },
  
  async getById(id: string) {
    return fetchById<Enrollment>('enrollments', id);
  },
  
  async create(enrollment: Partial<Enrollment>) {
    try {
      const result = await insert<Enrollment>('enrollments', enrollment);
      await logActivity('create', 'enrollment', 'New enrollment', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },
  
  async update(id: string, data: Partial<Enrollment>) {
    try {
      const result = await update<Enrollment>('enrollments', id, data);
      await logActivity('update', 'enrollment', 'Update enrollment', 'system', 'completed');
      return result;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  },
  
  async delete(id: string) {
    try {
      await remove('enrollments', id);
      await logActivity('delete', 'enrollment', 'Delete enrollment', 'system', 'completed');
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  },

  async getByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      throw error;
    }
  },
  
  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId}:`, error);
      throw error;
    }
  },

  async getBySession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for session ${sessionId}:`, error);
      throw error;
    }
  },

  async getByClassAndSession(classId: string, sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('class_id', classId)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId} and session ${sessionId}:`, error);
      throw error;
    }
  }
};
