// Re-export the refactored storage modules
export { storage, DatabaseStorage } from "./storage/index";

// Keep the original interface for backward compatibility
import type { 
  User, InsertUser, Student, InsertStudent, 
  Employee, InsertEmployee, Facility, InsertFacility,
  Class, InsertClass, TeachingSession, InsertTeachingSession,
  Enrollment, InsertEnrollment, Attendance, InsertAttendance,
  Asset, InsertAsset
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
