import { apiClient } from './client';
import type { Employee, InsertEmployee } from '@shared/schema';

export const employeesApi = {
  getAll: (): Promise<Employee[]> => 
    apiClient.get<Employee[]>('/employees'),

  getById: (id: string): Promise<Employee> => 
    apiClient.get<Employee>(`/employees/${id}`),

  create: (employee: InsertEmployee): Promise<Employee> => 
    apiClient.post<Employee>('/employees', employee),

  update: (id: string, employee: Partial<InsertEmployee>): Promise<Employee> => 
    apiClient.put<Employee>(`/employees/${id}`, employee),

  delete: (id: string): Promise<void> => 
    apiClient.delete<void>(`/employees/${id}`),
};
