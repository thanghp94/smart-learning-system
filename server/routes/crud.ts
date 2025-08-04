import type { Express, Request, Response } from "express";
import { getStorage } from "../database/config";
import { handleError, handleNotFound } from "./utils";

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
