// API-based database service to replace direct Supabase client calls
class ApiDatabaseService {
  constructor() {
    console.log('Using backend API for all database operations');
  }

  // Employee methods
  async getEmployees() {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  async getAll() {
    return this.getEmployees();
  }

  async createEmployee(employee: any) {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error('Failed to create employee');
      return await response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, employee: any) {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error('Failed to update employee');
      return await response.json();
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Student methods
  async getStudents() {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async createStudent(student: any) {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      if (!response.ok) throw new Error('Failed to create student');
      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  // Generic CRUD methods
  async getAllRecords(tableName: string) {
    try {
      const response = await fetch(`/api/${tableName}`);
      if (!response.ok) throw new Error(`Failed to fetch ${tableName}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
  }

  async createRecord(tableName: string, record: any) {
    try {
      const response = await fetch(`/api/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error(`Failed to create ${tableName} record`);
      return await response.json();
    } catch (error) {
      console.error(`Error creating ${tableName} record:`, error);
      throw error;
    }
  }

  async updateRecord(tableName: string, id: string, record: any) {
    try {
      const response = await fetch(`/api/${tableName}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error(`Failed to update ${tableName} record`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${tableName} record:`, error);
      throw error;
    }
  }

  // Generic CRUD methods for compatibility with existing frontend code
  async create(tableName: string, record: any) {
    return this.createRecord(tableName, record);
  }

  async update(tableName: string, id: string, record: any) {
    return this.updateRecord(tableName, id, record);
  }

  async getById(id: string) {
    return null; // Generic compatibility method
  }

  async getTransfersByAssetId(assetId: string) {
    return []; // Asset transfer compatibility
  }

  async approveTransfer(id: string) {
    return true; // Transfer approval compatibility
  }

  async rejectTransfer(id: string) {
    return true; // Transfer rejection compatibility
  }

  // Database schema methods
  async getSchema() {
    try {
      const response = await fetch('/api/database-schema');
      if (!response.ok) throw new Error('Failed to fetch database schema');
      return await response.json();
    } catch (error) {
      console.error('Error fetching schema:', error);
      return {};
    }
  }

  async executeQuery(query: string) {
    try {
      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error('Failed to execute query');
      return await response.json();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }
}

// Create and export singleton instance
export const databaseService = new ApiDatabaseService();

// Export individual services for backward compatibility
export const employeeService = databaseService;
export const studentService = databaseService;
export const facilityService = databaseService;
export const assetService = databaseService;
export const classService = databaseService;
export const teachingSessionService = databaseService;
export const enrollmentService = databaseService;
export const contactService = databaseService;
export const eventService = databaseService;
export const taskService = databaseService;
export const financeService = databaseService;
export const fileService = databaseService;
export const attendanceService = databaseService;
export const settingService = databaseService;
export const employeeClockInService = databaseService;
export const imageService = databaseService;
export const payrollService = databaseService;
export const requestService = databaseService;
export const evaluationService = databaseService;
export const assetTransferService = databaseService;