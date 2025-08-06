import { Request, Response } from "express";
import { Express } from "express";
import { storage } from "./storage";
import {
  insertStudentSchema, insertEmployeeSchema, insertFacilitySchema, insertClassSchema,
  insertTeachingSessionSchema, insertEnrollmentSchema, insertAttendanceSchema, 
  insertAssetSchema, insertTaskSchema
} from "@shared/schema";

// Simple, clean JSON response function
function jsonResponse(res: Response, data: any, statusCode: number = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode);
  
  // Use a simple, reliable JSON serialization
  if (data === null || data === undefined) {
    res.send('null');
    return;
  }
  
  if (typeof data === 'string') {
    res.send(`"${data.replace(/"/g, '\\"')}"`);
    return;
  }
  
  if (typeof data === 'number' || typeof data === 'boolean') {
    res.send(String(data));
    return;
  }
  
  // For objects and arrays, use native JSON.stringify but with error handling
  try {
    const jsonString = JSON.stringify(data, null, 0);
    res.send(jsonString);
  } catch (error) {
    console.error('JSON serialization error:', error);
    res.status(500).send('{"error":"Serialization failed"}');
  }
}

// Error handler
function handleError(res: Response, error: any, message: string, statusCode: number = 500) {
  console.error(`${message}:`, error);
  jsonResponse(res, { error: message }, statusCode);
}

// Not found handler
function handleNotFound(res: Response, resource: string) {
  jsonResponse(res, { error: `${resource} not found` }, 404);
}

export function setupRoutes(app: Express) {
  
  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    jsonResponse(res, { 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  });

  // Students routes
  app.get("/api/students", async (req: Request, res: Response) => {
    try {
      const students = await storage.getStudents();
      jsonResponse(res, students);
    } catch (error) {
      handleError(res, error, 'Failed to fetch students');
    }
  });

  app.get("/api/students/:id", async (req: Request, res: Response) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return handleNotFound(res, 'Student');
      }
      jsonResponse(res, student);
    } catch (error) {
      handleError(res, error, 'Failed to fetch student');
    }
  });

  app.post("/api/students", async (req: Request, res: Response) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      jsonResponse(res, student, 201);
    } catch (error) {
      handleError(res, error, 'Invalid student data', 400);
    }
  });

  app.patch("/api/students/:id", async (req: Request, res: Response) => {
    try {
      const student = await storage.updateStudent(req.params.id, req.body);
      if (!student) {
        return handleNotFound(res, 'Student');
      }
      jsonResponse(res, student);
    } catch (error) {
      handleError(res, error, 'Failed to update student');
    }
  });

  app.delete("/api/students/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Student');
      }
      jsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete student');
    }
  });

  // Employees routes
  app.get("/api/employees", async (req: Request, res: Response) => {
    try {
      const employees = await storage.getEmployees();
      jsonResponse(res, employees);
    } catch (error) {
      handleError(res, error, 'Failed to fetch employees');
    }
  });

  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return handleNotFound(res, 'Employee');
      }
      jsonResponse(res, employee);
    } catch (error) {
      handleError(res, error, 'Failed to fetch employee');
    }
  });

  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      jsonResponse(res, employee, 201);
    } catch (error) {
      handleError(res, error, 'Invalid employee data', 400);
    }
  });

  app.patch("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return handleNotFound(res, 'Employee');
      }
      jsonResponse(res, employee);
    } catch (error) {
      handleError(res, error, 'Failed to update employee');
    }
  });

  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Employee');
      }
      jsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete employee');
    }
  });

  // Classes routes
  app.get("/api/classes", async (req: Request, res: Response) => {
    try {
      const classes = await storage.getClasses();
      jsonResponse(res, classes);
    } catch (error) {
      handleError(res, error, 'Failed to fetch classes');
    }
  });

  app.get("/api/classes/:id", async (req: Request, res: Response) => {
    try {
      const classItem = await storage.getClass(req.params.id);
      if (!classItem) {
        return handleNotFound(res, 'Class');
      }
      jsonResponse(res, classItem);
    } catch (error) {
      handleError(res, error, 'Failed to fetch class');
    }
  });

  app.post("/api/classes", async (req: Request, res: Response) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const classItem = await storage.createClass(validatedData);
      jsonResponse(res, classItem, 201);
    } catch (error) {
      handleError(res, error, 'Invalid class data', 400);
    }
  });

  app.patch("/api/classes/:id", async (req: Request, res: Response) => {
    try {
      const classItem = await storage.updateClass(req.params.id, req.body);
      if (!classItem) {
        return handleNotFound(res, 'Class');
      }
      jsonResponse(res, classItem);
    } catch (error) {
      handleError(res, error, 'Failed to update class');
    }
  });

  app.delete("/api/classes/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteClass(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Class');
      }
      jsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete class');
    }
  });

  // Facilities routes
  app.get("/api/facilities", async (req: Request, res: Response) => {
    try {
      const facilities = await storage.getFacilitys();
      jsonResponse(res, facilities);
    } catch (error) {
      handleError(res, error, 'Failed to fetch facilities');
    }
  });

  app.get("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const facility = await storage.getFacility(req.params.id);
      if (!facility) {
        return handleNotFound(res, 'Facility');
      }
      jsonResponse(res, facility);
    } catch (error) {
      handleError(res, error, 'Failed to fetch facility');
    }
  });

  app.post("/api/facilities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFacilitySchema.parse(req.body);
      const facility = await storage.createFacility(validatedData);
      jsonResponse(res, facility, 201);
    } catch (error) {
      handleError(res, error, 'Invalid facility data', 400);
    }
  });

  app.patch("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const facility = await storage.updateFacility(req.params.id, req.body);
      if (!facility) {
        return handleNotFound(res, 'Facility');
      }
      jsonResponse(res, facility);
    } catch (error) {
      handleError(res, error, 'Failed to update facility');
    }
  });

  app.delete("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteFacility(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Facility');
      }
      jsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete facility');
    }
  });

  // Teaching Sessions routes
  app.get("/api/teaching-sessions", async (req: Request, res: Response) => {
    try {
      const sessions = await storage.getTeachingSessions();
      jsonResponse(res, sessions);
    } catch (error) {
      handleError(res, error, 'Failed to fetch teaching sessions');
    }
  });

  app.get("/api/teaching-sessions/:id", async (req: Request, res: Response) => {
    try {
      const session = await storage.getTeachingSession(req.params.id);
      if (!session) {
        return handleNotFound(res, 'Teaching session');
      }
      jsonResponse(res, session);
    } catch (error) {
      handleError(res, error, 'Failed to fetch teaching session');
    }
  });

  app.post("/api/teaching-sessions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTeachingSessionSchema.parse(req.body);
      const session = await storage.createTeachingSession(validatedData);
      jsonResponse(res, session, 201);
    } catch (error) {
      handleError(res, error, 'Invalid teaching session data', 400);
    }
  });

  app.patch("/api/teaching-sessions/:id", async (req: Request, res: Response) => {
    try {
      const session = await storage.updateTeachingSession(req.params.id, req.body);
      if (!session) {
        return handleNotFound(res, 'Teaching session');
      }
      jsonResponse(res, session);
    } catch (error) {
      handleError(res, error, 'Failed to update teaching session');
    }
  });

  app.delete("/api/teaching-sessions/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTeachingSession(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Teaching session');
      }
      jsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete teaching session');
    }
  });

  // Database schema endpoint
  app.get("/api/database-schema", async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT 
          table_name,
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        ORDER BY 
          table_name,
          ordinal_position
      `;
      const result = await storage.executeQuery(query);
      jsonResponse(res, result);
    } catch (error) {
      handleError(res, error, 'Failed to fetch database schema');
    }
  });

  // Migration status endpoint
  app.get("/api/migrate/status", async (req: Request, res: Response) => {
    try {
      const { checkPostgreSQLConnection } = await import("./database/config");
      const isPostgreSQLAvailable = await checkPostgreSQLConnection();
      jsonResponse(res, { 
        postgresAvailable: isPostgreSQLAvailable,
        currentDatabase: 'postgresql'
      });
    } catch (error) {
      jsonResponse(res, { 
        postgresAvailable: false,
        currentDatabase: 'postgresql',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
