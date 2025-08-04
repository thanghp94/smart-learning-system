import type { Response } from "express";
import { ApiError, createNotFoundError, createDatabaseError } from "../middleware/errorHandler";
import { logger } from "../middleware/logger";

// Legacy error handling functions (deprecated - use middleware instead)
export const handleError = (res: Response, error: any, message: string, statusCode: number = 500) => {
  logger.error(`Legacy error handler: ${message}`, { error: error instanceof Error ? error.message : error });
  throw new ApiError(message, statusCode);
};

export const handleNotFound = (res: Response, entity: string) => {
  throw createNotFoundError(entity);
};

// New async wrapper for route handlers
export const asyncRoute = (fn: Function) => {
  return async (req: any, res: any, next: any) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Database operation wrapper
export const dbOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(`Database operation failed: ${errorMessage}`, { error });
    throw createDatabaseError(errorMessage);
  }
};
