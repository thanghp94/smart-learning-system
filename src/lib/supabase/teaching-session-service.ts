
import { TeachingSession } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const teachingSessionService = {
  getAll: () => fetchAll<TeachingSession>('teaching_sessions'),
  getById: (id: string) => fetchById<TeachingSession>('teaching_sessions', id),
  
  create: async (session: Partial<TeachingSession>) => {
    try {
      console.log("Creating teaching session with data:", session);
      
      // Convert numeric values to strings before saving to match the database schema
      const formattedSession: Partial<TeachingSession> = {
        ...session,
        nhan_xet_1: session.nhan_xet_1 !== undefined && session.nhan_xet_1 !== null ? 
          String(session.nhan_xet_1) : null,
        nhan_xet_2: session.nhan_xet_2 !== undefined && session.nhan_xet_2 !== null ? 
          String(session.nhan_xet_2) : null,
        nhan_xet_3: session.nhan_xet_3 !== undefined && session.nhan_xet_3 !== null ? 
          String(session.nhan_xet_3) : null,
        nhan_xet_4: session.nhan_xet_4 !== undefined && session.nhan_xet_4 !== null ? 
          String(session.nhan_xet_4) : null,
        nhan_xet_5: session.nhan_xet_5 !== undefined && session.nhan_xet_5 !== null ? 
          String(session.nhan_xet_5) : null,
        nhan_xet_6: session.nhan_xet_6 !== undefined && session.nhan_xet_6 !== null ? 
          String(session.nhan_xet_6) : null,
      };
      
      // Make a direct insert to get better error visibility
      const { data, error } = await supabase
        .from('teaching_sessions')
        .insert(formattedSession)
        .select();
      
      if (error) {
        console.error("Error in teachingSessionService.create:", error);
        throw error;
      }
      
      console.log("Successfully created teaching session:", data);
      return data[0] as TeachingSession;
    } catch (error) {
      console.error("Exception in teachingSessionService.create:", error);
      throw error;
    }
  },
  
  update: (id: string, updates: Partial<TeachingSession>) => {
    // Similar conversion for updates
    const formattedUpdates: Partial<TeachingSession> = {
      ...updates,
      nhan_xet_1: updates.nhan_xet_1 !== undefined && updates.nhan_xet_1 !== null ? 
        String(updates.nhan_xet_1) : updates.nhan_xet_1,
      nhan_xet_2: updates.nhan_xet_2 !== undefined && updates.nhan_xet_2 !== null ? 
        String(updates.nhan_xet_2) : updates.nhan_xet_2,
      nhan_xet_3: updates.nhan_xet_3 !== undefined && updates.nhan_xet_3 !== null ? 
        String(updates.nhan_xet_3) : updates.nhan_xet_3,
      nhan_xet_4: updates.nhan_xet_4 !== undefined && updates.nhan_xet_4 !== null ? 
        String(updates.nhan_xet_4) : updates.nhan_xet_4,
      nhan_xet_5: updates.nhan_xet_5 !== undefined && updates.nhan_xet_5 !== null ? 
        String(updates.nhan_xet_5) : updates.nhan_xet_5,
      nhan_xet_6: updates.nhan_xet_6 !== undefined && updates.nhan_xet_6 !== null ? 
        String(updates.nhan_xet_6) : updates.nhan_xet_6,
    };
    
    return update<TeachingSession>('teaching_sessions', id, formattedUpdates);
  },
  
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
  },
  
  getWithAvgScore: async (): Promise<(TeachingSession & { avg_score: number })[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_avg_score')
      .select('*');
    
    if (error) {
      console.error('Error fetching sessions with average score:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getByTeacher: async (teacherId: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('giao_vien', teacherId);
    
    if (error) {
      console.error('Error fetching teaching sessions by teacher:', error);
      throw error;
    }
    
    return data as TeachingSession[];
  },
  
  getByDateRange: async (startDate: string, endDate: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .gte('ngay_hoc', startDate)
      .lte('ngay_hoc', endDate);
    
    if (error) {
      console.error('Error fetching teaching sessions by date range:', error);
      throw error;
    }
    
    return data as TeachingSession[];
  },
  
  calculateAverageScore: (session: TeachingSession): number => {
    const scores = [
      session.nhan_xet_1, 
      session.nhan_xet_2, 
      session.nhan_xet_3,
      session.nhan_xet_4,
      session.nhan_xet_5,
      session.nhan_xet_6
    ].filter(score => score !== null && score !== undefined && !isNaN(Number(score)));
    
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, score) => acc + Number(score), 0);
    return sum / scores.length;
  }
};
