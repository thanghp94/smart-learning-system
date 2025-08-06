import { Request, Response } from "express";
import { Express } from "express";
import { storage } from "./storage";

// Ultra-simple JSON response function that avoids all Node.js JSON issues
function simpleJsonResponse(res: Response, data: any, statusCode: number = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode);
  
  // Handle simple cases first
  if (data === null) {
    res.send('null');
    return;
  }
  
  if (data === undefined) {
    res.send('null');
    return;
  }
  
  // For arrays and objects, manually construct JSON to avoid Node.js bug
  if (Array.isArray(data)) {
    const items = data.map(item => {
      if (typeof item === 'object' && item !== null) {
        // Manually build object JSON
        const pairs = Object.entries(item).map(([key, value]) => {
          const jsonKey = `"${key}"`;
          let jsonValue;
          
          if (value === null || value === undefined) {
            jsonValue = 'null';
          } else if (typeof value === 'string') {
            jsonValue = `"${value.replace(/"/g, '\\"')}"`;
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            jsonValue = String(value);
          } else {
            jsonValue = 'null';
          }
          
          return `${jsonKey}:${jsonValue}`;
        });
        return `{${pairs.join(',')}}`;
      }
      return 'null';
    });
    res.send(`[${items.join(',\n')}]`);
    return;
  }
  
  // For single objects
  if (typeof data === 'object' && data !== null) {
    const pairs = Object.entries(data).map(([key, value]) => {
      const jsonKey = `"${key}"`;
      let jsonValue;
      
      if (value === null || value === undefined) {
        jsonValue = 'null';
      } else if (typeof value === 'string') {
        jsonValue = `"${value.replace(/"/g, '\\"')}"`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        jsonValue = String(value);
      } else {
        jsonValue = 'null';
      }
      
      return `${jsonKey}:${jsonValue}`;
    });
    res.send(`{${pairs.join(',')}}`);
    return;
  }
  
  // Fallback for primitives
  if (typeof data === 'string') {
    res.send(`"${data.replace(/"/g, '\\"')}"`);
  } else {
    res.send(String(data));
  }
}

export function setupSimpleRoutes(app: Express) {
  
  // Health check - simplest possible
  app.get("/api/health", (req: Request, res: Response) => {
    simpleJsonResponse(res, { 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  });

  // Students - GET all
  app.get("/api/students", async (req: Request, res: Response) => {
    try {
      console.log("Fetching students...");
      const students = await storage.getStudents();
      console.log(`Found ${students.length} students`);
      simpleJsonResponse(res, students);
    } catch (error) {
      console.error('Error fetching students:', error);
      simpleJsonResponse(res, { error: 'Failed to fetch students' }, 500);
    }
  });

  // Students - GET by ID
  app.get("/api/students/:id", async (req: Request, res: Response) => {
    try {
      console.log(`Fetching student ${req.params.id}...`);
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        simpleJsonResponse(res, { error: 'Student not found' }, 404);
        return;
      }
      simpleJsonResponse(res, student);
    } catch (error) {
      console.error('Error fetching student:', error);
      simpleJsonResponse(res, { error: 'Failed to fetch student' }, 500);
    }
  });

  // Students - POST (create)
  app.post("/api/students", async (req: Request, res: Response) => {
    try {
      console.log("Creating student:", req.body);
      const student = await storage.createStudent(req.body);
      console.log("Student created:", student);
      simpleJsonResponse(res, student, 201);
    } catch (error) {
      console.error('Error creating student:', error);
      simpleJsonResponse(res, { error: 'Failed to create student' }, 500);
    }
  });

  // Students - PATCH (update)
  app.patch("/api/students/:id", async (req: Request, res: Response) => {
    try {
      console.log(`Updating student ${req.params.id}:`, req.body);
      const student = await storage.updateStudent(req.params.id, req.body);
      if (!student) {
        simpleJsonResponse(res, { error: 'Student not found' }, 404);
        return;
      }
      console.log("Student updated:", student);
      simpleJsonResponse(res, student);
    } catch (error) {
      console.error('Error updating student:', error);
      simpleJsonResponse(res, { error: 'Failed to update student' }, 500);
    }
  });

  // Students - DELETE
  app.delete("/api/students/:id", async (req: Request, res: Response) => {
    try {
      console.log(`Deleting student ${req.params.id}...`);
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        simpleJsonResponse(res, { error: 'Student not found' }, 404);
        return;
      }
      console.log("Student deleted successfully");
      simpleJsonResponse(res, { success: true });
    } catch (error) {
      console.error('Error deleting student:', error);
      simpleJsonResponse(res, { error: 'Failed to delete student' }, 500);
    }
  });

  console.log("Simple routes setup complete - Students API ready");
}
