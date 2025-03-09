
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

// Export the getClassById function directly
export const getClassById = async (id: string): Promise<Class | null> => {
  try {
    return await fetchById<Class>('classes', id);
  } catch (error) {
    console.error('Error in getClassById:', error);
    return null;
  }
};

export const classService = {
  getAll: async (): Promise<Class[]> => {
    try {
      const data = await fetchAll<Class>('classes');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAll classes:', error);
      return [];
    }
  },
  getById: getClassById,
  create: (classRecord: Partial<Class>) => insert<Class>('classes', classRecord),
  update: (id: string, updates: Partial<Class>) => update<Class>('classes', id, updates),
  delete: (id: string) => remove('classes', id),
  getByFacility: async (facilityId: string): Promise<Class[]> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('co_so', facilityId);
      
      if (error) {
        console.error('Error fetching classes by facility:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getByFacility classes:', error);
      return [];
    }
  },
  getWithStudentCount: async (): Promise<(Class & { so_hs: number })[]> => {
    try {
      // Use the view we created in the SQL script for better performance
      const { data, error } = await supabase
        .from('classes_with_student_count')
        .select('*');
      
      if (error) {
        console.error('Error fetching classes with student count:', error);
        return [];
      }
      
      // Fallback: Calculate manually if the view doesn't exist
      if (!data || !Array.isArray(data)) {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select(`
            *,
            enrollments:enrollments(count)
          `);
        
        if (classError) {
          console.error('Error fetching classes with student count:', classError);
          return [];
        }
        
        return (classData || []).map((classItem: any) => ({
          ...classItem,
          so_hs: classItem.enrollments?.count || 0
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Error in getWithStudentCount:', error);
      return [];
    }
  },
  // Get classes with student count for a specific facility
  getWithStudentCountByFacility: async (facilityId: string): Promise<(Class & { so_hs: number })[]> => {
    try {
      const { data, error } = await supabase
        .from('classes_with_student_count')
        .select('*')
        .eq('co_so', facilityId);
      
      if (error) {
        console.error('Error fetching classes with student count by facility:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getWithStudentCountByFacility:', error);
      return [];
    }
  },
  // Get active classes
  getActiveClasses: async (): Promise<Class[]> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('tinh_trang', 'active');
      
      if (error) {
        console.error('Error fetching active classes:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getActiveClasses:', error);
      return [];
    }
  }
};
