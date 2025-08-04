// PostgreSQL API-based database service
// This replaces all Supabase client calls with direct API calls to our PostgreSQL backend

class DatabaseService {
  private baseUrl = '/api';

  constructor() {
    console.log('Using PostgreSQL API database service');
  }

  // Generic API methods
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Employee methods
  async getEmployees() {
    return this.apiCall('/employees');
  }

  async getEmployee(id: string) {
    return this.apiCall(`/employees/${id}`);
  }

  async createEmployee(employee: any) {
    return this.apiCall('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: string, employee: any) {
    return this.apiCall(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: string) {
    return this.apiCall(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Student methods
  async getStudents() {
    return this.apiCall('/students');
  }

  // Generic getAll method for compatibility with existing code
  async getAll() {
    return this.getStudents();
  }

  async getStudent(id: string) {
    return this.apiCall(`/students/${id}`);
  }

  // Alias methods for compatibility
  async getById(id: string) {
    return this.getStudent(id);
  }

  async create(data: any) {
    return this.createStudent(data);
  }

  async update(id: string, data: any) {
    return this.updateStudent(id, data);
  }

  async createStudent(student: any) {
    return this.apiCall('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: string, student: any) {
    return this.apiCall(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(id: string) {
    return this.apiCall(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Facility methods
  async getFacilities() {
    return this.apiCall('/facilities');
  }

  async getFacility(id: string) {
    return this.apiCall(`/facilities/${id}`);
  }

  async createFacility(facility: any) {
    return this.apiCall('/facilities', {
      method: 'POST',
      body: JSON.stringify(facility),
    });
  }

  async updateFacility(id: string, facility: any) {
    return this.apiCall(`/facilities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(facility),
    });
  }

  async deleteFacility(id: string) {
    return this.apiCall(`/facilities/${id}`, {
      method: 'DELETE',
    });
  }

  // Class methods
  async getClasses() {
    return this.apiCall('/classes');
  }

  async getClass(id: string) {
    return this.apiCall(`/classes/${id}`);
  }

  async createClass(classData: any) {
    return this.apiCall('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(id: string, classData: any) {
    return this.apiCall(`/classes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(id: string) {
    return this.apiCall(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Teaching Session methods
  async getTeachingSessions() {
    return this.apiCall('/teaching-sessions');
  }

  async getTeachingSession(id: string) {
    return this.apiCall(`/teaching-sessions/${id}`);
  }

  async getTeachingSessionsByClass(classId: string) {
    return this.apiCall(`/teaching-sessions?lop_id=${classId}`);
  }

  async createTeachingSession(session: any) {
    return this.apiCall('/teaching-sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async updateTeachingSession(id: string, session: any) {
    return this.apiCall(`/teaching-sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(session),
    });
  }

  async deleteTeachingSession(id: string) {
    return this.apiCall(`/teaching-sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Enrollment methods
  async getEnrollments() {
    return this.apiCall('/enrollments');
  }

  async getEnrollment(id: string) {
    return this.apiCall(`/enrollments/${id}`);
  }

  async getEnrollmentsByClass(classId: string) {
    return this.apiCall(`/enrollments?lop_id=${classId}`);
  }

  async createEnrollment(enrollment: any) {
    return this.apiCall('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollment),
    });
  }

  async updateEnrollment(id: string, enrollment: any) {
    return this.apiCall(`/enrollments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(enrollment),
    });
  }

  async deleteEnrollment(id: string) {
    return this.apiCall(`/enrollments/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance methods
  async getAttendances() {
    return this.apiCall('/attendances');
  }

  async getAttendance(id: string) {
    return this.apiCall(`/attendances/${id}`);
  }

  async createAttendance(attendance: any) {
    return this.apiCall('/attendances', {
      method: 'POST',
      body: JSON.stringify(attendance),
    });
  }

  async updateAttendance(id: string, attendance: any) {
    return this.apiCall(`/attendances/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(attendance),
    });
  }

  async deleteAttendance(id: string) {
    return this.apiCall(`/attendances/${id}`, {
      method: 'DELETE',
    });
  }

  // Asset methods
  async getAssets() {
    return this.apiCall('/assets');
  }

  async getAsset(id: string) {
    return this.apiCall(`/assets/${id}`);
  }

  async createAsset(asset: any) {
    return this.apiCall('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async updateAsset(id: string, asset: any) {
    return this.apiCall(`/assets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(asset),
    });
  }

  async deleteAsset(id: string) {
    return this.apiCall(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  // Task methods
  async getTasks() {
    return this.apiCall('/tasks');
  }

  async getTask(id: string) {
    return this.apiCall(`/tasks/${id}`);
  }

  async createTask(task: any) {
    return this.apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: any) {
    return this.apiCall(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string) {
    return this.apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic table operations
  async getTableData(tableName: string) {
    return this.apiCall(`/${tableName}`);
  }

  async createRecord(tableName: string, record: any) {
    return this.apiCall(`/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateRecord(tableName: string, id: string, record: any) {
    return this.apiCall(`/${tableName}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(record),
    });
  }

  async deleteRecord(tableName: string, id: string) {
    return this.apiCall(`/${tableName}/${id}`, {
      method: 'DELETE',
    });
  }

  // Schema operations for DatabaseSchema page
  async getSchemaInfo() {
    try {
      const response = await this.apiCall('/schema');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error };
    }
  }

  async setupSchemaFunction() {
    // This is a no-op for API-based implementation
    // Schema functions are handled on the server side
    return Promise.resolve();
  }

  // Compatibility method for legacy Supabase code
  from(tableName: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => this.apiCall(`/${tableName}?${column}=${value}`),
        data: () => this.apiCall(`/${tableName}`),
      }),
    };
  }

  // File service methods
  async getByEntity(entityType: string, entityId: string) {
    return this.apiCall(`/files?entity_type=${entityType}&entity_id=${entityId}`);
  }

  // Generic delete method (alias for deleteRecord)
  async delete(id: string) {
    return this.deleteRecord('files', id);
  }
}

// Create and export the database service instance
export const databaseService = new DatabaseService();

// Create specialized service objects with specific methods
class TeachingSessionService extends DatabaseService {
  async getByClass(classId: string) {
    return this.getTeachingSessionsByClass(classId);
  }
}

class EnrollmentService extends DatabaseService {
  async getByClass(classId: string) {
    return this.getEnrollmentsByClass(classId);
  }
}

// Export individual services for compatibility
export const employeeService = databaseService;
export const studentService = databaseService;
export const facilityService = databaseService;
export const classService = databaseService;
export const teachingSessionService = new TeachingSessionService();
export const enrollmentService = new EnrollmentService();
export const attendanceService = databaseService;
export const assetService = databaseService;
export const taskService = databaseService;

// Additional services
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
