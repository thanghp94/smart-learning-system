
import { Class } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const getClassById = async (id: string): Promise<Class | null> => {
  return await fetchById<Class>('classes', id);
};

export const classService = {
  getAll: () => fetchAll<Class>('classes'),
  getById: getClassById,
  create: (classData: Partial<Class>) => insert<Class>('classes', classData),
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
  }
};
