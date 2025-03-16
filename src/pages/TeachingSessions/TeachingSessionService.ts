
import { teachingSessionService, classService } from '@/lib/supabase';
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
    const sessionsData = await teachingSessionService.getAll();
    const classesData = await classService.getAll();
    const lessonSessionsData = await this.getSessionLessons();
      
    const processedSessions = sessionsData.map(session => {
      const classInfo = classesData.find(c => c.id === session.lop_chi_tiet_id);
      const lessonInfo = lessonSessionsData.find(l => l.id === session.session_id);
        
      return {
        ...session,
        class_name: classInfo?.ten_lop_full || 'N/A',
        lesson_name: lessonInfo?.buoi_hoc_so || 'N/A',
        lesson_content: lessonInfo?.noi_dung_bai_hoc || ''
      };
    });
    
    return {
      sessions: processedSessions,
      classes: classesData,
      lessonSessions: lessonSessionsData,
      isLoading: false
    };
  }

  async getSessionLessons() {
    try {
      const { data, error } = await teachingSessionService.supabase
        .from('sessions')
        .select('*');
        
      if (error) {
        console.error("Error fetching session lessons:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getSessionLessons:", error);
      return [];
    }
  }

  getLessonName(sessionId: string, lessonSessions: any[]): string {
    const lesson = lessonSessions.find(l => l.id === sessionId);
    return lesson ? `Buổi ${lesson.buoi_hoc_so}` : sessionId;
  }
}

export const sessionService = new TeachingSessionDataService();
