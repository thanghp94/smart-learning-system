import { Enrollment } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';

export const enrollmentService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students:hoc_sinh_id (id, ten_hoc_sinh),
          classes:lop_chi_tiet_id (id, ten_lop_full, ten_lop, ct_hoc)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(enrollment => ({
        ...enrollment,
        ten_hoc_sinh: enrollment.students?.ten_hoc_sinh || null,
        ten_lop_full: enrollment.classes?.ten_lop_full || null,
        ten_lop: enrollment.classes?.ten_lop || null,
        ct_hoc: enrollment.classes?.ct_hoc || null
      }));
    } catch (error) {
      console.error('Error fetching all enrollments:', error);
      throw error;
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students:hoc_sinh_id (id, ten_hoc_sinh),
          classes:lop_chi_tiet_id (id, ten_lop_full, ten_lop, ct_hoc)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return {
        ...data,
        ten_hoc_sinh: data.students?.ten_hoc_sinh || null,
        ten_lop_full: data.classes?.ten_lop_full || null,
        ten_lop: data.classes?.ten_lop || null,
        ct_hoc: data.classes?.ct_hoc || null
      };
    } catch (error) {
      console.error(`Error fetching enrollment with ID ${id}:`, error);
      throw error;
    }
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
      console.log('Fetching enrollments for student', studentId);
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          classes:lop_chi_tiet_id (id, ten_lop_full, ten_lop, ct_hoc)
        `)
        .eq('hoc_sinh_id', studentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching enrollments for student ${studentId}:`, error);
        throw error;
      }
      
      const processedData = data.map(enrollment => ({
        ...enrollment,
        ten_lop_full: enrollment.classes?.ten_lop_full || null,
        ten_lop: enrollment.classes?.ten_lop || null,
        ct_hoc: enrollment.classes?.ct_hoc || null
      }));
      
      console.log(`Successfully fetched ${processedData?.length || 0} enrollments for student ${studentId}`);
      return processedData;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      throw error;
    }
  },
  
  async getByClass(classId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students:hoc_sinh_id (id, ten_hoc_sinh)
        `)
        .eq('lop_chi_tiet_id', classId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(enrollment => ({
        ...enrollment,
        ten_hoc_sinh: enrollment.students?.ten_hoc_sinh || null
      }));
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId}:`, error);
      throw error;
    }
  },

  async getBySession(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students:hoc_sinh_id (*)
        `)
        .eq('buoi_day_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(enrollment => ({
        ...enrollment,
        ten_hoc_sinh: enrollment.students?.ten_hoc_sinh || null
      }));
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
        .eq('lop_chi_tiet_id', classId)
        .eq('buoi_day_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for class ${classId} and session ${sessionId}:`, error);
      throw error;
    }
  },
  
  async getEnrollmentsBySessionId(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, students(*)')
        .eq('buoi_day_id', sessionId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enrollments for session ${sessionId}:`, error);
      throw error;
    }
  }
};
