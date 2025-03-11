import { TeachingSession } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

export const teachingSessionService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as TeachingSession;
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
  getByTeacher: async (teacherId: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('teacher_id', teacherId);
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  getByClass: async (classId: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('class_id', classId);
    
    if (error) throw error;
    return data as TeachingSession[];
  },
  calculateAverageScore: (session: TeachingSession) => {
    const scores = [session.danh_gia_1, session.danh_gia_2, session.danh_gia_3].filter(score => score !== null && score !== undefined) as number[];
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return sum / scores.length;
  },
  
  getByDate: async (date: string) => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('ngay', date);
      
    if (error) throw error;
    return data as TeachingSession[];
  }
};
