import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./database/init";
import { errorHandler, notFoundHandler, asyncHandler } from "./middleware/errorHandler";
import { requestLogger, performanceLogger, logger } from "./middleware/logger";

const app = express();

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

  // Error handling middleware (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 3000 for testing
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
