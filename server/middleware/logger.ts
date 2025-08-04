import type { Request, Response, NextFunction } from "express";

// Log levels
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// Logger class
class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, meta));
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  info(message: string, meta?: any) {
    console.info(this.formatMessage(LogLevel.INFO, message, meta));
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  // Database operation logging
  dbOperation(operation: string, table: string, duration?: number, meta?: any) {
    const message = `DB ${operation.toUpperCase()} on ${table}`;
    const logMeta = {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      ...meta
    };
    this.info(message, logMeta);
  }

  // API request logging
  apiRequest(method: string, path: string, statusCode: number, duration: number, meta?: any) {
    const message = `${method} ${path} ${statusCode}`;
    const logMeta = {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta
    };
    
    if (statusCode >= 400) {
      this.error(message, logMeta);
    } else {
      this.info(message, logMeta);
    }
  }

  // Authentication logging
  auth(action: string, userId?: string, success: boolean = true, meta?: any) {
    const message = `AUTH ${action} ${success ? 'SUCCESS' : 'FAILED'}`;
    const logMeta = {
      action,
      userId,
      success,
      ...meta
    };
    
    if (success) {
      this.info(message, logMeta);
    } else {
      this.warn(message, logMeta);
    }
  }
}

// Create logger instance
export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response
  res.send = function(body) {
    const duration = Date.now() - start;
    const contentLength = Buffer.byteLength(body || '', 'utf8');
    
    logger.apiRequest(
      req.method,
      req.path,
      res.statusCode,
      duration,
      {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        contentLength,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: req.method !== 'GET' && req.body ? 'present' : undefined
      }
    );

    return originalSend.call(this, body);
  };

  next();
};

// Database operation logger
export const logDbOperation = (operation: string, table: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - start;
        logger.dbOperation(operation, table, duration, { success: true });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.dbOperation(operation, table, duration, { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        throw error;
      }
    };
  };
};

// Performance monitoring
export const performanceLogger = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > threshold) {
        logger.warn(`Slow request detected`, {
          method: req.method,
          path: req.path,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`
        });
      }
    });

    next();
  };
};

// Error logging helper
export const logError = (error: Error, context?: string, meta?: any) => {
  logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
    name: error.name,
    stack: error.stack,
    ...meta
  });
};

// Success logging helper
export const logSuccess = (message: string, meta?: any) => {
  logger.info(message, meta);
};

// Debug logging helper
export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};
