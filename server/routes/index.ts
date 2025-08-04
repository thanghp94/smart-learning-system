import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerEducationRoutes } from "./education";
import { registerHRRoutes } from "./hr";
import { registerAdminRoutes } from "./admin";
import { registerAIRoutes } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register domain-specific routes
  registerEducationRoutes(app);
  registerHRRoutes(app);
  registerAdminRoutes(app);
  registerAIRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
