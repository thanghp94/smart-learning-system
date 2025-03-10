
import { Attendance } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const attendanceService = {
  getAll: () => fetchAll<Attendance>('attendances'),
  getById: (id: string) => fetchById<Attendance>('attendances', id),
  create: (attendance: Partial<Attendance>) => insert<Attendance>('attendances', attendance),
  update: (id: string, attendance: Partial<Attendance>) => update<Attendance>('attendances', id, attendance),
  delete: (id: string) => remove('attendances', id),
  
  // Get attendance records for a specific teaching session
  getByTeachingSession: async (teachingSessionId: string): Promise<Attendance[]> => {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('teaching_session_id', teachingSessionId);
    
    if (error) {
      console.error('Error fetching attendance records by teaching session:', error);
      throw error;
    }
    
    return data as Attendance[];
  },
  
  // Get attendance records with student details for a specific teaching session
  getDetailsByTeachingSession: async (teachingSessionId: string) => {
    const { data, error } = await supabase
      .from('attendances_with_details')
      .select('*')
      .eq('teaching_session_id', teachingSessionId);
    
    if (error) {
      console.error('Error fetching detailed attendance records:', error);
      throw error;
    }
    
    return data;
  },
  
  // Generate attendance records for today
  generateForToday: async (): Promise<{ created: number; skipped: number }> => {
    try {
      const { data, error } = await supabase.rpc('create_today_attendance_records');
      
      if (error) {
        console.error('Error generating attendance records for today:', error);
        throw error;
      }
      
      return {
        created: data?.created || 0,
        skipped: data?.skipped || 0
      };
    } catch (error) {
      console.error('Exception generating attendance records:', error);
      throw error;
    }
  },
  
  // Generate attendance records for a specific date
  generateForDate: async (date: string): Promise<{ created: number; skipped: number }> => {
    try {
      const { data, error } = await supabase.rpc('create_attendance_records_for_date', {
        check_date: date
      });
      
      if (error) {
        console.error(`Error generating attendance records for ${date}:`, error);
        throw error;
      }
      
      return {
        created: data?.created || 0,
        skipped: data?.skipped || 0
      };
    } catch (error) {
      console.error('Exception generating attendance records:', error);
      throw error;
    }
  }
};
