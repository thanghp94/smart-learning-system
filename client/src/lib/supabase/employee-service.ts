import { Employee } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const employeeService = {
  async getAll() {
    try {
      console.log('Fetching all employees...');
      const employees = await fetchAll<Employee>('employees');
      console.log(`Successfully fetched ${employees.length} employees`);
      console.log('Fetched employees:', employees.length);
      return employees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getById(id: string) {
    return fetchById<Employee>('employees', id);
  },

  async create(employee: Partial<Employee>) {
    return insert<Employee>('employees', employee);
  },

  async update(id: string, updates: Partial<Employee>) {
    return update<Employee>('employees', id, updates);
  },

  async delete(id: string) {
    return remove('employees', id);
  },

  // Additional methods for employee-specific operations
  async getByDepartment(department: string): Promise<Employee[]> {
    try {
      const response = await fetch(`/api/employees?department=${department}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees by department');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      throw error;
    }
  },

  async getByPosition(position: string): Promise<Employee[]> {
    try {
      const response = await fetch(`/api/employees?position=${position}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees by position');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees by position:', error);
      throw error;
    }
  },

  async getByFacility(facilityId: string): Promise<Employee[]> {
    try {
      const response = await fetch(`/api/employees?facilityId=${facilityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees by facility');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees by facility:', error);
      throw error;
    }
  },
};