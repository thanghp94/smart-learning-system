import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Using PostgreSQL directly.');
}

// Only create Supabase client if configured
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Re-export all services from the API-based database service for backward compatibility
export {
  databaseService,
  employeeService,
  facilityService,
  assetService,
  classService,
  studentService,
  teachingSessionService,
  enrollmentService,
  contactService,
  eventService,
  taskService,
  financeService,
  fileService,
  attendanceService,
  settingService,
  employeeClockInService,
  imageService,
  payrollService,
  requestService,
  evaluationService,
  assetTransferService
} from './api-database';