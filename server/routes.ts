import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./database-config";
import { db, pool } from "./db";
import { 
  insertStudentSchema, insertEmployeeSchema, insertFacilitySchema,
  insertClassSchema, insertTeachingSessionSchema, insertEnrollmentSchema,
  insertAttendanceSchema, insertAssetSchema, insertTaskSchema
} from "@shared/schema";

// Helper function for error handling
const handleError = (res: Response, error: any, message: string, statusCode: number = 500) => {
  console.error(`${message}:`, error);
  res.status(statusCode).json({ 
    error: message, 
    details: error instanceof Error ? error.message : 'Unknown error' 
  });
};

// Helper function for not found responses
const handleNotFound = (res: Response, entity: string) => {
  res.status(404).json({ error: `${entity} not found` });
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
      res.json(items);
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
      res.json(item);
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
      res.status(201).json(item);
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
      res.json(item);
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
      res.json({ success: true });
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
      res.json(employees);
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
      res.json(employee);
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

      res.status(201).json(result.rows[0]);
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

      res.json(result.rows[0]);
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
      res.json({ success: true });
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

      res.json(filteredAttendances);
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
      res.json(teachers);
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

        res.json({ 
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
        res.json({ generatedText, data });
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
      res.json(result);
    } catch (error) {
      handleError(res, error, 'Failed to fetch database schema');
    }
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Migration status endpoint
  app.get("/api/migrate/status", async (req: Request, res: Response) => {
    try {
      const { checkPostgreSQLConnection } = await import("./database-config");
      const isPostgreSQLAvailable = await checkPostgreSQLConnection();
      res.json({ 
        postgresAvailable: isPostgreSQLAvailable,
        currentDatabase: 'postgresql'
      });
    } catch (error) {
      res.json({ 
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
  { path: 'classes', entity: 'Class', method: 'Class', schema: insertClassSchema },
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
      res.json(payroll);
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
      res.json(payroll);
    } catch (error) {
      handleError(res, error, 'Failed to fetch payroll record');
    }
  });

  app.post("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).createPayroll(req.body);
      res.status(201).json(payroll);
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
      res.json(payroll);
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
      res.json({ success: true });
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
