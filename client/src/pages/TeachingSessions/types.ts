
import { TeachingSession } from '@/lib/types';

export interface EnhancedTeachingSession extends TeachingSession {
  class_name?: string;
  lesson_name?: string;
  lesson_content?: string;
}

export interface SessionActionBarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  sessions: EnhancedTeachingSession[];
  selectedDate: Date;
  onDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  classId: string;
}
