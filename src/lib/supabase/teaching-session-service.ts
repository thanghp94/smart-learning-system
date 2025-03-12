import { supabase } from './supabase';
import { TeachingSession } from '@/lib/types';

const teachingSessionService = {
  async getAll(): Promise<TeachingSession[]> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teaching sessions:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<TeachingSession> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teaching session by ID:', error);
      throw error;
    }
  },

  async create(session: Partial<TeachingSession>): Promise<TeachingSession> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating teaching session:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<TeachingSession>): Promise<TeachingSession> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating teaching session:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('teaching_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting teaching session:', error);
      throw error;
    }
  },

  // Add getByTeacherAndDate method
  async getByTeacherAndDate(teacherId: string, date: string): Promise<TeachingSession[]> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .select('*, classes(*)')
        .eq('teacher_id', teacherId)
        .eq('ngay_day', date);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teaching sessions by teacher and date:', error);
      throw error;
    }
  },

  // Add getByFacility method
  async getByFacility(facilityId: string): Promise<TeachingSession[]> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .select('*, classes(*)')
        .eq('co_so_id', facilityId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teaching sessions by facility:', error);
      throw error;
    }
  },

  // Add getWithAvgScore method
  async getWithAvgScore(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .select('*, classes(*), evaluations(*)');

      if (error) throw error;
    
      // Calculate average scores
      return (data || []).map(session => {
        const evaluations = session.evaluations || [];
        const avgScore = evaluations.length > 0 
          ? evaluations.reduce((sum: number, eval: any) => sum + (eval.score || 0), 0) / evaluations.length 
          : 0;
      
        return { ...session, avgScore };
      });
    } catch (error) {
      console.error('Error fetching teaching sessions with average scores:', error);
      throw error;
    }
  },

  // Fix the complete method to use valid fields
  async complete(id: string): Promise<TeachingSession> {
    try {
      const { data, error } = await supabase
        .from('teaching_sessions')
        .update({
          status: 'completed'
          // Remove invalid updated_at field
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing teaching session:', error);
      throw error;
    }
  }
};

export default teachingSessionService;
