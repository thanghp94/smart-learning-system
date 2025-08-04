// Centralized API exports
export { apiClient } from './client';
export { studentsApi } from './students';
export { employeesApi } from './employees';

// Re-export types from shared schema
export type { 
  Student, 
  Employee, 
  InsertStudent, 
  InsertEmployee 
} from '@shared/schema';
