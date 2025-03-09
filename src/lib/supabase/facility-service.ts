
import { Facility } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const facilityService = {
  getAll: () => fetchAll<Facility>('facilities'),
  getById: (id: string) => fetchById<Facility>('facilities', id),
  create: (facility: Partial<Facility>) => insert<Facility>('facilities', facility),
  update: (id: string, updates: Partial<Facility>) => update<Facility>('facilities', id, updates),
  delete: (id: string) => remove('facilities', id),
  
  // Get active facilities
  getActive: async (): Promise<Facility[]> => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('trang_thai', 'active');
    
    if (error) {
      console.error('Error fetching active facilities:', error);
      throw error;
    }
    
    return data as Facility[];
  },
  
  // Get facilities by manager
  getByManager: async (managerId: string): Promise<Facility[]> => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('nguoi_phu_trach', managerId);
    
    if (error) {
      console.error('Error fetching facilities by manager:', error);
      throw error;
    }
    
    return data as Facility[];
  }
};
