
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
  },
  // Get sessions with computed average score
  getWithAvgScore: async (): Promise<(TeachingSession & { avg_score: number })[]> => {
    // Use the view we created in the SQL script
    const { data, error } = await supabase
      .from('teaching_sessions_with_avg_score')
      .select('*');
    
    if (error) {
      console.error('Error fetching sessions with average score:', error);
      throw error;
    }
    
    return data || [];
  },
  // Get sessions by teacher
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
  // Get sessions by date range
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
  // Calculate the average score for a session
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
  },
  // Record teacher's time
  recordTeacherTime: async (
    sessionId: string, 
    startTime: string, 
    endTime: string
  ): Promise<TeachingSession> => {
    return update<TeachingSession>('teaching_sessions', sessionId, {
      thoi_gian_bat_dau: startTime,
      thoi_gian_ket_thuc: endTime
    });
  }
};
