
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

// Export the getClassById function directly
export const getClassById = (id: string) => fetchById<Class>('classes', id);

export const classService = {
  getAll: () => fetchAll<Class>('classes'),
  getById: (id: string) => fetchById<Class>('classes', id),
  create: (classRecord: Partial<Class>) => insert<Class>('classes', classRecord),
  update: (id: string, updates: Partial<Class>) => update<Class>('classes', id, updates),
  delete: (id: string) => remove('classes', id),
  getByFacility: async (facilityId: string): Promise<Class[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('co_so', facilityId);
    
    if (error) {
      console.error('Error fetching classes by facility:', error);
      throw error;
    }
    
    return data as Class[];
  },
  getWithStudentCount: async (): Promise<(Class & { so_hs: number })[]> => {
    // Use the view we created in the SQL script for better performance
    const { data, error } = await supabase
      .from('classes_with_student_count')
      .select('*');
    
    if (error) {
      console.error('Error fetching classes with student count:', error);
      throw error;
    }
    
    // Fallback: Calculate manually if the view doesn't exist
    if (!data) {
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select(`
          *,
          enrollments:enrollments(count)
        `);
      
      if (classError) {
        console.error('Error fetching classes with student count:', classError);
        throw classError;
      }
      
      return (classData || []).map((classItem: any) => ({
        ...classItem,
        so_hs: classItem.enrollments.count || 0
      }));
    }
    
    return data;
  },
  // Get classes with student count for a specific facility
  getWithStudentCountByFacility: async (facilityId: string): Promise<(Class & { so_hs: number })[]> => {
    const { data, error } = await supabase
      .from('classes_with_student_count')
      .select('*')
      .eq('co_so', facilityId);
    
    if (error) {
      console.error('Error fetching classes with student count by facility:', error);
      throw error;
    }
    
    return data || [];
  },
  // Get active classes
  getActiveClasses: async (): Promise<Class[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('tinh_trang', 'active');
    
    if (error) {
      console.error('Error fetching active classes:', error);
      throw error;
    }
    
    return data as Class[];
  }
};
