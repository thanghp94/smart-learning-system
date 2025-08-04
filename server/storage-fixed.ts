import { eq, and } from "drizzle-orm";
import { db } from "./db";
import type { 
  User, InsertUser, Student, InsertStudent, 
  Employee, InsertEmployee, Facility, InsertFacility,
  Class, InsertClass, TeachingSession, InsertTeachingSession,
  Enrollment, InsertEnrollment, Attendance, InsertAttendance,
  Asset, InsertAsset
} from "@shared/schema";
import { 
  users, students, employees, facilities, 
  classes, teachingSessions, enrollments, 
  attendances, assets, tasks, files, contacts, requests,
  evaluations, payroll, admissions, images
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Student operations
  getStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;

  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;

  // Facility operations
  getFacilities(): Promise<Facility[]>;
  getFacility(id: string): Promise<Facility | undefined>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: string, facility: Partial<InsertFacility>): Promise<Facility | undefined>;
  deleteFacility(id: string): Promise<boolean>;

  // Class operations
  getClasses(): Promise<Class[]>;
  getClass(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;

  // Teaching Session operations
  getTeachingSessions(): Promise<TeachingSession[]>;
  getTeachingSession(id: string): Promise<TeachingSession | undefined>;
  createTeachingSession(session: InsertTeachingSession): Promise<TeachingSession>;
  updateTeachingSession(id: string, session: Partial<InsertTeachingSession>): Promise<TeachingSession | undefined>;
  deleteTeachingSession(id: string): Promise<boolean>;

  // Enrollment operations
  getEnrollments(): Promise<Enrollment[]>;
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: string): Promise<boolean>;

  // Attendance operations
  getAttendances(): Promise<Attendance[]>;
  getAttendance(id: string): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: string): Promise<boolean>;

  // Asset operations
  getAssets(): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;

  // Task operations
  getTasks(): Promise<any[]>;
  getTask(id: string): Promise<any | undefined>;
  createTask(task: any): Promise<any>;
  updateTask(id: string, task: any): Promise<any | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Files methods
  getFiles(): Promise<any[]>;
  getFile(id: string): Promise<any | null>;
  createFile(fileData: any): Promise<any>;
  updateFile(id: string, updates: any): Promise<any | null>;
  deleteFile(id: string): Promise<boolean>;

  // Contacts methods
  getContacts(): Promise<any[]>;
  getContact(id: string): Promise<any | null>;
  createContact(contactData: any): Promise<any>;
  updateContact(id: string, updates: any): Promise<any | null>;
  deleteContact(id: string): Promise<boolean>;

  // Requests methods
  getRequests(): Promise<any[]>;
  getRequest(id: string): Promise<any | null>;
  createRequest(requestData: any): Promise<any>;
  updateRequest(id: string, updates: any): Promise<any | null>;
  deleteRequest(id: string): Promise<boolean>;

  // Employee Clock-in CRUD operations
  getEmployeeClockIn(): Promise<any[]>;
  getEmployeeClockInById(id: string): Promise<any | undefined>;
  getEmployeeClockInByMonth(month: number, year: number): Promise<any[]>;
  createEmployeeClockIn(data: any): Promise<any>;
  updateEmployeeClockIn(id: string, data: any): Promise<any | undefined>;
  deleteEmployeeClockIn(id: string): Promise<boolean>;

  // Evaluations CRUD operations
  getEvaluations(): Promise<any[]>;
  getEvaluation(id: string): Promise<any | undefined>;
  createEvaluation(data: any): Promise<any>;
  updateEvaluation(id: string, data: any): Promise<any | undefined>;
  deleteEvaluation(id: string): Promise<boolean>;

  // Payroll CRUD operations
  getPayroll(): Promise<any[]>;
  getPayrollById(id: string): Promise<any | undefined>;
  getPayrollByMonth(month: number, year: number): Promise<any[]>;
  createPayroll(data: any): Promise<any>;
  updatePayroll(id: string, data: any): Promise<any | undefined>;
  deletePayroll(id: string): Promise<boolean>;

  // Admissions CRUD operations
  getAdmissions(): Promise<any[]>;
  getAdmission(id: string): Promise<any | undefined>;
  createAdmission(data: any): Promise<any>;
  updateAdmission(id: string, data: any): Promise<any | undefined>;
  deleteAdmission(id: string): Promise<boolean>;

  // Images CRUD operations
  getImages(): Promise<any[]>;
  getImage(id: string): Promise<any | undefined>;
  createImage(data: any): Promise<any>;
  updateImage(id: string, data: any): Promise<any | undefined>;
  deleteImage(id: string): Promise<boolean>;

  // Generic query execution
  executeQuery(query: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Student operations
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id));
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = crypto.randomUUID();
    const studentWithId = { ...student, id };
    const result = await db.insert(students).values(studentWithId).returning();
    return result[0];
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await db.update(students).set(student).where(eq(students.id, id)).returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = crypto.randomUUID();
    const employeeWithId = { ...employee, id };
    const result = await db.insert(employees).values(employeeWithId).returning();
    return result[0];
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const result = await db.update(employees).set(employee).where(eq(employees.id, id)).returning();
    return result[0];
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Facility operations
  async getFacilities(): Promise<Facility[]> {
    return await db.select().from(facilities);
  }

  async getFacility(id: string): Promise<Facility | undefined> {
    const result = await db.select().from(facilities).where(eq(facilities.id, id));
    return result[0];
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const id = crypto.randomUUID();
    const facilityWithId = { ...facility, id };
    const result = await db.insert(facilities).values(facilityWithId).returning();
    return result[0];
  }

  async updateFacility(id: string, facility: Partial<InsertFacility>): Promise<Facility | undefined> {
    const result = await db.update(facilities).set(facility).where(eq(facilities.id, id)).returning();
    return result[0];
  }

  async deleteFacility(id: string): Promise<boolean> {
    const result = await db.delete(facilities).where(eq(facilities.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Class operations
  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes);
  }

  async getClass(id: string): Promise<Class | undefined> {
    const result = await db.select().from(classes).where(eq(classes.id, id));
    return result[0];
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = crypto.randomUUID();
    const classWithId = { ...classData, id };
    const result = await db.insert(classes).values(classWithId).returning();
    return result[0];
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const result = await db.update(classes).set(classData).where(eq(classes.id, id)).returning();
    return result[0];
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Teaching Session operations
  async getTeachingSessions(): Promise<TeachingSession[]> {
    return await db.select().from(teachingSessions);
  }

  async getTeachingSession(id: string): Promise<TeachingSession | undefined> {
    const result = await db.select().from(teachingSessions).where(eq(teachingSessions.id, id));
    return result[0];
  }

  async createTeachingSession(session: InsertTeachingSession): Promise<TeachingSession> {
    const id = crypto.randomUUID();
    const sessionWithId = { ...session, id };
    const result = await db.insert(teachingSessions).values(sessionWithId).returning();
    return result[0];
  }

  async updateTeachingSession(id: string, session: Partial<InsertTeachingSession>): Promise<TeachingSession | undefined> {
    const result = await db.update(teachingSessions).set(session).where(eq(teachingSessions.id, id)).returning();
    return result[0];
  }

  async deleteTeachingSession(id: string): Promise<boolean> {
    const result = await db.delete(teachingSessions).where(eq(teachingSessions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Enrollment operations
  async getEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments);
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const result = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return result[0];
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const id = crypto.randomUUID();
    const enrollmentWithId = { ...enrollment, id };
    const result = await db.insert(enrollments).values(enrollmentWithId).returning();
    return result[0];
  }

  async updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const result = await db.update(enrollments).set(enrollment).where(eq(enrollments.id, id)).returning();
    return result[0];
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const result = await db.delete(enrollments).where(eq(enrollments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Attendance operations
  async getAttendances(): Promise<Attendance[]> {
    return await db.select().from(attendances);
  }

  async getAttendance(id: string): Promise<Attendance | undefined> {
    const result = await db.select().from(attendances).where(eq(attendances.id, id));
    return result[0];
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const id = crypto.randomUUID();
    const attendanceWithId = { ...attendance, id };
    const result = await db.insert(attendances).values(attendanceWithId).returning();
    return result[0];
  }

  async updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const result = await db.update(attendances).set(attendance).where(eq(attendances.id, id)).returning();
    return result[0];
  }

  async deleteAttendance(id: string): Promise<boolean> {
    const result = await db.delete(attendances).where(eq(attendances.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Asset operations
  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets);
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id));
    return result[0];
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = crypto.randomUUID();
    const assetWithId = { ...asset, id };
    const result = await db.insert(assets).values(assetWithId).returning();
    return result[0];
  }

  async updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const result = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return result[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Task operations
  async getTasks(): Promise<any[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: string): Promise<any | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(task: any): Promise<any> {
    const id = crypto.randomUUID();
    const taskWithId = { ...task, id };
    const result = await db.insert(tasks).values(taskWithId).returning();
    return result[0];
  }

  async updateTask(id: string, task: any): Promise<any | undefined> {
    const result = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Files methods - Fixed to use actual files table
  async getFiles(): Promise<any[]> {
    try {
      const result = await db.select().from(files);
      return result;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async getFile(id: string): Promise<any | null> {
    try {
      const result = await db.select().from(files).where(eq(files.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async createFile(fileData: any): Promise<any> {
    try {
      const id = crypto.randomUUID();
      const fileWithId = { ...fileData, id };
      const result = await db.insert(files).values(fileWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async updateFile(id: string, updates: any): Promise<any | null> {
    try {
      const result = await db.update(files).set(updates).where(eq(files.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    try {
      const result = await db.delete(files).where(eq(files.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Contacts methods - Fixed to use actual contacts table
  async getContacts(): Promise<any[]> {
    try {
      const result = await db.select().from(contacts);
      return result;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getContact(id: string): Promise<any | null> {
    try {
      const result = await db.select().from(contacts).where(eq(contacts.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async createContact(contactData: any): Promise<any> {
    try {
      const id = crypto.randomUUID();
      const contactWithId = { ...contactData, id };
      const result = await db.insert(contacts).values(contactWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(id: string, updates: any): Promise<any | null> {
    try {
      const result = await db.update(contacts).set(updates).where(eq(contacts.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      const result = await db.delete(contacts).where(eq(contacts.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Requests methods - Fixed to use actual requests table
  async getRequests(): Promise<any[]> {
    try {
      const result = await db.select().from(requests);
      return result;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  async getRequest(id: string): Promise<any | null> {
    try {
      const result = await db.select().from(requests).where(eq(requests.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  }

  async createRequest(requestData: any): Promise<any> {
    try {
      const id = crypto.randomUUID();
      const requestWithId = { ...requestData, id };
      const result = await db.insert(requests).values(requestWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async updateRequest(id: string, updates: any): Promise<any | null> {
    try {
      const result = await db.update(requests).set(updates).where(eq(requests.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async deleteRequest(id: string): Promise<boolean> {
    try {
      const result = await db.delete(requests).where(eq(requests.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  }

  // Employee Clock-in CRUD operations - Implemented with actual database queries
  async getEmployeeClockIn(): Promise<any[]> {
    try {
      const result = await db.execute('SELECT * FROM employee_clock_ins ORDER BY created_at DESC');
      const records = Array.isArray(result) ? result : (result?.rows || []);
      return records;
    } catch (error) {
      console.error('Error fetching employee clock-in records:', error);
      throw error;
    }
  }

  async getEmployeeClockInById(id: string): Promise<any | undefined> {
    try {
      const result = await db.execute(`SELECT * FROM employee_clock_ins WHERE id = '${id}'`);
      const records = Array.isArray(result) ? result : (result?.rows || []);
      return records[0];
    } catch (error) {
      console.error('Error fetching employee clock-in record:', error);
      throw error;
    }
  }

  async getEmployeeClockInByMonth(month: number, year: number): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM employee_clock_ins 
         WHERE EXTRACT(MONTH FROM work_date) = ${month} 
         AND EXTRACT(YEAR FROM work_date) = ${year}
         ORDER BY work_date DESC`
      );
      const records = Array.isArray(result) ? result : (result?.rows || []);
      return records;
    } catch (error) {
      console.error('Error fetching employee clock-in records by month:', error);
      throw error;
    }
  }

  async createEmployeeClockIn(data: any): Promise<any> {
    try {
      const id = crypto.randomUUID();
      const result = await db.execute(
        `INSERT INTO employee_clock_ins (id, employee_id, clock_in_time, work_date, location_lat, location_lng, facility_id, location_verified, notes) 
         VALUES ('${id}', '${data.employee_id}', '${data.clock_in_time}', '${data.work_date}', ${data.location_lat || 'NULL'}, ${data.location_lng || 'NULL'}, '${data.facility_id || ''}', ${data.location_verified || false}, '${data.notes || ''}') 
         RETURNING *`
      );
      const records = Array.isArray(result) ? result : (result?.rows || []);
      return records[0];
    } catch (error) {
      console.error('Error creating employee clock-in record:', error);
      throw error;
    }
  }

  async updateEmployeeClockIn(id: string, data: any): Promise<any | undefined> {
    try {
      const updateFields = Object.entries(data)
        .map(([key, value]) => `${key} = ${value === null || value === undefined ? 'NULL' : `'${value}'`}`)
        .join(', ');
      
      const result = await db.execute(
        `UPDATE employee_clock_ins SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = '${id}' RETURNING *`
      );
      const records = Array.isArray(result) ? result : (result?.rows || []);
      return records[0];
    } catch (error) {
      console.error('Error updating employee clock-in record:', error);
      throw error;
    }
  }

  async deleteEmployeeClockIn(id: string): Promise<boolean> {
    try {
      const result = await db.execute(`DELETE FROM employee_clock_ins WHERE id = '${id}'`);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting employee clock-in record:', error);
      throw error;
    }
  }

  // Evaluations CRUD operations
  async getEvaluations(): Promise<any[]> {
    try {
      const result = await db.select().from(evaluations);
      return result;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      throw error;
    }
  }

  async getEvaluation(id: string): Promise<any | undefined> {
    try {
      const result = await db.select().from(evaluations).where(eq(evaluations.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      throw error;
    }
  }

  async createEvaluation(data: any): Promise<any> {
    try {
      const result = await db.insert(evaluations).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating evaluation:', error);
      throw error;
    }
  }

  async updateEvaluation(id: string, data: any): Promise<any | undefined> {
    try {
      const result = await db.update(evaluations).set(data).where(eq(evaluations.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating evaluation:', error);
      throw error;
    }
  }

  async deleteEvaluation(id: string): Promise<boolean> {
    try {
      const result = await db.delete(evaluations).where(eq(evaluations.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      throw error;
    }
  }

  // Payroll CRUD operations
  async getPayroll(): Promise<any[]> {
    try {
      const result = await db.select().from(payroll);
      return result;
    } catch (error) {
      console.error('Error fetching payroll:', error);
      throw error;
    }
  }

  async getPayrollById(id: string): Promise<any | undefined> {
    try {
      const result = await db.select().from(payroll).where(eq(payroll.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching payroll record:', error);
      throw error;
    }
  }

  async getPayrollByMonth(month: number, year: number): Promise<any[]> {
    try {
      const result = await db.select().from(payroll)
        .where(and(eq(payroll.month, month), eq(payroll.year, year)));
      return result;
    } catch (error) {
      console.error('Error fetching payroll records by month:', error);
      throw error;
    }
  }

  async createPayroll(data: any): Promise<any> {
    try {
      const result = await db.insert(payroll).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating payroll record:', error);
      throw error;
    }
  }

  async updatePayroll(id: string, data: any): Promise<any | undefined> {
    try {
      const result = await db.update(payroll).set(data).where(eq(payroll.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating payroll record:', error);
      throw error;
    }
  }

  async deletePayroll(id: string): Promise<boolean> {
    try {
      const result = await db.delete(payroll).where(eq(payroll.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting payroll record:', error);
      throw error;
    }
  }

  // Admissions CRUD operations
  async getAdmissions(): Promise<any[]> {
    try {
      const result = await db.select().from(admissions);
      return result;
    } catch (error) {
      console.error('Error fetching admissions:', error);
      throw error;
    }
  }

  async getAdmission(id: string): Promise<any | undefined> {
    try {
      const result = await db.select().from(admissions).where(eq(admissions.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching admission:', error);
      throw error;
    }
  }

  async createAdmission(data: any): Promise<any> {
    try {
      const result = await db.insert(admissions).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating admission:', error);
      throw error;
    }
  }

  async updateAdmission(id: string, data: any): Promise<any | undefined> {
    try {
      const result = await db.update(admissions).set(data).where(eq(admissions.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating admission:', error);
      throw error;
    }
  }

  async deleteAdmission(id: string): Promise<boolean> {
    try {
      const result = await db.delete(admissions).where(eq(admissions.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting admission:', error);
      throw error;
    }
  }

  // Images CRUD operations
  async getImages(): Promise<any[]> {
    try {
      const result = await db.select().from(images);
      return result;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }

  async getImage(id: string): Promise<any | undefined> {
    try {
      const result = await db.select().from(images).where(eq(images.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  async createImage(data: any): Promise<any> {
    try {
      const result = await db.insert(images).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  }

  async updateImage(id: string, data: any): Promise<any | undefined> {
    try {
      const result = await db.update(images).set(data).where(eq(images.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  }

  async deleteImage(id: string): Promise<boolean> {
    try {
      const result = await db.delete(images).where(eq(images.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Generic method for other tables that don't have specific schemas yet
  async executeQuery(query: string): Promise<any> {
    return await db.execute(query);
  }

  async getTableExists(tableName: string): Promise<boolean> {
    try {
      const result = await db.execute(`SELECT to_regclass('${tableName}') as exists`);
      return result.rows[0]?.exists !== null;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
