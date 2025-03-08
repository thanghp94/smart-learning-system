
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

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
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        enrollments:enrollments(count)
      `);
    
    if (error) {
      console.error('Error fetching classes with student count:', error);
      throw error;
    }
    
    return data.map((classItem: any) => ({
      ...classItem,
      so_hs: classItem.enrollments.count || 0
    }));
  }
};
