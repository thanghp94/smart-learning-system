
import { Evaluation } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const evaluationService = {
  getAll: () => fetchAll<Evaluation>('evaluations'),
  getById: (id: string) => fetchById<Evaluation>('evaluations', id),
  create: (evaluation: Partial<Evaluation>) => insert<Evaluation>('evaluations', evaluation),
  update: (id: string, updates: Partial<Evaluation>) => update<Evaluation>('evaluations', id, updates),
  delete: (id: string) => remove('evaluations', id),
  
  // Get evaluations by student
  getByStudent: async (studentId: string): Promise<Evaluation[]> => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('doi_tuong', 'student')
      .eq('nhanvien_id', studentId);
    
    if (error) {
      console.error('Error fetching evaluations by student:', error);
      throw error;
    }
    
    return data as Evaluation[];
  },
  
  // Get evaluations by enrollment
  getByEnrollment: async (enrollmentId: string): Promise<Evaluation[]> => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('ghi_danh_id', enrollmentId);
    
    if (error) {
      console.error('Error fetching evaluations by enrollment:', error);
      throw error;
    }
    
    return data as Evaluation[];
  },
  
  // Get evaluations by class
  getByClass: async (classId: string): Promise<Evaluation[]> => {
    // First get all enrollments for this class
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('lop_chi_tiet_id', classId);
      
    if (enrollmentsError) {
      console.error('Error fetching enrollments for class:', enrollmentsError);
      throw enrollmentsError;
    }
    
    if (!enrollments || enrollments.length === 0) {
      return [];
    }
    
    // Then get all evaluations for these enrollments
    const enrollmentIds = enrollments.map(e => e.id);
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .in('ghi_danh_id', enrollmentIds);
    
    if (error) {
      console.error('Error fetching evaluations by class:', error);
      throw error;
    }
    
    return data as Evaluation[];
  }
};
