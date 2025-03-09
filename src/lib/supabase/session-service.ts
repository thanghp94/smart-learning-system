
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Session } from '@/lib/types';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('tg_tao', { ascending: false });
      
      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }
      
      console.log(`Successfully fetched ${data?.length || 0} sessions`);
      return data || [];
    } catch (error) {
      console.error('Error in fetchSessions:', error);
      return [];
    }
  },

  getById: (id: string) => fetchById<Session>('sessions', id),
  
  create: async (sessionData: Partial<Session>): Promise<Session | null> => {
    try {
      console.log('Creating new session:', sessionData);
      
      // Use the RPC function to create the session
      const { data, error } = await supabase.rpc(
        'create_session',
        { session_data: sessionData }
      );
      
      if (error) {
        console.error('Error creating session via RPC:', error);
        
        // Fallback to direct insert if RPC fails
        console.log('Attempting direct insert as fallback...');
        return insert<Session>('sessions', sessionData);
      }
      
      console.log('Session created successfully via RPC:', data);
      return data as Session;
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  },
  
  update: (id: string, updates: Partial<Session>) => update<Session>('sessions', id, updates),
  
  delete: (id: string) => remove('sessions', id),
  
  getByUnitId: async (unitId: string): Promise<Session[]> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('unit_id', unitId)
      .order('buoi_hoc_so', { ascending: true });
    
    if (error) {
      console.error('Error fetching sessions by unit ID:', error);
      throw error;
    }
    
    return data || [];
  }
};

export default sessionService;
