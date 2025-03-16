
import { supabase } from '@/lib/supabase/client';
import { TeachingSession } from '@/lib/types';

// Define Session type
interface Session {
  id: string;
  buoi_hoc_so?: string;
  noi_dung_bai_hoc?: string;
  tsi_lesson_plan?: string;
  rep_lesson_plan?: string;
  bai_tap?: string;
  unit_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const sessionService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Session[];
  }
};

export const teachingSessionService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .order('ngay_hoc', { ascending: false });
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as TeachingSession;
  },
  
  getByDate: async (date: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .eq('ngay_hoc', date)
      .order('thoi_gian_bat_dau', { ascending: true });
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  
  getByFacility: async (facilityId: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .eq('co_so', facilityId)
      .order('ngay_hoc', { ascending: false });
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  
  getByTeacher: async (teacherId: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .eq('giao_vien', teacherId)
      .order('ngay_hoc', { ascending: false });
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  
  create: async (session: Partial<TeachingSession>) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeachingSession;
  },
  
  update: async (id: string, updates: Partial<TeachingSession>) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeachingSession;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('teaching_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  calculateAverageScore: (session: TeachingSession) => {
    const scores = [
      session.nhan_xet_1 ? parseFloat(session.nhan_xet_1) : null,
      session.nhan_xet_2 ? parseFloat(session.nhan_xet_2) : null,
      session.nhan_xet_3 ? parseFloat(session.nhan_xet_3) : null,
      session.nhan_xet_4 ? parseFloat(session.nhan_xet_4) : null,
      session.nhan_xet_5 ? parseFloat(session.nhan_xet_5) : null,
      session.nhan_xet_6 ? parseFloat(session.nhan_xet_6) : null,
    ].filter(score => score !== null) as number[];
    
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((total, score) => total + score, 0);
    return parseFloat((sum / scores.length).toFixed(2));
  }
};

export default teachingSessionService;
