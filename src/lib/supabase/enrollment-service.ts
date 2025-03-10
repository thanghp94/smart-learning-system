
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Enrollment } from '@/lib/types';

class EnrollmentService {
  async getAll() {
    return fetchAll<Enrollment>('enrollments');
  }
  
  async getById(id: string) {
    return fetchById<Enrollment>('enrollments', id);
  }
  
  async create(data: Partial<Enrollment>) {
    return insert<Enrollment>('enrollments', data);
  }
  
  async update(id: string, data: Partial<Enrollment>) {
    return update<Enrollment>('enrollments', id, data);
  }
  
  async delete(id: string) {
    return remove('enrollments', id);
  }

  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('lop_chi_tiet_id', classId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId}:`, error);
      throw error;
    }
  }
  
  async getByClassAndSession(classId: string, sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('lop_chi_tiet_id', classId)
        .eq('buoi_hoc_id', sessionId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId} and session ${sessionId}:`, error);
      throw error;
    }
  }

  async getBySession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('buoi_day_id', sessionId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for session ${sessionId}:`, error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();
