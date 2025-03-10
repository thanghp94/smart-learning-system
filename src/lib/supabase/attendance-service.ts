
import { Attendance } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    try {
      const { data, error } = await supabase
        .from('attendances_with_details')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all attendances:', error);
        throw error;
      }
      
      return data as Attendance[];
    } catch (error) {
      console.error('Error in getAll attendances:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Attendance | null> => {
    return fetchById<Attendance>('attendances', id);
  },
  
  create: async (attendance: Partial<Attendance>): Promise<Attendance> => {
    console.log('Creating attendance with data:', attendance);
    return insert<Attendance>('attendances', attendance);
  },
  
  update: async (id: string, updates: Partial<Attendance>): Promise<Attendance> => {
    console.log(`Updating attendance ${id} with data:`, updates);
    return update<Attendance>('attendances', id, updates);
  },
  
  delete: (id: string) => remove('attendances', id),
  
  getByEnrollment: async (enrollmentId: string): Promise<Attendance[]> => {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendances by enrollment:', error);
      throw error;
    }
    
    return data as Attendance[];
  },
  
  getByTeachingSession: async (sessionId: string): Promise<Attendance[]> => {
    const { data, error } = await supabase
      .from('attendances_with_details')
      .select('*')
      .eq('teaching_session_id', sessionId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendances by teaching session:', error);
      throw error;
    }
    
    return data as Attendance[];
  },
  
  getByStudent: async (studentId: string): Promise<Attendance[]> => {
    const { data, error } = await supabase
      .from('attendances_with_details')
      .select('*')
      .eq('hoc_sinh_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendances by student:', error);
      throw error;
    }
    
    return data as Attendance[];
  },
  
  getByClass: async (classId: string): Promise<Attendance[]> => {
    const { data, error } = await supabase
      .from('attendances_with_details')
      .select('*')
      .eq('lop_id', classId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendances by class:', error);
      throw error;
    }
    
    return data as Attendance[];
  }
};
