import type { Express, Request, Response } from "express";
import { getStorage } from "../database/config";
import { handleError } from "./utils";
import { createCrudRoutes } from "./crud";
import { insertFacilitySchema, insertAssetSchema, insertTaskSchema } from "@shared/schema";

export const registerAdminRoutes = (app: Express) => {
  // Facilities routes
  createCrudRoutes(app, 'facilities', 'Facility', 'Facility', insertFacilitySchema);
  
  // Assets routes
  createCrudRoutes(app, 'assets', 'Asset', 'Asset', insertAssetSchema);
  
  // Tasks routes
  createCrudRoutes(app, 'tasks', 'Task', 'Task', insertTaskSchema);
  
  // Evaluations routes
  createCrudRoutes(app, 'evaluations', 'Evaluation', 'Evaluation');
  
  // Admissions routes
  createCrudRoutes(app, 'admissions', 'Admission', 'Admission');
  
  // Files routes
  createCrudRoutes(app, 'files', 'File', 'File');
  
  // Images routes
  createCrudRoutes(app, 'images', 'Image', 'Image');
  
  // Contacts routes
  createCrudRoutes(app, 'contacts', 'Contact', 'Contact');
  
  // Requests routes
  createCrudRoutes(app, 'requests', 'Request', 'Request');

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
      const { checkPostgreSQLConnection } = await import("../database/config");
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
