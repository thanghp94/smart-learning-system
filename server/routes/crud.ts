import type { Express, Request, Response } from "express";
import { getStorage } from "../database/config";
import { handleError, handleNotFound } from "./utils";

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

// Safe JSON response helper that bypasses the JSON.stringify bug
function safeJsonResponse(res: Response, data: any, statusCode: number = 200) {
  try {
    // Force manual serialization to bypass JSON.stringify bug completely
    console.log('Using manual JSON serialization to bypass Node.js bug');
    const manualJson = manualSerialize(data);
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).send(manualJson);
  } catch (error) {
    console.error('Safe JSON response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Generic CRUD route factory
export const createCrudRoutes = (
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
