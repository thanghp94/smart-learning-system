
import { Enrollment } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const enrollmentService = {
  getAll: () => fetchAll<Enrollment>('enrollments'),
  getById: (id: string) => fetchById<Enrollment>('enrollments', id),
  create: (enrollment: Partial<Enrollment>) => insert<Enrollment>('enrollments', enrollment),
  update: (id: string, updates: Partial<Enrollment>) => update<Enrollment>('enrollments', id, updates),
  delete: (id: string) => remove('enrollments', id),
  getByClass: async (classId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) {
      console.error('Error fetching enrollments by class:', error);
      throw error;
    }
    
    return data as Enrollment[];
  },
  getByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('hoc_sinh_id', studentId);
    
    if (error) {
      console.error('Error fetching enrollments by student:', error);
      throw error;
    }
    
    return data as Enrollment[];
  }
};
