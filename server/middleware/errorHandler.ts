import type { Request, Response, NextFunction } from "express";

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

// Custom error class for API errors
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle custom API errors
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + error.message;
    isOperational = true;
  }
  // Handle database errors
  else if (error.name === 'DatabaseError' || error.message.includes('database')) {
    statusCode = 500;
    message = 'Database operation failed';
    isOperational = true;
  }
  // Handle authentication errors
  else if (error.name === 'UnauthorizedError' || error.message.includes('unauthorized')) {
    statusCode = 401;
    message = 'Unauthorized access';
    isOperational = true;
  }
  // Handle not found errors
  else if (error.message.includes('not found')) {
    statusCode = 404;
    message = error.message;
    isOperational = true;
  }

  // Log error details
  console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`);
  if (error.stack && (!isOperational || statusCode >= 500)) {
    console.error(error.stack);
  }

  // Manual JSON serialization to avoid Node.js JSON.stringify bug
  const errorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error.message
      })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Use manual JSON serialization to match the success responses
  const manualJson = manualSerialize(errorResponse);
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).send(manualJson);
};

// Async error wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Validation error helper
export const createValidationError = (message: string) => {
  return new ApiError(`Validation failed: ${message}`, 400);
};

// Database error helper
export const createDatabaseError = (message: string) => {
  return new ApiError(`Database error: ${message}`, 500);
};

// Not found error helper
export const createNotFoundError = (resource: string) => {
  return new ApiError(`${resource} not found`, 404);
};
