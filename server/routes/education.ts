import type { Express, Request, Response } from "express";
import { createCrudRoutes } from "./crud";
import { getStorage } from "../database/config";
import { handleError, handleNotFound } from "./utils";
import { 
  insertStudentSchema, 
  insertClassSchema, 
  insertTeachingSessionSchema,
  insertEnrollmentSchema,
  insertAttendanceSchema
} from "@shared/schema";

// Helper function for manual JSON serialization
function manualSerialize(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
  }
  if (obj instanceof Date) {
    return '"' + obj.toISOString() + '"';
  }
  if (Array.isArray(obj)) {
    const items = obj.map(item => manualSerialize(item));
    return '[' + items.join(',') + ']';
  }
  if (typeof obj === 'object') {
    const props = Object.keys(obj).map(key => {
      return '"' + key + '":' + manualSerialize(obj[key]);
    });
    return '{' + props.join(',') + '}';
  }
  return '"' + String(obj) + '"';
}

// Safe JSON response helper using standard JSON.stringify
function safeJsonResponse(res: Response, data: any, statusCode: number = 200) {
  try {
    console.log('Using standard JSON.stringify for response');
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).json(data);
  } catch (error) {
    console.error('Safe JSON response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const registerEducationRoutes = (app: Express) => {
  // Students routes
  createCrudRoutes(app, 'students', 'Student', 'Student', insertStudentSchema);
  
  // Classes routes - Custom implementation due to irregular plural
  app.get('/api/classes', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const items = await storage.getClasses();
      safeJsonResponse(res, items);
    } catch (error) {
      handleError(res, error, 'Failed to fetch classes');
    }
  });

  app.get('/api/classes/:id', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const item = await storage.getClass(req.params.id);
      if (!item) {
        return handleNotFound(res, 'Class');
      }
      safeJsonResponse(res, item);
    } catch (error) {
      handleError(res, error, 'Failed to fetch class');
    }
  });

  app.post('/api/classes', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      let data = req.body;
      
      // Apply validation
      if (insertClassSchema) {
        data = insertClassSchema.parse(req.body);
      }
      
      const item = await storage.createClass(data);
      safeJsonResponse(res, item, 201);
    } catch (error) {
      handleError(res, error, 'Invalid class data', 400);
    }
  });

  app.patch('/api/classes/:id', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const item = await storage.updateClass(req.params.id, req.body);
      if (!item) {
        return handleNotFound(res, 'Class');
      }
      safeJsonResponse(res, item);
    } catch (error) {
      handleError(res, error, 'Failed to update class');
    }
  });

  app.put('/api/classes/:id', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const item = await storage.updateClass(req.params.id, req.body);
      if (!item) {
        return handleNotFound(res, 'Class');
      }
      safeJsonResponse(res, item);
    } catch (error) {
      handleError(res, error, 'Failed to update class');
    }
  });

  app.delete('/api/classes/:id', async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const success = await storage.deleteClass(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Class');
      }
      safeJsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete class');
    }
  });
  
  // Teaching sessions routes
  createCrudRoutes(app, 'teaching-sessions', 'Teaching Session', 'TeachingSession', insertTeachingSessionSchema);
  
  // Enrollments routes
  createCrudRoutes(app, 'enrollments', 'Enrollment', 'Enrollment', insertEnrollmentSchema);
  
  // Attendances routes
  createCrudRoutes(app, 'attendances', 'Attendance', 'Attendance', insertAttendanceSchema);
};
