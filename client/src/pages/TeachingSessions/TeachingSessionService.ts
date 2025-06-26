
import { teachingSessionService } from '@/lib/supabase';
import { TeachingSession } from '@/lib/types';
import { EnhancedTeachingSession } from './types';

interface SessionsData {
  sessions: EnhancedTeachingSession[];
  classes: any[];
  lessonSessions: any[];
  isLoading: boolean;
}

class TeachingSessionDataService {
  async fetchAllData(): Promise<SessionsData> {
    try {
      console.log("Fetching all session data");
      const [sessionsData, classesData, teachersData] = await Promise.all([
        teachingSessionService.getAll(),
        this.getClasses(),
        this.getTeachers()
      ]);
      
      console.log("Sessions data:", sessionsData);
      console.log("Classes data:", classesData);
      console.log("Teachers data:", teachersData);
        
      const processedSessions = sessionsData.map((session: any) => {
        const classInfo = classesData.find((c: any) => c.id === session.class_id);
        const teacherInfo = teachersData.find((t: any) => t.id === session.giao_vien);
          
        return {
          ...session,
          class_name: classInfo?.ten_lop_full || classInfo?.ten_lop || 'N/A',
          teacher_name: teacherInfo?.ten_nhan_vien || 'N/A'
        };
      });
      
      return {
        sessions: processedSessions,
        classes: classesData,
        lessonSessions: teachersData,
        isLoading: false
      };
    } catch (error) {
      console.error("Error in fetchAllData:", error);
      return {
        sessions: [],
        classes: [],
        lessonSessions: [],
        isLoading: false
      };
    }
  }

  async getTeachers() {
    try {
      console.log("Fetching teachers");
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error in getTeachers:", error);
      return [];
    }
  }

  async getClasses() {
    try {
      console.log("Fetching classes");
      const response = await fetch('/api/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error in getClasses:", error);
      return [];
    }
  }

  getLessonName(sessionId: string, lessonSessions: any[]): string {
    const lesson = lessonSessions.find(l => l.id === sessionId);
    return lesson ? `Buổi ${lesson.buoi_hoc_so}` : sessionId;
  }
}

export const sessionService = new TeachingSessionDataService();
