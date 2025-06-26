import { eq } from "drizzle-orm";
import { db } from "./db";
import type { 
  User, InsertUser, Student, InsertStudent, 
  Employee, InsertEmployee, Facility, InsertFacility,
  Class, InsertClass, TeachingSession, InsertTeachingSession,
  Enrollment, InsertEnrollment, Attendance, InsertAttendance,
  Asset, InsertAsset
} from "@shared/schema";
import { 
  students, employees, facilities, 
  classes, teachingSessions, enrollments, 
  attendances, assets, tasks
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
    const studentWithId = { 
      ...student, 
      id
    };
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
    const employeeWithId = { 
      ...employee, 
      id
    };
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
    const facilityWithId = { 
      ...facility, 
      id
    };
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
    console.log('Fetching classes from database...');
    const result = await db.select().from(classes);
    console.log('Classes found in database:', result.length);
    return result;
  }

  async getClass(id: string): Promise<Class | undefined> {
    const result = await db.select().from(classes).where(eq(classes.id, id));
    return result[0];
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = crypto.randomUUID();
    const classWithId = { 
      ...classData, 
      id
    };
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
    const sessionWithId = { 
      ...session, 
      id
    };
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
    const enrollmentWithId = { 
      ...enrollment, 
      id
    };
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
    const attendanceWithId = { 
      ...attendance, 
      id
    };
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
    const assetWithId = { 
      ...asset, 
      id
    };
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
    console.log('Fetching tasks from database...');
    const result = await db.select().from(tasks);
    console.log('Tasks found in database:', result.length);
    return result;
  }

  async getTask(id: string): Promise<any | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(task: any): Promise<any> {
    const id = crypto.randomUUID();
    const taskWithId = {
      ...task,
      id
    };
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

  // Files methods
  async getFiles(): Promise<any[]> {
    try {
      console.log('Fetching all files...');
      //const result = await this.pool.query('SELECT * FROM files ORDER BY created_at DESC');
      const result = await db.select().from(assets);
      console.log(`Successfully fetched ${result.length} files`);
      return result;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async getFile(id: string): Promise<any | null> {
    try {
      //const result = await this.pool.query('SELECT * FROM files WHERE id = $1', [id]);
      const result = await db.select().from(assets).where(eq(assets.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async createFile(fileData: any): Promise<any> {
    try {
      //const fields = Object.keys(fileData).join(', ');
      //const values = Object.values(fileData);
      //const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

      //const query = `INSERT INTO files (${fields}) VALUES (${placeholders}) RETURNING *`;
      //const result = await this.pool.query(query, values);
      const id = crypto.randomUUID();
      const assetWithId = {
        ...fileData,
        id
      };
      const result = await db.insert(assets).values(assetWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async updateFile(id: string, updates: any): Promise<any | null> {
    try {
      //const updateFields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      //const values = [id, ...Object.values(updates)];

      //const query = `UPDATE files SET ${updateFields}, updated_at = NOW() WHERE id = $1 RETURNING *`;
      //const result = await this.pool.query(query, values);
       const result = await db.update(assets).set(updates).where(eq(assets.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    try {
      //const result = await this.pool.query('DELETE FROM files WHERE id = $1', [id]);
      const result = await db.delete(assets).where(eq(assets.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Contacts methods
  async getContacts(): Promise<any[]> {
    try {
      console.log('Fetching all contacts...');
      //const result = await this.pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
      const result = await db.select().from(employees);
      console.log(`Successfully fetched ${result.length} contacts`);
      return result;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getContact(id: string): Promise<any | null> {
    try {
      //const result = await this.pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
      const result = await db.select().from(employees).where(eq(employees.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async createContact(contactData: any): Promise<any> {
    try {
      //const fields = Object.keys(contactData).join(', ');
      //const values = Object.values(contactData);
      //const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

      //const query = `INSERT INTO contacts (${fields}) VALUES (${placeholders}) RETURNING *`;
      //const result = await this.pool.query(query, values);
      const id = crypto.randomUUID();
      const employeeWithId = {
        ...contactData,
        id
      };
      const result = await db.insert(employees).values(employeeWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(id: string, updates: any): Promise<any | null> {
    try {
      //const updateFields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      //const values = [id, ...Object.values(updates)];

      //const query = `UPDATE contacts SET ${updateFields} WHERE id = $1 RETURNING *`;
      //const result = await this.pool.query(query, values);
       const result = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      //const result = await this.pool.query('DELETE FROM contacts WHERE id = $1', [id]);
      const result = await db.delete(employees).where(eq(employees.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Requests methods
  async getRequests(): Promise<any[]> {
    try {
      console.log('Fetching all requests...');
      //const result = await this.pool.query('SELECT * FROM requests ORDER BY created_at DESC');
      const result = await db.select().from(tasks);
      console.log(`Successfully fetched ${result.length} requests`);
      return result;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  async getRequest(id: string): Promise<any | null> {
    try {
      //const result = await this.pool.query('SELECT * FROM requests WHERE id = $1', [id]);
      const result = await db.select().from(tasks).where(eq(tasks.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  }

  async createRequest(requestData: any): Promise<any> {
    try {
      //const fields = Object.keys(requestData).join(', ');
      //const values = Object.values(requestData);
      //const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

      //const query = `INSERT INTO requests (${fields}) VALUES (${placeholders}) RETURNING *`;
      //const result = await this.pool.query(query, values);
      const id = crypto.randomUUID();
      const taskWithId = {
        ...requestData,
        id
      };
      const result = await db.insert(tasks).values(taskWithId).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async updateRequest(id: string, updates: any): Promise<any | null> {
    try {
      //const updateFields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      //const values = [id, ...Object.values(updates)];

      //const query = `UPDATE requests SET ${updateFields} WHERE id = $1 RETURNING *`;
      //const result = await this.pool.query(query, values);
      const result = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async deleteRequest(id: string): Promise<boolean> {
    try {
      //const result = await this.pool.query('DELETE FROM requests WHERE id = $1', [id]);
      const result = await db.delete(tasks).where(eq(tasks.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  }

  // Employee Clock-in CRUD operations
  async getEmployeeClockIn(): Promise<any[]> {
    console.log('Fetching all employee clock-in records...');
    try {
      // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return [];
    } catch (error) {
      console.error('Error fetching employee clock-in records:', error);
      throw error;
    }
  }

  async getEmployeeClockInById(id: string) {
    try {
       // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return undefined;
    } catch (error) {
      console.error('Error fetching employee clock-in record:', error);
      throw error;
    }
  }

  async getEmployeeClockInByMonth(month: number, year: number) {
    try {
      // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return [];
    } catch (error) {
      console.error('Error fetching employee clock-in records by month:', error);
      throw error;
    }
  }

  async createEmployeeClockIn(data: any) {
    try {
      // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return undefined;
    } catch (error) {
      console.error('Error creating employee clock-in record:', error);
      throw error;
    }
  }

  async updateEmployeeClockIn(id: string, data: any) {
    try {
       // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return undefined;
    } catch (error) {
      console.error('Error updating employee clock-in record:', error);
      throw error;
    }
  }

  async deleteEmployeeClockIn(id: string) {
    try {
       // Placeholder for database query using Drizzle ORM.
      // Replace with actual Drizzle query when schema is available.
      return false;
    } catch (error) {
      console.error('Error deleting employee clock-in record:', error);
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