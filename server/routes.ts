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
  // Get all employees
  app.get('/api/employees', async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error('Error getting employees:', error);
      res.status(500).json({ error: 'Failed to get employees' });
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

  // Create employee
  app.post("/api/employees", async (req, res) => {
    try {
      const data = req.body;
      console.log("Creating employee with data:", JSON.stringify(data, null, 2));

      // Handle co_so_id properly - convert array to single value if needed
      let coSoId = data.co_so_id;
      console.log("Original co_so_id:", coSoId, "Type:", typeof coSoId);
      
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
        console.log("Converted array co_so_id to:", coSoId);
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
        console.log("Converted empty/undefined co_so_id to null");
      }

      console.log("Final co_so_id value:", coSoId);

      const result = await db.query(
        `INSERT INTO employees (
          ten_nhan_vien, ten_ngan, bo_phan, chuc_vu, so_dien_thoai, 
          email, co_so_id, trang_thai, ngay_sinh, dia_chi, 
          gioi_tinh, ghi_chu, hinh_anh
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *`,
        [
          data.ten_nhan_vien, data.ten_ngan, data.bo_phan, data.chuc_vu,
          data.so_dien_thoai, data.email, coSoId, data.trang_thai,
          data.ngay_sinh, data.dia_chi, data.gioi_tinh, data.ghi_chu,
          data.hinh_anh
        ]
      );

      console.log("Employee created successfully:", result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating employee:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: "Failed to create employee", details: error.message });
    }
  });

  // Update employee
  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      console.log("Updating employee ID:", id);
      console.log("Update data:", JSON.stringify(data, null, 2));

      // Handle co_so_id properly - convert array to single value if needed
      let coSoId = data.co_so_id;
      console.log("Original co_so_id:", coSoId, "Type:", typeof coSoId);
      
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
        console.log("Converted array co_so_id to:", coSoId);
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
        console.log("Converted empty/undefined co_so_id to null");
      }

      console.log("Final co_so_id value:", coSoId);

      const result = await db.query(
        `UPDATE employees 
         SET ten_nhan_vien = $1, ten_ngan = $2, bo_phan = $3, chuc_vu = $4, 
             so_dien_thoai = $5, email = $6, co_so_id = $7, trang_thai = $8,
             ngay_sinh = $9, dia_chi = $10, gioi_tinh = $11, ghi_chu = $12,
             hinh_anh = $13, updated_at = CURRENT_TIMESTAMP
         WHERE id = $14 
         RETURNING *`,
        [
          data.ten_nhan_vien, data.ten_ngan, data.bo_phan, data.chuc_vu,
          data.so_dien_thoai, data.email, coSoId, data.trang_thai,
          data.ngay_sinh, data.dia_chi, data.gioi_tinh, data.ghi_chu,
          data.hinh_anh, id
        ]
      );

      if (result.rows.length === 0) {
        console.log("No employee found with ID:", id);
        return res.status(404).json({ error: "Employee not found" });
      }

      console.log("Employee updated successfully:", result.rows[0]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating employee:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: "Failed to update employee", details: error.message });
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
      const { month, year, date } = req.query;
      let clockInData;

      if (date) {
        // Filter by specific date
        const result = await storage.executeQuery(
          `SELECT * FROM employee_clock_ins WHERE work_date = '${date}' ORDER BY clock_in_time DESC`
        );
        clockInData = Array.isArray(result) ? result : (result?.rows || []);
      } else if (month && year) {
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
      const { employee_id, clock_in_time, work_date, location_lat, location_lng, facility_id, location_verified, notes } = req.body;

      const result = await storage.executeQuery(
        `INSERT INTO employee_clock_ins (id, employee_id, clock_in_time, work_date, location_lat, location_lng, facility_id, location_verified, notes) 
         VALUES (gen_random_uuid()::text, '${employee_id}', '${clock_in_time}', '${work_date}', ${location_lat || 'NULL'}, ${location_lng || 'NULL'}, '${facility_id || ''}', ${location_verified}, '${notes || ''}') 
         RETURNING *`
      );

      const clockInRecord = Array.isArray(result) ? result[0] : (result?.rows?.[0] || {});
      res.json(clockInRecord);
    } catch (error) {
      console.error('Error creating clock-in record:', error);
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

  // Admin API endpoints for comprehensive database management

  // Execute SQL query
  app.post("/api/admin/sql", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }
      const result = await storage.executeQuery(query);
      res.json({ rows: result, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all tables
  app.get("/api/admin/tables", async (req, res) => {
    try {
      const query = `
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;
      const result = await storage.executeQuery(query);
      // Extract rows from PostgreSQL result object
      const tables = Array.isArray(result) ? result : (result?.rows || []);
      res.json(tables);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get table data with pagination, search, and sorting
  app.get("/api/admin/table/:tableName/data", async (req, res) => {
    try {
      const { tableName } = req.params;
      const { page = '1', pageSize = '50', search = '', sortColumn = '', sortDirection = 'asc' } = req.query;

      const pageNum = parseInt(page as string);
      const pageSizeNum = parseInt(pageSize as string);
      const offset = (pageNum - 1) * pageSizeNum;

      // Get table columns
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = '${tableName}'
        ORDER BY ordinal_position
      `;
      const columnsResult = await storage.executeQuery(columnsQuery);
      const columns = Array.isArray(columnsResult) ? columnsResult : (columnsResult?.rows || []);

      // Build data query with search and sorting
      let dataQuery = `SELECT * FROM "${tableName}"`;

      if (search) {
        const searchConditions = columns.map(col => 
          `CAST("${col.column_name}" AS TEXT) ILIKE '%${search}%'`
        ).join(' OR ');
        dataQuery += ` WHERE ${searchConditions}`;
      }

      if (sortColumn) {
        dataQuery += ` ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()}`;
      }

      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM "${tableName}"`;
      if (search) {
        const searchConditions = columns.map(col => 
          `CAST("${col.column_name}" AS TEXT) ILIKE '%${search}%'`
        ).join(' OR ');
        countQuery += ` WHERE ${searchConditions}`;
      }

      const countResult = await storage.executeQuery(countQuery);
      const totalRows = Array.isArray(countResult) ? countResult[0]?.total : (countResult?.rows?.[0]?.total || 0);

      // Add pagination
      dataQuery += ` LIMIT ${pageSizeNum} OFFSET ${offset}`;

      const dataResult = await storage.executeQuery(dataQuery);
      const rows = Array.isArray(dataResult) ? dataResult : (dataResult?.rows || []);

      res.json({
        columns,
        rows,
        totalRows: parseInt(totalRows),
        currentPage: pageNum,
        pageSize: pageSizeNum
      });
    } catch (error: any) {
      console.error('Error fetching table data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create new row in table
  app.post("/api/admin/table/:tableName/rows", async (req, res) => {
    try {
      const { tableName } = req.params;
      const data = req.body;

      const columns = Object.keys(data).map(key => `"${key}"`).join(', ');
      const values = Object.values(data).map(value => 
        value === null || value === undefined ? 'NULL' : `'${value}'`
      ).join(', ');

      const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${values}) RETURNING *`;
      const result = await storage.executeQuery(query);
      const newRow = Array.isArray(result) ? result[0] : (result?.rows?.[0] || {});

      res.json(newRow);
    } catch (error: any) {
      console.error('Error creating row:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update row in table
  app.patch("/api/admin/table/:tableName/rows/:rowId", async (req, res) => {
    try {
      const { tableName, rowId } = req.params;
      const data = req.body;

      const setClause = Object.entries(data).map(([key, value]) => 
        `"${key}" = ${value === null || value === undefined ? 'NULL' : `'${value}'`}`
      ).join(', ');

      const query = `UPDATE "${tableName}" SET ${setClause} WHERE id = '${rowId}' RETURNING *`;
      const result = await storage.executeQuery(query);
      const updatedRow = Array.isArray(result) ? result[0] : (result?.rows?.[0] || null);

      if (!updatedRow) {
        return res.status(404).json({ error: 'Row not found' });
      }

      res.json(updatedRow);
    } catch (error: any) {
      console.error('Error updating row:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete row from table
  app.delete("/api/admin/table/:tableName/rows/:rowId", async (req, res) => {
    try {
      const { tableName, rowId } = req.params;

      const query = `DELETE FROM "${tableName}" WHERE id = '${rowId}' RETURNING *`;
      const result = await storage.executeQuery(query);
      const deletedRow = Array.isArray(result) ? result[0] : (result?.rows?.[0] || null);

      if (!deletedRow) {
        return res.status(404).json({ error: 'Row not found' });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting row:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Export table data as CSV
  app.get("/api/admin/table/:tableName/export", async (req, res) => {
    try {
      const { tableName } = req.params;

      const query = `SELECT * FROM "${tableName}"`;
      const result = await storage.executeQuery(query);
      const rows = Array.isArray(result) ? result : (result?.rows || []);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }

      // Create CSV content
      const headers = Object.keys(rows[0]).join(',');
      const csvRows = rows.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      const csvContent = [headers, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${tableName}_export.csv"`);
      res.send(csvContent);
    } catch (error: any) {
      console.error('Error exporting table:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get database schema
  app.get("/api/admin/schema", async (req, res) => {
    try {
      const query = `
        SELECT 
          t.table_name,
          t.table_type,
          COALESCE(
            json_agg(
              json_build_object(
                'column_name', c.column_name,
                'data_type', c.data_type,
                'is_nullable', c.is_nullable,
                'column_default', c.column_default,
                'character_maximum_length', c.character_maximum_length
              ) ORDER BY c.ordinal_position
            ) FILTER (WHERE c.column_name IS NOT NULL),
            '[]'::json
          ) as columns
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
        WHERE t.table_schema = 'public'
        GROUP BY t.table_name, t.table_type
        ORDER BY t.table_name
      `;
      const result = await storage.executeQuery(query);
      const schema = Array.isArray(result) ? result : (result?.rows || []);
      res.json(schema);
    } catch (error: any) {
      console.error('Error fetching schema:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all enum types
  app.get("/api/admin/enums", async (req, res) => {
    try {
      const query = `
        SELECT 
          t.typname as enum_name,
          array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values,
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'table_name', c.table_name,
                'column_name', c.column_name
              )
            )
            FROM information_schema.columns c
            WHERE c.udt_name = t.typname
            AND c.table_schema = 'public'),
            '[]'::json
          ) as tables_using
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        WHERE t.typtype = 'e'
        GROUP BY t.typname
        ORDER BY t.typname
      `;
      const result = await storage.executeQuery(query);
      const enums = Array.isArray(result) ? result : (result?.rows || []);
      res.json(enums);
    } catch (error: any) {
      console.error('Error fetching enums:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create new enum type
  app.post("/api/admin/enums", async (req, res) => {
    try {
      const { name, values } = req.body;
      if (!name || !values || !Array.isArray(values) || values.length === 0) {
        return res.status(400).json({ error: 'Name and values array are required' });
      }

      // Validate enum name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        return res.status(400).json({ error: 'Invalid enum name. Use only letters, numbers, and underscores.' });
      }

      const valuesStr = values.map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
      const query = `CREATE TYPE ${name} AS ENUM (${valuesStr})`;

      await storage.executeQuery(query);
      res.json({ success: true, message: 'Enum type created successfully' });
    } catch (error: any) {
      console.error('Error creating enum:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add value to existing enum
  app.post("/api/admin/enums/:enumName/values", async (req, res) => {
    try {
      const { enumName } = req.params;
      const { value } = req.body;

      if (!value) {
        return res.status(400).json({ error: 'Value is required' });
      }

      const query = `ALTER TYPE ${enumName} ADD VALUE '${value.replace(/'/g, "''")}'`;
      await storage.executeQuery(query);
      res.json({ success: true, message: 'Enum value added successfully' });
    } catch (error: any) {
      console.error('Error adding enum value:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete enum value (PostgreSQL doesn't support this directly, so we'll return an error)
  app.delete("/api/admin/enums/:enumName/values/:value", async (req, res) => {
    try {
      res.status(400).json({ 
        error: 'PostgreSQL does not support removing enum values. You would need to recreate the enum type.' 
      });
    } catch (error: any) {
      console.error('Error deleting enum value:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete entire enum type
  app.delete("/api/admin/enums/:enumName", async (req, res) => {
    try {
      const { enumName } = req.params;

      // Check if enum is being used
      const checkQuery = `
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE udt_name = '${enumName}' AND table_schema = 'public'
      `;
      const checkResult = await storage.executeQuery(checkQuery);
      const usage = Array.isArray(checkResult) ? checkResult : (checkResult?.rows || []);

      if (usage.length > 0) {
        return res.status(400).json({ 
          error: `Cannot delete enum. It is being used in: ${usage.map(u => `${u.table_name}.${u.column_name}`).join(', ')}` 
        });
      }

      const query = `DROP TYPE ${enumName}`;
      await storage.executeQuery(query);
      res.json({ success: true, message: 'Enum type deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting enum:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Apply enum to column
  app.post("/api/admin/table/:tableName/column/:columnName/enum", async (req, res) => {
    try {
      const { tableName, columnName } = req.params;
      const { enumName } = req.body;

      if (!enumName) {
        return res.status(400).json({ error: 'Enum name is required' });
      }

      const query = `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE ${enumName} USING "${columnName}"::${enumName}`;
      await storage.executeQuery(query);
      res.json({ success: true, message: 'Enum applied to column successfully' });
    } catch (error: any) {
      console.error('Error applying enum to column:', error);
      res.status(500).json({ error: error.message });
    }
  });





  const httpServer = createServer(app);

  return httpServer;
}