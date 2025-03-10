
import { Evaluation } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const evaluationService = {
  getAll: () => fetchAll<Evaluation>('evaluations'),
  getById: (id: string) => fetchById<Evaluation>('evaluations', id),
  create: (evaluation: Partial<Evaluation>) => insert<Evaluation>('evaluations', evaluation),
  update: (id: string, evaluation: Partial<Evaluation>) => update<Evaluation>('evaluations', id, evaluation),
  delete: (id: string) => remove('evaluations', id),
  
  // Get evaluations by student ID
  getByStudent: async (studentId: string): Promise<Evaluation[]> => {
    try {
      // First get enrollments for this student
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('hoc_sinh_id', studentId);
      
      if (enrollmentsError) {
        console.error('Error fetching enrollments for student:', enrollmentsError);
        throw enrollmentsError;
      }
      
      if (!enrollments || enrollments.length === 0) {
        return [];
      }
      
      // Get all enrollment IDs
      const enrollmentIds = enrollments.map(e => e.id);
      
      // Get evaluations for these enrollments
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .in('ghi_danh_id', enrollmentIds);
      
      if (error) {
        console.error('Error fetching evaluations by student enrollments:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getByStudent:', error);
      return [];
    }
  },
  
  // Get evaluations by enrollment ID
  getByEnrollment: async (enrollmentId: string): Promise<Evaluation[]> => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('ghi_danh_id', enrollmentId);
      
      if (error) {
        console.error('Error fetching evaluations by enrollment:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getByEnrollment:', error);
      return [];
    }
  },
  
  // Get evaluations by class ID (through enrollments)
  getByClass: async (classId: string): Promise<Evaluation[]> => {
    try {
      // First get enrollments for this class
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
      
      // Get all enrollment IDs
      const enrollmentIds = enrollments.map(e => e.id);
      
      // Get evaluations for these enrollments
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .in('ghi_danh_id', enrollmentIds);
      
      if (error) {
        console.error('Error fetching evaluations by class enrollments:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getByClass:', error);
      return [];
    }
  },
};
