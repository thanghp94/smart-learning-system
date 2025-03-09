
import { TeachingSession } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const teachingSessionService = {
  getAll: () => fetchAll<TeachingSession>('teaching_sessions'),
  getById: (id: string) => fetchById<TeachingSession>('teaching_sessions', id),
  
  create: async (session: Partial<TeachingSession>) => {
    try {
      console.log("Creating teaching session with data:", session);
      
      // Validate required fields
      if (!session.lop_chi_tiet_id || !session.session_id || !session.giao_vien || !session.ngay_hoc) {
        throw new Error("Missing required fields for teaching session");
      }
      
      // Remove trung_binh field as it's a generated column
      const { trung_binh, ...sessionData } = session;
      
      // Ensure session_id is a valid UUID
      if (typeof sessionData.session_id === 'string' && 
          !sessionData.session_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // If session_id is not a valid UUID, we need to generate one
        console.log("Converting non-UUID session_id to UUID");
        try {
          // Try to fetch the session by buoi_hoc_so from sessions table
          const { data: sessionData } = await supabase
            .from('sessions')
            .select('id')
            .eq('buoi_hoc_so', session.session_id)
            .single();
            
          if (sessionData && sessionData.id) {
            sessionData.session_id = sessionData.id;
          } else {
            // If not found, generate a new UUID
            const { data: newSession } = await supabase
              .from('sessions')
              .insert({
                buoi_hoc_so: session.session_id.toString(),
                noi_dung_bai_hoc: 'Auto-generated session',
                unit_id: 'AUTO'
              })
              .select()
              .single();
              
            if (newSession) {
              sessionData.session_id = newSession.id;
            } else {
              throw new Error("Could not create a new session");
            }
          }
        } catch (error) {
          console.error("Error handling session_id:", error);
          throw new Error("Invalid session_id format and could not generate a new one");
        }
      }
      
      // Convert numeric values to strings before saving to match the database schema
      const formattedSession: Partial<TeachingSession> = {
        ...sessionData,
        loai_bai_hoc: sessionData.loai_bai_hoc || 'Standard',
        nhan_xet_1: sessionData.nhan_xet_1 !== undefined && sessionData.nhan_xet_1 !== null ? 
          String(sessionData.nhan_xet_1) : null,
        nhan_xet_2: sessionData.nhan_xet_2 !== undefined && sessionData.nhan_xet_2 !== null ? 
          String(sessionData.nhan_xet_2) : null,
        nhan_xet_3: sessionData.nhan_xet_3 !== undefined && sessionData.nhan_xet_3 !== null ? 
          String(sessionData.nhan_xet_3) : null,
        nhan_xet_4: sessionData.nhan_xet_4 !== undefined && sessionData.nhan_xet_4 !== null ? 
          String(sessionData.nhan_xet_4) : null,
        nhan_xet_5: sessionData.nhan_xet_5 !== undefined && sessionData.nhan_xet_5 !== null ? 
          String(sessionData.nhan_xet_5) : null,
        nhan_xet_6: sessionData.nhan_xet_6 !== undefined && sessionData.nhan_xet_6 !== null ? 
          String(sessionData.nhan_xet_6) : null,
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
    try {
      console.log("Updating teaching session with data:", updates);
      
      // Remove trung_binh field as it's a generated column
      const { trung_binh, ...updateData } = updates;
      
      // Similar conversion for updates
      const formattedUpdates: Partial<TeachingSession> = {
        ...updateData,
        // Ensure the field name matches the database column
        loai_bai_hoc: updateData.loai_bai_hoc, // Using lowercase field name
        nhan_xet_1: updateData.nhan_xet_1 !== undefined && updateData.nhan_xet_1 !== null ? 
          String(updateData.nhan_xet_1) : updateData.nhan_xet_1,
        nhan_xet_2: updateData.nhan_xet_2 !== undefined && updateData.nhan_xet_2 !== null ? 
          String(updateData.nhan_xet_2) : updateData.nhan_xet_2,
        nhan_xet_3: updateData.nhan_xet_3 !== undefined && updateData.nhan_xet_3 !== null ? 
          String(updateData.nhan_xet_3) : updateData.nhan_xet_3,
        nhan_xet_4: updateData.nhan_xet_4 !== undefined && updateData.nhan_xet_4 !== null ? 
          String(updateData.nhan_xet_4) : updateData.nhan_xet_4,
        nhan_xet_5: updateData.nhan_xet_5 !== undefined && updateData.nhan_xet_5 !== null ? 
          String(updateData.nhan_xet_5) : updateData.nhan_xet_5,
        nhan_xet_6: updateData.nhan_xet_6 !== undefined && updateData.nhan_xet_6 !== null ? 
          String(updateData.nhan_xet_6) : updateData.nhan_xet_6,
      };
      
      return update<TeachingSession>('teaching_sessions', id, formattedUpdates);
    } catch (error) {
      console.error("Error updating teaching session:", error);
      throw error;
    }
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
    try {
      const { data, error } = await supabase
        .from('teaching_sessions_with_avg_score')
        .select('*');
      
      if (error) {
        console.error('Error fetching sessions with average score:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Exception in getWithAvgScore:', error);
      throw error;
    }
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
