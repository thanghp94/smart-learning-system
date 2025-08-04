import type { Express } from "express";
import { createCrudRoutes } from "./crud";
import { 
  insertStudentSchema, 
  insertClassSchema, 
  insertTeachingSessionSchema,
  insertEnrollmentSchema,
  insertAttendanceSchema
} from "@shared/schema";

export const registerEducationRoutes = (app: Express) => {
  // Students routes
  createCrudRoutes(app, 'students', 'Student', 'Student', insertStudentSchema);
  
  // Classes routes
  createCrudRoutes(app, 'classes', 'Class', 'Classe', insertClassSchema);
  
  // Teaching sessions routes
  createCrudRoutes(app, 'teaching-sessions', 'Teaching Session', 'TeachingSession', insertTeachingSessionSchema);
  
  // Enrollments routes
  createCrudRoutes(app, 'enrollments', 'Enrollment', 'Enrollment', insertEnrollmentSchema);
  
  // Attendances routes
  createCrudRoutes(app, 'attendances', 'Attendance', 'Attendance', insertAttendanceSchema);
};
