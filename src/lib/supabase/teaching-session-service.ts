
import { TeachingSession } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const teachingSessionService = {
  getAll: () => fetchAll<TeachingSession>('teaching_sessions'),
  getById: (id: string) => fetchById<TeachingSession>('teaching_sessions', id),
  create: (session: Partial<TeachingSession>) => insert<TeachingSession>('teaching_sessions', session),
  update: (id: string, updates: Partial<TeachingSession>) => update<TeachingSession>('teaching_sessions', id, updates),
  delete: (id: string) => remove('teaching_sessions', id),
  getByClass: async (classId: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('lop_chi_tiet_id', classId);
    
    if (error) {
      console.error('Error fetching teaching sessions by class:', error);
      throw error;
    }
    
    return data as TeachingSession[];
  }
};
