import { apiClient } from './client';
import type { Student, InsertStudent } from '@shared/schema';

export const studentsApi = {
  getAll: (): Promise<Student[]> => 
    apiClient.get<Student[]>('/students'),

  getById: (id: string): Promise<Student> => 
    apiClient.get<Student>(`/students/${id}`),

  create: (student: InsertStudent): Promise<Student> => 
    apiClient.post<Student>('/students', student),

  update: (id: string, student: Partial<InsertStudent>): Promise<Student> => 
    apiClient.put<Student>(`/students/${id}`, student),

  delete: (id: string): Promise<void> => 
    apiClient.delete<void>(`/students/${id}`),
};
