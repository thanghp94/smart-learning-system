import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./database/config";
import { db, pool } from "./database/connection";
import { 
  insertStudentSchema, insertEmployeeSchema, insertFacilitySchema,
  insertClassSchema, insertTeachingSessionSchema, insertEnrollmentSchema,
  insertAttendanceSchema, insertAssetSchema, insertTaskSchema
} from "@shared/schema";

// Helper function for manual JSON serialization using string concatenation
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
    let result = '[';
    for (let i = 0; i < obj.length; i++) {
      if (i > 0) result += ',';
      result += manualSerialize(obj[i]);
    }
    result += ']';
    return result;
  }
  if (typeof obj === 'object') {
    let result = '{';
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) result += ',';
      result += '"' + keys[i] + '":' + manualSerialize(obj[keys[i]]);
    }
    result += '}';
    return result;
  }
  return '"' + String(obj) + '"';
}

// Simple manual JSON builder to bypass Node.js JSON.stringify bug completely
function buildJsonString(obj: any): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  if (obj instanceof Date) {
    return '"' + obj.toISOString() + '"';
  }
  if (Array.isArray(obj)) {
    const items = obj.map(item => buildJsonString(item));
    return '[' + items.join(',') + ']';
  }
  if (typeof obj === 'object') {
    const pairs: string[] = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        pairs.push('"' + key + '":' + buildJsonString(obj[key]));
      }
    }
    return '{' + pairs.join(',') + '}';
  }
  return 'null';
}

// Safe JSON response helper that bypasses the JSON.stringify bug completely
function safeJsonResponse(res: Response, data: any, statusCode: number = 200) {
  try {
    console.log('Using manual JSON builder to bypass Node.js bug completely');
    
    // Build JSON manually to avoid Node.js JSON.stringify bug
    const jsonString = buildJsonString(data);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).send(jsonString);
  } catch (error) {
    console.error('Safe JSON response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function for error handling
const handleError = (res: Response, error: any, message: string, statusCode: number = 500) => {
  console.error(`${message}:`, error);
  safeJsonResponse(res, { 
    error: message, 
    details: error instanceof Error ? error.message : 'Unknown error' 
  }, statusCode);
};

// Helper function for not found responses
const handleNotFound = (res: Response, entity: string) => {
  safeJsonResponse(res, { error: `${entity} not found` }, 404);
};

// Generic CRUD route factory
const createCrudRoutes = (
  app: Express,
  basePath: string,
  entityName: string,
  storageMethodPrefix: string,
  validationSchema?: any
) => {
  // GET all
  app.get(`/api/${basePath}`, async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const methodName = `get${storageMethodPrefix}s`;
      
      // Check if method exists
      if (typeof (storage as any)[methodName] !== 'function') {
        console.error(`Method ${methodName} not found in storage`);
        return res.status(500).json({ error: `Method ${methodName} not implemented` });
      }
      
      const items = await (storage as any)[methodName]();
      safeJsonResponse(res, items);
    } catch (error) {
      handleError(res, error, `Failed to fetch ${basePath}`);
    }
  });

  // GET by ID
  app.get(`/api/${basePath}/:id`, async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const methodName = `get${storageMethodPrefix}`;
      
      // Check if method exists
      if (typeof (storage as any)[methodName] !== 'function') {
        console.error(`Method ${methodName} not found in storage`);
        return res.status(500).json({ error: `Method ${methodName} not implemented` });
      }
      
      const item = await (storage as any)[methodName](req.params.id);
      if (!item) {
        return handleNotFound(res, entityName);
      }
      safeJsonResponse(res, item);
    } catch (error) {
      handleError(res, error, `Failed to fetch ${entityName.toLowerCase()}`);
    }
  });

  // POST create
  app.post(`/api/${basePath}`, async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const methodName = `create${storageMethodPrefix}`;
      
      // Check if method exists
      if (typeof (storage as any)[methodName] !== 'function') {
        console.error(`Method ${methodName} not found in storage`);
        return res.status(500).json({ error: `Method ${methodName} not implemented` });
      }
      
      let data = req.body;
      
      // Apply validation if schema provided
      if (validationSchema) {
        data = validationSchema.parse(req.body);
      }
      
      const item = await (storage as any)[methodName](data);
      safeJsonResponse(res, item, 201);
    } catch (error) {
      handleError(res, error, `Invalid ${entityName.toLowerCase()} data`, 400);
    }
  });

  // PATCH/PUT update
  const updateHandler = async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const methodName = `update${storageMethodPrefix}`;
      
      // Check if method exists
      if (typeof (storage as any)[methodName] !== 'function') {
        console.error(`Method ${methodName} not found in storage`);
        return res.status(500).json({ error: `Method ${methodName} not implemented` });
      }
      
      const item = await (storage as any)[methodName](req.params.id, req.body);
      if (!item) {
        return handleNotFound(res, entityName);
      }
      safeJsonResponse(res, item);
    } catch (error) {
      handleError(res, error, `Failed to update ${entityName.toLowerCase()}`);
    }
  };

  app.patch(`/api/${basePath}/:id`, updateHandler);
  app.put(`/api/${basePath}/:id`, updateHandler);

  // DELETE
  app.delete(`/api/${basePath}/:id`, async (req: Request, res: Response) => {
    try {
      const storage = await getStorage();
      const methodName = `delete${storageMethodPrefix}`;
      
      // Check if method exists
      if (typeof (storage as any)[methodName] !== 'function') {
        console.error(`Method ${methodName} not found in storage`);
        return res.status(500).json({ error: `Method ${methodName} not implemented` });
      }
      
      const success = await (storage as any)[methodName](req.params.id);
      if (!success) {
        return handleNotFound(res, entityName);
      }
      safeJsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, `Failed to delete ${entityName.toLowerCase()}`);
    }
  });
};

// Custom employee routes with special handling
const createEmployeeRoutes = (app: Express) => {
  app.get('/api/employees', async (req: Request, res: Response) => {
    try {
      const employees = await (await getStorage()).getEmployees();
      safeJsonResponse(res, employees);
    } catch (error) {
      handleError(res, error, 'Failed to get employees');
    }
  });

  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const employee = await (await getStorage()).getEmployee(req.params.id);
      if (!employee) {
        return handleNotFound(res, 'Employee');
      }
      safeJsonResponse(res, employee);
    } catch (error) {
      handleError(res, error, 'Failed to fetch employee');
    }
  });

  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      
      // Handle co_so_id array conversion
      let coSoId = data.co_so_id;
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
      }

      const result = await pool.query(
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

      safeJsonResponse(res, result.rows[0], 201);
    } catch (error) {
      handleError(res, error, 'Failed to create employee');
    }
  });

  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      // Handle co_so_id array conversion
      let coSoId = data.co_so_id;
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
      }

      const result = await pool.query(
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
        return handleNotFound(res, 'Employee');
      }

      safeJsonResponse(res, result.rows[0]);
    } catch (error) {
      handleError(res, error, 'Failed to update employee');
    }
  });

  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const success = await (await getStorage()).deleteEmployee(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Employee');
      }
      safeJsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete employee');
    }
  });
};

// Special routes
const createSpecialRoutes = (app: Express) => {
  // Monthly attendance route
  app.get("/api/attendances/monthly/:month/:year", async (req: Request, res: Response) => {
    try {
      const month = parseInt(req.params.month);
      const year = parseInt(req.params.year);

      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid month or year" });
      }

      const attendances = await (await getStorage()).getAttendances();
      const filteredAttendances = attendances.filter(attendance => {
        if (attendance.created_at) {
          const attendanceDate = new Date(attendance.created_at);
          return attendanceDate.getMonth() + 1 === month && attendanceDate.getFullYear() === year;
        }
        return false;
      });

      safeJsonResponse(res, filteredAttendances);
    } catch (error) {
      handleError(res, error, 'Failed to fetch monthly attendance');
    }
  });

  // Teachers endpoint (filtered employees)
  app.get("/api/teachers", async (req: Request, res: Response) => {
    try {
      const employees = await (await getStorage()).getEmployees();
      const teachers = employees.filter(emp => 
        emp.chuc_vu === 'teacher' || 
        emp.chuc_vu === 'giao_vien' || 
        emp.chuc_vu === 'Giáo viên' ||
        emp.chuc_vu?.toLowerCase().includes('teacher') ||
        emp.chuc_vu?.toLowerCase().includes('giáo viên')
      );
      safeJsonResponse(res, teachers);
    } catch (error) {
      handleError(res, error, 'Failed to fetch teachers');
    }
  });

  // AI Command processing route
  app.post("/api/ai/generate", async (req: Request, res: Response) => {
    try {
      const { prompt, model = 'gpt-4o-mini', type = 'text' } = req.body;

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(400).json({ 
          error: 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.' 
        });
      }

      if (type === 'image') {
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

        safeJsonResponse(res, { 
          imageUrls: data.data.map((img: any) => img.url),
          data: data
        });
      } else {
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
        safeJsonResponse(res, { generatedText, data });
      }
    } catch (error) {
      handleError(res, error, 'AI generation failed');
    }
  });

  // Database Schema routes
  app.get("/api/database-schema", async (req: Request, res: Response) => {
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
      const result = await (await getStorage()).executeQuery(query);
      safeJsonResponse(res, result);
    } catch (error) {
      handleError(res, error, 'Failed to fetch database schema');
    }
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    safeJsonResponse(res, { status: "ok", timestamp: new Date().toISOString() });
  });

  // Migration status endpoint
  app.get("/api/migrate/status", async (req: Request, res: Response) => {
    try {
      const { checkPostgreSQLConnection } = await import("./database/config");
      const isPostgreSQLAvailable = await checkPostgreSQLConnection();
      safeJsonResponse(res, { 
        postgresAvailable: isPostgreSQLAvailable,
        currentDatabase: 'postgresql'
      });
    } catch (error) {
      safeJsonResponse(res, { 
        postgresAvailable: false,
        currentDatabase: 'postgresql',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

// Route configuration
const routeConfigs = [
  // Core entities with validation schemas
  { path: 'students', entity: 'Student', method: 'Student', schema: insertStudentSchema },
  { path: 'facilities', entity: 'Facility', method: 'Facility', schema: insertFacilitySchema },
  { path: 'classes', entity: 'Class', method: 'Classe', schema: insertClassSchema },
  { path: 'teaching-sessions', entity: 'Teaching Session', method: 'TeachingSession', schema: insertTeachingSessionSchema },
  { path: 'enrollments', entity: 'Enrollment', method: 'Enrollment', schema: insertEnrollmentSchema },
  { path: 'attendances', entity: 'Attendance', method: 'Attendance', schema: insertAttendanceSchema },
  { path: 'assets', entity: 'Asset', method: 'Asset', schema: insertAssetSchema },
  
  // Entities without strict validation schemas
  { path: 'tasks', entity: 'Task', method: 'Task' },
  { path: 'evaluations', entity: 'Evaluation', method: 'Evaluation' },
  { path: 'admissions', entity: 'Admission', method: 'Admission' },
  { path: 'images', entity: 'Image', method: 'Image' },
  
  // Additional entities that need API routes
  { path: 'files', entity: 'File', method: 'File' },
  { path: 'contacts', entity: 'Contact', method: 'Contact' },
  { path: 'requests', entity: 'Request', method: 'Request' },
  { path: 'employee-clock-ins', entity: 'Employee Clock-in', method: 'EmployeeClockIn' },
];

// Special routes that need custom handling
const specialRouteConfigs = [
  { path: 'payroll', entity: 'Payroll', getMethod: 'getPayroll', getByIdMethod: 'getPayrollById', createMethod: 'createPayroll', updateMethod: 'updatePayroll', deleteMethod: 'deletePayroll' },
];

// Special route handler for payroll
const createPayrollRoutes = (app: Express) => {
  app.get("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).getPayroll();
      safeJsonResponse(res, payroll);
    } catch (error) {
      handleError(res, error, 'Failed to fetch payroll');
    }
  });

  app.get("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).getPayrollById(req.params.id);
      if (!payroll) {
        return handleNotFound(res, 'Payroll record');
      }
      safeJsonResponse(res, payroll);
    } catch (error) {
      handleError(res, error, 'Failed to fetch payroll record');
    }
  });

  app.post("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).createPayroll(req.body);
      safeJsonResponse(res, payroll, 201);
    } catch (error) {
      handleError(res, error, 'Invalid payroll data', 400);
    }
  });

  app.patch("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).updatePayroll(req.params.id, req.body);
      if (!payroll) {
        return handleNotFound(res, 'Payroll record');
      }
      safeJsonResponse(res, payroll);
    } catch (error) {
      handleError(res, error, 'Failed to update payroll record');
    }
  });

  app.delete("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const success = await (await getStorage()).deletePayroll(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Payroll record');
      }
      safeJsonResponse(res, { success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete payroll record');
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Register standard CRUD routes
  routeConfigs.forEach(config => {
    createCrudRoutes(app, config.path, config.entity, config.method, config.schema);
  });

  // Register custom employee routes
  createEmployeeRoutes(app);

  // Register payroll routes
  createPayrollRoutes(app);

  // Register special routes
  createSpecialRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
