// Centralized client-side logging system
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: any;
  stack?: string;
}

class ClientLogger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatMessage(level: LogLevel, message: string, meta?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      meta,
      stack: level === LogLevel.ERROR ? new Error().stack : undefined
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, meta?: any) {
    const entry = this.formatMessage(LogLevel.DEBUG, message, meta);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }

  info(message: string, meta?: any) {
    const entry = this.formatMessage(LogLevel.INFO, message, meta);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, meta);
    }
  }

  warn(message: string, meta?: any) {
    const entry = this.formatMessage(LogLevel.WARN, message, meta);
    this.addLog(entry);
    
    console.warn(`[WARN] ${message}`, meta);
  }

  error(message: string, error?: Error | any, meta?: any) {
    const entry = this.formatMessage(LogLevel.ERROR, message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      ...meta
    });
    this.addLog(entry);
    
    console.error(`[ERROR] ${message}`, { error, ...meta });
    
    // In production, you could send to error reporting service
    if (!this.isDevelopment) {
      this.reportError(entry);
    }
  }

  // API operation logging
  apiCall(method: string, endpoint: string, duration?: number, status?: number, meta?: any) {
    const message = `API ${method.toUpperCase()} ${endpoint}`;
    const logMeta = {
      method,
      endpoint,
      duration: duration ? `${duration}ms` : undefined,
      status,
      ...meta
    };

    if (status && status >= 400) {
      this.error(message, undefined, logMeta);
    } else {
      this.info(message, logMeta);
    }
  }

  // User action logging
  userAction(action: string, component?: string, meta?: any) {
    this.info(`User action: ${action}`, {
      component,
      ...meta
    });
  }

  // Performance logging
  performance(operation: string, duration: number, meta?: any) {
    const message = `Performance: ${operation} took ${duration}ms`;
    
    if (duration > 1000) {
      this.warn(message, meta);
    } else {
      this.debug(message, meta);
    }
  }

  // Get recent logs for debugging
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = level 
      ? this.logs.filter(log => log.level === level)
      : this.logs;
    
    return limit 
      ? filteredLogs.slice(-limit)
      : filteredLogs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Report error to external service (placeholder)
  private reportError(entry: LogEntry) {
    // TODO: Integrate with error reporting service like Sentry
    // Example:
    // Sentry.captureException(new Error(entry.message), {
    //   extra: entry.meta,
    //   level: 'error'
    // });
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const logger = new ClientLogger();

// Convenience functions
export const logDebug = (message: string, meta?: any) => logger.debug(message, meta);
export const logInfo = (message: string, meta?: any) => logger.info(message, meta);
export const logWarn = (message: string, meta?: any) => logger.warn(message, meta);
export const logError = (message: string, error?: Error | any, meta?: any) => logger.error(message, error, meta);
export const logApiCall = (method: string, endpoint: string, duration?: number, status?: number, meta?: any) => 
  logger.apiCall(method, endpoint, duration, status, meta);
export const logUserAction = (action: string, component?: string, meta?: any) => 
  logger.userAction(action, component, meta);
export const logPerformance = (operation: string, duration: number, meta?: any) => 
  logger.performance(operation, duration, meta);

// Default export
export default logger;
