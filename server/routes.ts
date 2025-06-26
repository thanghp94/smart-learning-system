import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { 
  insertStudentSchema, insertEmployeeSchema, insertFacilitySchema,
  insertClassSchema, insertTeachingSessionSchema, insertEnrollmentSchema,
  insertAttendanceSchema, insertAssetSchema, insertTaskSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.updateStudent(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  app.patch("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // Facility routes
  app.get("/api/facilities", async (req, res) => {
    try {
      const facilities = await storage.getFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.getFacility(req.params.id);
      if (!facility) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch facility" });
    }
  });

  app.post("/api/facilities", async (req, res) => {
    try {
      const validatedData = insertFacilitySchema.parse(req.body);
      const facility = await storage.createFacility(validatedData);
      res.json(facility);
    } catch (error) {
      res.status(400).json({ error: "Invalid facility data" });
    }
  });

  app.patch("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.updateFacility(req.params.id, req.body);
      if (!facility) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to update facility" });
    }
  });

  app.delete("/api/facilities/:id", async (req, res) => {
    try {
      const success = await storage.deleteFacility(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Facility not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete facility" });
    }
  });

  // Class routes
  app.get("/api/classes", async (req, res) => {
    try {
      console.log('Classes API endpoint called');
      const classes = await storage.getClasses();
      console.log('Classes fetched from storage:', classes.length);
      res.json(classes);
    } catch (error) {
      console.error('Error in classes endpoint:', error);
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.getClass(req.params.id);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch class" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const classData = await storage.createClass(validatedData);
      res.json(classData);
    } catch (error) {
      res.status(400).json({ error: "Invalid class data" });
    }
  });

  app.patch("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.updateClass(req.params.id, req.body);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ error: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", async (req, res) => {
    try {
      const success = await storage.deleteClass(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class" });
    }
  });

  // Teaching Session routes
  app.get("/api/teaching-sessions", async (req, res) => {
    try {
      const sessions = await storage.getTeachingSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teaching sessions" });
    }
  });

  app.get("/api/teaching-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getTeachingSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Teaching session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teaching session" });
    }
  });

  app.post("/api/teaching-sessions", async (req, res) => {
    try {
      const validatedData = insertTeachingSessionSchema.parse(req.body);
      const session = await storage.createTeachingSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid teaching session data" });
    }
  });

  app.patch("/api/teaching-sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateTeachingSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Teaching session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update teaching session" });
    }
  });

  app.delete("/api/teaching-sessions/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeachingSession(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Teaching session not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teaching session" });
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.getEnrollment(req.params.id);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollment" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const validatedData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(validatedData);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ error: "Invalid enrollment data" });
    }
  });

  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.updateEnrollment(req.params.id, req.body);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update enrollment" });
    }
  });

  app.delete("/api/enrollments/:id", async (req, res) => {
    try {
      const success = await storage.deleteEnrollment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete enrollment" });
    }
  });

  // Attendance routes
  app.get("/api/attendances", async (req, res) => {
    try {
      const attendances = await storage.getAttendances();
      res.json(attendances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendances" });
    }
  });

  app.get("/api/attendances/:id", async (req, res) => {
    try {
      const attendance = await storage.getAttendance(req.params.id);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendances", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(validatedData);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ error: "Invalid attendance data" });
    }
  });

  app.patch("/api/attendances/:id", async (req, res) => {
    try {
      const attendance = await storage.updateAttendance(req.params.id, req.body);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update attendance" });
    }
  });

  app.delete("/api/attendances/:id", async (req, res) => {
    try {
      const success = await storage.deleteAttendance(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Attendance not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete attendance" });
    }
  });

  // Monthly attendance route
  app.get("/api/attendances/monthly/:month/:year", async (req, res) => {
    try {
      const month = parseInt(req.params.month);
      const year = parseInt(req.params.year);

      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid month or year" });
      }

      const attendances = await storage.getAttendances();
      // Filter by month and year if needed
      const filteredAttendances = attendances.filter(attendance => {
        if (attendance.created_at) {
          const attendanceDate = new Date(attendance.created_at);
          return attendanceDate.getMonth() + 1 === month && attendanceDate.getFullYear() === year;
        }
        return false;
      });

      res.json(filteredAttendances);
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
      res.status(500).json({ error: "Failed to fetch monthly attendance" });
    }
  });

  // Asset routes
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.json(asset);
    } catch (error) {
      res.status(400).json({ error: "Invalid asset data" });
    }
  });

  app.patch("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.updateAsset(req.params.id, req.body);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const success = await storage.deleteAsset(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      // Return empty array for now - events table exists but no CRUD methods in storage yet
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Finances routes
  app.get("/api/finances", async (req, res) => {
    try {
      const result = await storage.executeQuery('SELECT * FROM finances ORDER BY created_at DESC');
      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching finances:', error);
      res.status(500).json({ error: "Failed to fetch finances" });
    }
  });

  app.get("/api/finances/:id", async (req, res) => {
    try {
      const result = await storage.executeQuery(`SELECT * FROM finances WHERE id = '${req.params.id}'`);
      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ error: "Finance record not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch finance record" });
    }
  });

  app.post("/api/finances", async (req, res) => {
    try {
      const { loai_thu_chi, tong_tien, dien_giai, nguoi_tao, co_so, doi_tuong_id, loai_doi_tuong } = req.body;
      const result = await storage.executeQuery(
        `INSERT INTO finances (loai_thu_chi, tong_tien, dien_giai, nguoi_tao, co_so, doi_tuong_id, loai_doi_tuong) 
         VALUES ('${loai_thu_chi}', ${tong_tien}, '${dien_giai}', '${nguoi_tao || null}', '${co_so || null}', '${doi_tuong_id || null}', '${loai_doi_tuong}') RETURNING *`
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error creating finance record:', error);
      res.status(400).json({ error: "Invalid finance data" });
    }
  });

  // Finance transaction types routes
  app.get("/api/finance-transaction-types", async (req, res) => {
    try {
      const result = await storage.executeQuery('SELECT * FROM finance_transaction_types ORDER BY type_name');
      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching finance transaction types:', error);
      res.status(500).json({ error: "Failed to fetch transaction types" });
    }
  });

  // Teachers endpoint (using employees with role filter)
  app.get("/api/teachers", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      const teachers = employees.filter(emp => 
        emp.chuc_vu === 'teacher' || 
        emp.chuc_vu === 'giao_vien' || 
        emp.chuc_vu === 'Giáo viên' ||
        emp.chuc_vu?.toLowerCase().includes('teacher') ||
        emp.chuc_vu?.toLowerCase().includes('giáo viên')
      );
      res.json(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      console.log('Tasks API endpoint called');
      const tasks = await storage.getTasks();
      console.log('Tasks fetched from storage:', tasks.length);
      res.json(tasks);
    } catch (error) {
      console.error('Error in tasks endpoint:', error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const task = await storage.createTask(req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Session schedules routes
  app.get("/api/sessions", async (req, res) => {
    try {
      // Return empty array for now - sessions table exists but no CRUD methods in storage yet
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Admissions routes
  app.get("/api/admissions", async (req, res) => {
    try {
      // Return empty array for now - admissions table exists but no CRUD methods in storage yet
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admissions" });
    }
  });

  // Employee clock-in routes
  app.get("/api/employee-clock-in", async (req, res) => {
    try {
      const { month, year } = req.query;
      let clockInData;

      if (month && year) {
        clockInData = await storage.getEmployeeClockInByMonth(parseInt(month as string), parseInt(year as string));
      } else {
        clockInData = await storage.getEmployeeClockIn();
      }

      res.json(clockInData);
    } catch (error) {
      console.error('Error fetching employee clock-in data:', error);
      res.status(500).json({ error: "Failed to fetch employee clock-in data" });
    }
  });

  app.get("/api/employee-clock-in/:id", async (req, res) => {
    try {
      const clockInRecord = await storage.getEmployeeClockInById(req.params.id);
      if (!clockInRecord) {
        return res.status(404).json({ error: "Clock-in record not found" });
      }
      res.json(clockInRecord);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clock-in record" });
    }
  });

  app.post("/api/employee-clock-in", async (req, res) => {
    try {
      const clockInRecord = await storage.createEmployeeClockIn(req.body);
      res.json(clockInRecord);
    } catch (error) {
      res.status(400).json({ error: "Invalid clock-in data" });
    }
  });

  app.patch("/api/employee-clock-in/:id", async (req, res) => {
    try {
      const clockInRecord = await storage.updateEmployeeClockIn(req.params.id, req.body);
      if (!clockInRecord) {
        return res.status(404).json({ error: "Clock-in record not found" });
      }
      res.json(clockInRecord);
    } catch (error) {
      res.status(500).json({ error: "Failed to update clock-in record" });
    }
  });

  app.delete("/api/employee-clock-in/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmployeeClockIn(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Clock-in record not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete clock-in record" });
    }
  });

  // Files routes
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getFiles();
      res.json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const file = await storage.createFile(req.body);
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Invalid file data" });
    }
  });

  app.patch("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.updateFile(req.params.id, req.body);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const success = await storage.deleteFile(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Requests routes
  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await storage.getRequests();
      res.json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", async (req, res) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const request = await storage.createRequest(req.body);
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.patch("/api/requests/:id", async (req, res) => {
    try {
      const request = await storage.updateRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  app.delete("/api/requests/:id", async (req, res) => {
    try {
      const success = await storage.deleteRequest(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  // Evaluations routes
  app.get("/api/evaluations", async (req, res) => {
    try {
      const evaluations = await storage.getEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      res.status(500).json({ error: "Failed to fetch evaluations" });
    }
  });

  app.get("/api/evaluations/:id", async (req, res) => {
    try {
      const evaluation = await storage.getEvaluation(req.params.id);
      if (!evaluation) {
        return res.status(404).json({ error: "Evaluation not found" });
      }
      res.json(evaluation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evaluation" });
    }
  });

  app.post("/api/evaluations", async (req, res) => {
    try {
      const evaluation = await storage.createEvaluation(req.body);
      res.json(evaluation);
    } catch (error) {
      res.status(400).json({ error: "Invalid evaluation data" });
    }
  });

  // Payroll routes
  app.get("/api/payroll", async (req, res) => {
    try {
      const { month, year } = req.query;
      let payrollData;

      if (month && year) {
        payrollData = await storage.getPayrollByMonth(parseInt(month as string), parseInt(year as string));
      } else {
        payrollData = await storage.getPayroll();
      }

      res.json(payrollData);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      res.status(500).json({ error: "Failed to fetch payroll data" });
    }
  });

  app.get("/api/payroll/:id", async (req, res) => {
    try {
      const payrollRecord = await storage.getPayrollById(req.params.id);
      if (!payrollRecord) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
      res.json(payrollRecord);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payroll record" });
    }
  });

  // Sessions routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const result = await storage.executeQuery('SELECT * FROM sessions ORDER BY created_at DESC');
      res.json(result.rows || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Enrollments routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.getEnrollment(req.params.id);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollment" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollment = await storage.createEnrollment(req.body);
      res.json(enrollment);
    } catch (error) {
      console.error('Error creating enrollment:', error);
      res.status(400).json({ error: "Invalid enrollment data" });
    }
  });

  // Admissions routes
  app.get("/api/admissions", async (req, res) => {
    try {
      const admissions = await storage.getAdmissions();
      res.json(admissions);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      res.status(500).json({ error: "Failed to fetch admissions" });
    }
  });

  app.get("/api/admissions/:id", async (req, res) => {
    try {
      const admission = await storage.getAdmission(req.params.id);
      if (!admission) {
        return res.status(404).json({ error: "Admission not found" });
      }
      res.json(admission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admission" });
    }
  });

  app.post("/api/admissions", async (req, res) => {
    try {
      const admission = await storage.createAdmission(req.body);
      res.json(admission);
    } catch (error) {
      res.status(400).json({ error: "Invalid admission data" });
    }
  });

  // Images routes
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.get("/api/images/:id", async (req, res) => {
    try {
      const image = await storage.getImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  app.post("/api/images", async (req, res) => {
    try {
      const image = await storage.createImage(req.body);
      res.json(image);
    } catch (error) {
      res.status(400).json({ error: "Invalid image data" });
    }
  });

  // AI Command processing route (migrated from Supabase Edge Function)
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, model = 'gpt-4o-mini', type = 'text' } = req.body;

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(400).json({ error: 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.' });
      }

      if (type === 'image') {
        // Generate image using DALL-E 3
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Failed to generate image');
        }

        res.json({ 
          imageUrls: data.data.map((img: any) => img.url),
          data: data
        });
      } else {
        // Text generation with GPT
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: 'You are a helpful assistant that provides information for a school management system.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Failed to generate text');
        }

        const generatedText = data.choices[0]?.message?.content || '';

        res.json({ generatedText, data });
      }
    } catch (error) {
      console.error('Error in AI generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Database Schema routes
  app.get("/api/database-schema", async (req, res) => {
    try {
      const query = `
        SELECT 
          table_name,
          COUNT(column_name) as column_count 
        FROM 
          information_schema.columns 
        WHERE 
          table_schema = 'public' 
        GROUP BY 
          table_name 
        ORDER BY 
          table_name
      `;
      const result = await storage.executeQuery(query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching database schema:', error);
      res.status(500).json({ error: "Failed to fetch database schema" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin API routes
  app.get("/api/admin/tables", async (req, res) => {
    try {
      const query = `
        SELECT 
          t.table_name,
          t.table_type,
          COALESCE(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0) as row_count
        FROM information_schema.tables t
        LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
        WHERE t.table_schema = 'public'
        ORDER BY t.table_name
      `;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tables:', error);
      res.status(500).json({ error: 'Failed to fetch tables' });
    }
  });

  app.get("/api/admin/table/:tableName/columns", async (req, res) => {
    try {
      const { tableName } = req.params;
      const query = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `;
      const result = await db.query(query, [tableName]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching columns:', error);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  });

  app.get("/api/admin/table/:tableName/data", async (req, res) => {
    try {
      const { tableName } = req.params;
      const limit = parseInt(req.query.limit as string) || 1000;
      const offset = parseInt(req.query.offset as string) || 0;

      // Validate table name to prevent SQL injection
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `;
      const tableExists = await db.query(tableExistsQuery, [tableName]);

      if (!tableExists.rows[0].exists) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const query = `SELECT * FROM "${tableName}" LIMIT $1 OFFSET $2`;
      const result = await db.query(query, [limit, offset]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching table data:', error);
      res.status(500).json({ error: 'Failed to fetch table data' });
    }
  });

  app.post("/api/admin/table/:tableName/add", async (req, res) => {
    try {
      const { tableName } = req.params;
      const data = req.body;

      // Validate table name
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `;
      const tableExists = await db.query(tableExistsQuery, [tableName]);

      if (!tableExists.rows[0].exists) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map((_, index) => `$${index + 1}`);

      const query = `
        INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;

      const result = await db.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding row:', error);
      res.status(500).json({ error: 'Failed to add row: ' + error.message });
    }
  });

  app.put("/api/admin/table/:tableName/update/:id", async (req, res) => {
    try {
      const { tableName, id } = req.params;
      const data = req.body;

      // Validate table name
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `;
      const tableExists = await db.query(tableExistsQuery, [tableName]);

      if (!tableExists.rows[0].exists) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, index) => `"${col}" = $${index + 1}`);

      const query = `
        UPDATE "${tableName}" 
        SET ${setClause.join(', ')}
        WHERE id = $${values.length + 1}
        RETURNING *
      `;

      const result = await db.query(query, [...values, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Row not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating row:', error);
      res.status(500).json({ error: 'Failed to update row: ' + error.message });
    }
  });

  app.delete("/api/admin/table/:tableName/delete/:id", async (req, res) => {
    try {
      const { tableName, id } = req.params;

      // Validate table name
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `;
      const tableExists = await db.query(tableExistsQuery, [tableName]);

      if (!tableExists.rows[0].exists) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const query = `DELETE FROM "${tableName}" WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Row not found' });
      }

      res.json({ message: 'Row deleted successfully' });
    } catch (error) {
      console.error('Error deleting row:', error);
      res.status(500).json({ error: 'Failed to delete row: ' + error.message });
    }
  });

  app.post("/api/admin/sql/execute", async (req, res) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Basic SQL injection protection - block certain dangerous keywords
      const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE'];
      const upperQuery = query.toUpperCase();
      const isDangerous = dangerousKeywords.some(keyword => 
        upperQuery.includes(keyword) && !upperQuery.startsWith('SELECT')
      );

      if (isDangerous) {
        return res.status(403).json({ 
          error: 'Dangerous query detected. Only SELECT queries are allowed for safety.' 
        });
      }

      const result = await db.query(query);

      // Format response for different query types
      if (result.rows && Array.isArray(result.rows)) {
        const columns = result.fields ? result.fields.map(field => field.name) : [];
        const rows = result.rows.map(row => columns.map(col => row[col]));

        res.json({
          columns,
          rows,
          row_count: result.rowCount || 0
        });
      } else {
        res.json({
          columns: [],
          rows: [],
          row_count: result.rowCount || 0,
          message: 'Query executed successfully'
        });
      }
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/schema", async (req, res) => {
    try {
      // Get all tables with their columns and constraints
      const tablesQuery = `
        SELECT DISTINCT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;
      const tables = await db.query(tablesQuery);

      const schemaInfo = await Promise.all(
        tables.rows.map(async (table) => {
          const tableName = table.table_name;

          // Get columns
          const columnsQuery = `
            SELECT 
              column_name,
              data_type,
              is_nullable,
              column_default,
              character_maximum_length
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = $1
            ORDER BY ordinal_position
          `;
          const columns = await db.query(columnsQuery, [tableName]);

          // Get constraints
          const constraintsQuery = `
            SELECT 
              tc.constraint_name,
              tc.constraint_type,
              ccu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
              ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_schema = 'public' AND tc.table_name = $1
          `;
          const constraints = await db.query(constraintsQuery, [tableName]);

          return {
            table_name: tableName,
            columns: columns.rows,
            constraints: constraints.rows
          };
        })
      );

      res.json(schemaInfo);
    } catch (error) {
      console.error('Error fetching schema:', error);
      res.status(500).json({ error: 'Failed to fetch schema' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}