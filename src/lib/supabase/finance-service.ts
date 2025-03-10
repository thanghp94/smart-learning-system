
import { Finance } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const financeService = {
  getAll: async (): Promise<Finance[]> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all finances:', error);
        throw error;
      }
      
      return data as Finance[];
    } catch (error) {
      console.error('Error in getAll finances:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Finance | null> => {
    return fetchById<Finance>('finances', id);
  },
  
  create: async (finance: Partial<Finance>): Promise<Finance> => {
    console.log('Creating finance with data:', finance);
    return insert<Finance>('finances', finance);
  },
  
  update: async (id: string, updates: Partial<Finance>): Promise<Finance> => {
    console.log(`Updating finance ${id} with data:`, updates);
    return update<Finance>('finances', id, updates);
  },
  
  delete: (id: string) => remove('finances', id),
  
  getByEntityId: async (entityType: string, entityId: string): Promise<Finance[]> => {
    try {
      // Map entity types to database field names
      const mapping: Record<string, string> = {
        'student': 'hoc_sinh',
        'employee': 'nhan_vien',
        'contact': 'lien_he',
        'facility': 'co_so'
      };
      
      // Get the correct field name
      const fieldName = mapping[entityType] || entityType;
      
      // Query finances by entity type and id
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', fieldName)
        .eq('doi_tuong_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching finances for ${entityType}:`, error);
        throw error;
      }
      
      return data as Finance[];
    } catch (error) {
      console.error(`Error in getByEntityId for ${entityType}:`, error);
      return [];
    }
  },
  
  getByType: async (type: string): Promise<Finance[]> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_thu_chi', type)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching finances by type ${type}:`, error);
        throw error;
      }
      
      return data as Finance[];
    } catch (error) {
      console.error(`Error in getByType for ${type}:`, error);
      return [];
    }
  },
  
  getByDateRange: async (startDate: string, endDate: string): Promise<Finance[]> => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .gte('ngay', startDate)
        .lte('ngay', endDate)
        .order('ngay', { ascending: false });
      
      if (error) {
        console.error(`Error fetching finances by date range:`, error);
        throw error;
      }
      
      return data as Finance[];
    } catch (error) {
      console.error(`Error in getByDateRange:`, error);
      return [];
    }
  }
};
