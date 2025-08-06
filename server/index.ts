import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./database/init";
import { errorHandler, notFoundHandler, asyncHandler } from "./middleware/errorHandler";
import { requestLogger, performanceLogger, logger } from "./middleware/logger";

const app = express();

// Manual JSON serialization to bypass Node.js JSON.stringify bug
function buildJsonString(obj: any): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
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

// Global fix for malformed JSON responses using manual serialization
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(obj) {
    try {
      const jsonString = buildJsonString(obj);
      res.setHeader('Content-Type', 'application/json');
      return res.send(jsonString);
    } catch (error) {
      console.error('JSON serialization error:', error);
      return originalJson.call(this, { error: 'JSON serialization failed' });
    }
  };
  next();
});

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Logging middleware
app.use(requestLogger);
app.use(performanceLogger(2000)); // Log slow requests over 2 seconds

(async () => {
  // Database setup completed - using PostgreSQL exclusively
  console.log("Using PostgreSQL database exclusively...");
  
  const server = await registerRoutes(app);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("Environment:", app.get("env"));
  if (app.get("env") === "development") {
    console.log("Setting up Vite middleware...");
    await setupVite(app, server);
    console.log("Vite middleware setup complete");
  } else {
    console.log("Setting up static file serving...");
    serveStatic(app);
  }

  // Error handling middleware (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Serve the app on port 3000 for testing
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
