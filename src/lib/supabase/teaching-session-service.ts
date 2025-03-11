
import { supabase } from './client';
import { TeachingSession } from '../types';

export const teachingSessionService = {
  getAll: async (): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .order('ngay_hoc', { ascending: false });

    if (error) {
      console.error('Error fetching teaching sessions:', error);
      throw error;
    }

    return data || [];
  },

  getById: async (id: string): Promise<TeachingSession> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select(`
        *,
        classes:lop_chi_tiet_id (
          ten_lop,
          ten_lop_full
        ),
        teachers:giao_vien (
          ten_nhan_su
        ),
        assistants:tro_giang (
          ten_nhan_su
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching teaching session:', error);
      throw error;
    }

    return data;
  },

  create: async (session: Partial<TeachingSession>): Promise<TeachingSession> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating teaching session:', error);
      throw error;
    }

    return data;
  },

  update: async (id: string, updates: Partial<TeachingSession>): Promise<TeachingSession> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating teaching session:', error);
      throw error;
    }

    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('teaching_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting teaching session:', error);
      throw error;
    }
  },

  getByClass: async (classId: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('lop_chi_tiet_id', classId)
      .order('ngay_hoc', { ascending: false });

    if (error) {
      console.error('Error fetching teaching sessions by class:', error);
      throw error;
    }

    return data || [];
  },

  getByTeacher: async (teacherId: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('giao_vien', teacherId)
      .order('ngay_hoc', { ascending: false });

    if (error) {
      console.error('Error fetching teaching sessions by teacher:', error);
      throw error;
    }

    return data || [];
  },
  
  getByTeacherAndDate: async (teacherId: string, date: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions_with_details')
      .select('*')
      .eq('giao_vien', teacherId)
      .eq('ngay_hoc', date)
      .order('thoi_gian_bat_dau', { ascending: true });

    if (error) {
      console.error('Error fetching teaching sessions by teacher and date:', error);
      throw error;
    }

    return data || [];
  },

  getByDate: async (date: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .eq('ngay_hoc', date)
      .order('thoi_gian_bat_dau', { ascending: true });

    if (error) {
      console.error('Error fetching teaching sessions by date:', error);
      throw error;
    }

    return data || [];
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<TeachingSession[]> => {
    const { data, error } = await supabase
      .from('teaching_sessions')
      .select('*')
      .gte('ngay_hoc', startDate)
      .lte('ngay_hoc', endDate)
      .order('ngay_hoc', { ascending: true });

    if (error) {
      console.error('Error fetching teaching sessions by date range:', error);
      throw error;
    }

    return data || [];
  },

  complete: async (id: string): Promise<TeachingSession> => {
    return teachingSessionService.update(id, { 
      updated_at: new Date().toISOString()
    });
  }
};

export default teachingSessionService;
