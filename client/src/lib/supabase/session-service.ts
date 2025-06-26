
import { Session } from '../types';
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getAll sessions:", error);
      return [];
    }
  },
  
  getById: (id: string) => fetchById<Session>('sessions', id),
  
  create: async (sessionData: Partial<Session>): Promise<Session | null> => {
    try {
      // Ensure required fields are present
      if (!sessionData.buoi_hoc_so || !sessionData.noi_dung_bai_hoc) {
        throw new Error("Missing required fields for session");
      }
      
      const { data, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating session:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error in create session:", error);
      throw error;
    }
  },
  
  update: (id: string, updates: Partial<Session>) => update<Session>('sessions', id, updates),
  
  delete: (id: string) => remove('sessions', id),
  
  getByUnitId: async (unitId: string): Promise<Session[]> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('unit_id', unitId);
    
    if (error) {
      console.error('Error fetching sessions by unit ID:', error);
      throw error;
    }
    
    return data as Session[];
  },
  
  getByBuoiHocSo: async (buoiHocSo: string): Promise<Session | null> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('buoi_hoc_so', buoiHocSo)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching session by buoi_hoc_so:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getByBuoiHocSo:', error);
      return null;
    }
  }
};
