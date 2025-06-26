import { TeachingSession } from '@/lib/types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

const teachingSessionService = {
  async getAll(): Promise<TeachingSession[]> {
    return fetchAll<TeachingSession>('teaching-sessions');
  },

  async getById(id: string): Promise<TeachingSession> {
    const result = await fetchById<TeachingSession>('teaching-sessions', id);
    if (!result) {
      throw new Error('Teaching session not found');
    }
    return result;
  },

  async create(session: Partial<TeachingSession>): Promise<TeachingSession> {
    return insert<TeachingSession>('teaching-sessions', session);
  },

  async update(id: string, updates: Partial<TeachingSession>): Promise<TeachingSession> {
    return update<TeachingSession>('teaching-sessions', id, updates);
  },

  async delete(id: string): Promise<void> {
    return remove('teaching-sessions', id);
  },

  // Add getByClass method
  async getByClass(classId: string): Promise<TeachingSession[]> {
    try {
      const response = await fetch(`/api/teaching-sessions?classId=${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teaching sessions by class');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teaching sessions by class:', error);
      throw error;
    }
  },

  // Add getByTeacher method
  async getByTeacher(teacherId: string): Promise<TeachingSession[]> {
    try {
      const response = await fetch(`/api/teaching-sessions?teacherId=${teacherId}&includeClasses=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch teaching sessions by teacher');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teaching sessions by teacher:', error);
      throw error;
    }
  },

  // Add getByTeacherAndDate method
  async getByTeacherAndDate(teacherId: string, date: string): Promise<TeachingSession[]> {
    try {
      const response = await fetch(`/api/teaching-sessions?teacherId=${teacherId}&date=${date}&includeClasses=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch teaching sessions by teacher and date');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teaching sessions by teacher and date:', error);
      throw error;
    }
  },

  // Add getByFacility method
  async getByFacility(facilityId: string): Promise<TeachingSession[]> {
    try {
      const response = await fetch(`/api/teaching-sessions?facilityId=${facilityId}&includeClasses=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch teaching sessions by facility');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching teaching sessions by facility:', error);
      throw error;
    }
  },

  // Add getWithAvgScore method
  async getWithAvgScore(): Promise<any[]> {
    try {
      const response = await fetch('/api/teaching-sessions?includeEvaluations=true');
      if (!response.ok) {
        throw new Error('Failed to fetch teaching sessions with evaluations');
      }
      const data = await response.json();

      // Calculate average scores
      return data.map((session: any) => {
        const evaluations = session.evaluations || [];
        const avgScore = evaluations.length > 0 
          ? evaluations.reduce((sum: number, evaluation: any) => sum + (evaluation.score || 0), 0) / evaluations.length 
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
    return update<TeachingSession>('teaching-sessions', id, {
      trang_thai: 'completed'
    });
  }
};

export default teachingSessionService;