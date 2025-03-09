
import { Enrollment } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const enrollmentService = {
  getAll: async (): Promise<Enrollment[]> => {
    try {
      // Use the view that joins enrollment data with student and class info
      const { data, error } = await supabase
        .from('student_enrollments_with_details')
        .select('*');
      
      if (error) {
        console.error('Error fetching all enrollments:', error);
        throw error;
      }
      
      return data as Enrollment[];
    } catch (error) {
      console.error('Error in getAll enrollments:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Enrollment | null> => {
    try {
      const { data, error } = await supabase
        .from('student_enrollments_with_details')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching enrollment by ID:', error);
        throw error;
      }
      
      return data as Enrollment;
    } catch (error) {
      console.error(`Error getting enrollment with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (enrollment: Partial<Enrollment>): Promise<Enrollment> => {
    console.log('Creating enrollment with data:', enrollment);
    return insert<Enrollment>('enrollments', enrollment);
  },
  
  update: async (id: string, updates: Partial<Enrollment>): Promise<Enrollment> => {
    console.log(`Updating enrollment ${id} with data:`, updates);
    return update<Enrollment>('enrollments', id, updates);
  },
  
  delete: (id: string) => remove('enrollments', id),
  
  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('student_enrollments_with_details')
      .select('*')
      .eq('hoc_sinh_id', studentId);
    
    if (error) {
      console.error('Error fetching enrollments by student:', error);
      throw error;
    }
    
    return data as Enrollment[];
  },
  
  getByClass: async (classId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('student_enrollments_with_details')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) {
      console.error('Error fetching enrollments by class:', error);
      throw error;
    }
    
    return data as Enrollment[];
  },
  
  getBySession: async (sessionId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('student_enrollments_with_details')
      .select('*')
      .eq('buoi_day_id', sessionId);
    
    if (error) {
      console.error('Error fetching enrollments by session:', error);
      throw error;
    }
    
    return data as Enrollment[];
  },
  
  markAttendance: async (
    id: string, 
    status: string, 
    notes?: string
  ): Promise<Enrollment> => {
    return update<Enrollment>('enrollments', id, {
      tinh_trang_diem_danh: status,
      ghi_chu: notes
    });
  }
};
