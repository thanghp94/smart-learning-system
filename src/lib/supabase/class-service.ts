
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const classService = {
  getAll: () => fetchAll<Class>('classes'),
  getById: (id: string) => fetchById<Class>('classes', id),
  create: (classData: Partial<Class>) => insert<Class>('classes', classData),
  update: (id: string, updates: Partial<Class>) => update<Class>('classes', id, updates),
  delete: (id: string) => remove('classes', id),
  
  // Make sure this alias is available for ClassDetail.tsx
  getClassById: (id: string) => fetchById<Class>('classes', id),
  
  // Get classes with student count using the view
  getAllWithStudentCount: async (): Promise<(Class & { so_hs: number })[]> => {
    const { data, error } = await supabase
      .from('classes_with_student_count')
      .select('*');
    
    if (error) {
      console.error('Error fetching classes with student count:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get classes by facility
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
  
  // Get classes by teacher
  getByTeacher: async (teacherId: string): Promise<Class[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('GV_chinh', teacherId);
    
    if (error) {
      console.error('Error fetching classes by teacher:', error);
      throw error;
    }
    
    return data as Class[];
  },
  
  // Get active classes
  getActive: async (): Promise<Class[]> => {
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
