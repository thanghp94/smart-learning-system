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
  users, students, employees, facilities, 
  classes, teachingSessions, enrollments, 
  attendances, assets 
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
    return await db.select().from(classes);
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
