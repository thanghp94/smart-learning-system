import { apiClient } from '../api/client';

// Consolidated database service that replaces both database.ts and api-database.ts
class DatabaseService {
  constructor() {
    console.log('Using PostgreSQL API database service');
  }

  // Student methods
  async getStudents() {
    return apiClient.getAll('students');
  }

  async getStudent(id: string) {
    return apiClient.getById('students', id);
  }

  async createStudent(student: any) {
    return apiClient.create('students', student);
  }

  async updateStudent(id: string, student: any) {
    return apiClient.update('students', id, student);
  }

  async deleteStudent(id: string) {
    return apiClient.remove('students', id);
  }

  // Employee methods
  async getEmployees() {
    return apiClient.getAll('employees');
  }

  async getEmployee(id: string) {
    return apiClient.getById('employees', id);
  }

  async createEmployee(employee: any) {
    return apiClient.create('employees', employee);
  }

  async updateEmployee(id: string, employee: any) {
    return apiClient.update('employees', id, employee);
  }

  async deleteEmployee(id: string) {
    return apiClient.remove('employees', id);
  }

  // Class methods
  async getClasses() {
    return apiClient.getAll('classes');
  }

  async getClass(id: string) {
    return apiClient.getById('classes', id);
  }

  async createClass(classData: any) {
    return apiClient.create('classes', classData);
  }

  async updateClass(id: string, classData: any) {
    return apiClient.update('classes', id, classData);
  }

  async deleteClass(id: string) {
    return apiClient.remove('classes', id);
  }

  // Teaching Session methods
  async getTeachingSessions() {
    return apiClient.getAll('teaching-sessions');
  }

  async getTeachingSession(id: string) {
    return apiClient.getById('teaching-sessions', id);
  }

  async createTeachingSession(session: any) {
    return apiClient.create('teaching-sessions', session);
  }

  async updateTeachingSession(id: string, session: any) {
    return apiClient.update('teaching-sessions', id, session);
  }

  async deleteTeachingSession(id: string) {
    return apiClient.remove('teaching-sessions', id);
  }

  // Facility methods
  async getFacilities() {
    return apiClient.getAll('facilities');
  }

  async getFacility(id: string) {
    return apiClient.getById('facilities', id);
  }

  async createFacility(facility: any) {
    return apiClient.create('facilities', facility);
  }

  async updateFacility(id: string, facility: any) {
    return apiClient.update('facilities', id, facility);
  }

  async deleteFacility(id: string) {
    return apiClient.remove('facilities', id);
  }

  // Generic methods for all other resources
  async getAll(resource: string) {
    return apiClient.getAll(resource);
  }

  async getById(resource: string, id: string) {
    return apiClient.getById(resource, id);
  }

  async create(resource: string, data: any) {
    return apiClient.create(resource, data);
  }

  async update(resource: string, id: string, data: any) {
    return apiClient.update(resource, id, data);
  }

  async delete(resource: string, id: string) {
    return apiClient.remove(resource, id);
  }

  // Compatibility methods for legacy code
  async getAllRecords(tableName: string) {
    return this.getAll(tableName);
  }

  async createRecord(tableName: string, record: any) {
    return this.create(tableName, record);
  }

  async updateRecord(tableName: string, id: string, record: any) {
    return this.update(tableName, id, record);
  }

  async deleteRecord(tableName: string, id: string) {
    return this.delete(tableName, id);
  }

  // Special methods
  async getTeachers() {
    return apiClient.get('/teachers');
  }

  async getAttendances() {
    return apiClient.getAll('attendances');
  }

  async getEnrollments() {
    return apiClient.getAll('enrollments');
  }

  async getAssets() {
    return apiClient.getAll('assets');
  }

  async getTasks() {
    return apiClient.getAll('tasks');
  }

  async getEvaluations() {
    return apiClient.getAll('evaluations');
  }

  async getAdmissions() {
    return apiClient.getAll('admissions');
  }

  async getFiles() {
    return apiClient.getAll('files');
  }

  async getImages() {
    return apiClient.getAll('images');
  }

  async getContacts() {
    return apiClient.getAll('contacts');
  }

  async getRequests() {
    return apiClient.getAll('requests');
  }

  async getPayroll() {
    return apiClient.getAll('payroll');
  }

  async getEmployeeClockIns() {
    return apiClient.getAll('employee-clock-ins');
  }

  // Database schema methods
  async getSchemaInfo() {
    try {
      const response = await apiClient.get('/database-schema');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error };
    }
  }

  async executeQuery(query: string) {
    try {
      const response = await apiClient.post('/execute-sql', { query });
      return response;
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  // Health check
  async getHealth() {
    return apiClient.get('/health');
  }

  // Migration status
  async getMigrationStatus() {
    return apiClient.get('/migrate/status');
  }

  // Compatibility method for legacy Supabase code
  from(tableName: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => apiClient.get(`/${tableName}?${column}=${value}`),
        data: () => apiClient.getAll(tableName),
      }),
    };
  }

  // File service methods
  async getByEntity(entityType: string, entityId: string) {
    return apiClient.get(`/files?entity_type=${entityType}&entity_id=${entityId}`);
  }

  // Setup method (no-op for API-based implementation)
  async setupSchemaFunction() {
    return Promise.resolve();
  }
}

// Create and export the database service instance
export const databaseService = new DatabaseService();

// Export individual services for compatibility
export const employeeService = databaseService;
export const studentService = databaseService;
export const facilityService = databaseService;
export const classService = databaseService;
export const teachingSessionService = databaseService;
export const enrollmentService = databaseService;
export const attendanceService = databaseService;
export const assetService = databaseService;
export const taskService = databaseService;
export const contactService = databaseService;
export const eventService = databaseService;
export const financeService = databaseService;
export const fileService = databaseService;
export const imageService = databaseService;
export const requestService = databaseService;
export const evaluationService = databaseService;
export const payrollService = databaseService;
export const employeeClockInService = databaseService;
export const admissionService = databaseService;
export const sessionService = databaseService;
export const assetTransferService = databaseService;
export const enumService = databaseService;
export const settingService = databaseService;

// Export individual functions for compatibility
export const getSchemaInfo = () => databaseService.getSchemaInfo();
export const setupSchemaFunction = () => databaseService.setupSchemaFunction();

// Default export
export default databaseService;
