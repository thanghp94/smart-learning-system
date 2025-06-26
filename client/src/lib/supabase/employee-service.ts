
import { Employee } from '@/lib/types';

class EmployeeService {
  private apiUrl = '/api';

  async getAll(): Promise<Employee[]> {
    console.log('Fetching all employees...');
    try {
      const response = await fetch(`${this.apiUrl}/employees`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data?.length || 0} employees`);
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Employee | null> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getById for employee:', error);
      throw error;
    }
  }

  async create(employeeData: Omit<Employee, 'id'> & { id?: string }): Promise<Employee | null> {
    try {
      const response = await fetch(`${this.apiUrl}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in create for employee:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in update for employee:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Employee not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in delete for employee:', error);
      throw error;
    }
  }

  async getTeachers(): Promise<Employee[]> {
    try {
      const allEmployees = await this.getAll();
      // Filter for teachers - assuming there's a role field or similar
      return allEmployees.filter(emp => emp.chuc_vu?.toLowerCase().includes('giáo viên') || emp.chuc_vu?.toLowerCase().includes('teacher'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  }
}

export const employeeService = new EmployeeService();
