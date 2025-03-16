
import { TeachingSession } from '@/lib/types';

// Extend TeachingSession with additional properties we're using
export interface EnhancedTeachingSession extends TeachingSession {
  class_name?: string;
  lesson_name?: string;
  lesson_content?: string;
}
