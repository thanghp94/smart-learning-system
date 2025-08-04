// Health check and monitoring endpoints
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { logger } from '../middleware/logger';
import { apiCache } from '../../client/src/lib/cache';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    cache?: ServiceHealth;
    memory: MemoryHealth;
    disk?: DiskHealth;
  };
  metrics?: SystemMetrics;
}

interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  lastCheck: string;
}

interface MemoryHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  used: number;
  total: number;
  percentage: number;
  heap: {
    used: number;
    total: number;
  };
}

interface DiskHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  free: number;
  total: number;
  percentage: number;
}

interface SystemMetrics {
  requests: {
    total: number;
    errors: number;
    averageResponseTime: number;
  };
  database: {
    connections: number;
    queries: number;
    slowQueries: number;
  };
}

// In-memory metrics storage (in production, use Redis or similar)
const metrics = {
  requests: {
    total: 0,
    errors: 0,
    totalResponseTime: 0,
    slowRequests: 0
  },
  database: {
    connections: 0,
    queries: 0,
    slowQueries: 0
  },
  startTime: Date.now()
};

// Middleware to track metrics
const metricsMiddleware = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  metrics.requests.total++;
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.requests.totalResponseTime += duration;
    
    if (res.statusCode >= 400) {
      metrics.requests.errors++;
    }
    
    if (duration > 1000) {
      metrics.requests.slowRequests++;
    }
  });
  
  next();
};

// Check database health
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    await db.execute('SELECT 1');
    const responseTime = Date.now() - startTime;
    
    metrics.database.queries++;
    if (responseTime > 1000) {
      metrics.database.slowQueries++;
    }
    
    return {
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      responseTime,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Database health check failed', { error });
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      lastCheck: new Date().toISOString()
    };
  }
}

// Check memory health
function checkMemoryHealth(): MemoryHealth {
  const memUsage = process.memoryUsage();
  const totalMemory = require('os').totalmem();
  const freeMemory = require('os').freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryPercentage = (usedMemory / totalMemory) * 100;
  
  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
  if (memoryPercentage > 90) {
    status = 'unhealthy';
  } else if (memoryPercentage > 80) {
    status = 'degraded';
  }
  
  return {
    status,
    used: usedMemory,
    total: totalMemory,
    percentage: memoryPercentage,
    heap: {
      used: memUsage.heapUsed,
      total: memUsage.heapTotal
    }
  };
}

// Check disk health (simplified)
function checkDiskHealth(): DiskHealth {
  try {
    const fs = require('fs');
    const stats = fs.statSync('.');
    
    // This is a simplified check - in production, use proper disk space checking
    return {
      status: 'healthy',
      free: 0,
      total: 0,
      percentage: 0
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      free: 0,
      total: 0,
      percentage: 100
    };
  }
}

// Basic health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const memoryHealth = checkMemoryHealth();
    
    const overallStatus = dbHealth.status === 'unhealthy' || memoryHealth.status === 'unhealthy' 
      ? 'unhealthy' 
      : (dbHealth.status === 'degraded' || memoryHealth.status === 'degraded' ? 'degraded' : 'healthy');
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth,
        memory: memoryHealth
      }
    };
    
    const statusCode = overallStatus === 'healthy' ? 200 : (overallStatus === 'degraded' ? 200 : 503);
    res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Detailed health check with metrics
router.get('/health/detailed', async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const memoryHealth = checkMemoryHealth();
    const diskHealth = checkDiskHealth();
    
    const overallStatus = [dbHealth.status, memoryHealth.status, diskHealth.status].includes('unhealthy')
      ? 'unhealthy' 
      : ([dbHealth.status, memoryHealth.status, diskHealth.status].includes('degraded') ? 'degraded' : 'healthy');
    
    const systemMetrics: SystemMetrics = {
      requests: {
        total: metrics.requests.total,
        errors: metrics.requests.errors,
        averageResponseTime: metrics.requests.total > 0 
          ? metrics.requests.totalResponseTime / metrics.requests.total 
          : 0
      },
      database: {
        connections: metrics.database.connections,
        queries: metrics.database.queries,
        slowQueries: metrics.database.slowQueries
      }
    };
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth,
        memory: memoryHealth,
        disk: diskHealth
      },
      metrics: systemMetrics
    };
    
    const statusCode = overallStatus === 'healthy' ? 200 : (overallStatus === 'degraded' ? 200 : 503);
    res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    logger.error('Detailed health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    });
  }
});

// Readiness check (for Kubernetes)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    if (dbHealth.status === 'unhealthy') {
      return res.status(503).json({
        ready: false,
        reason: 'Database not available'
      });
    }
    
    res.json({
      ready: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Readiness check failed', { error });
    res.status(503).json({
      ready: false,
      reason: 'Readiness check failed'
    });
  }
});

// Liveness check (for Kubernetes)
router.get('/live', (req: Request, res: Response) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint (Prometheus format)
router.get('/metrics', (req: Request, res: Response) => {
  const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.requests.total}

# HELP http_request_errors_total Total number of HTTP request errors
# TYPE http_request_errors_total counter
http_request_errors_total ${metrics.requests.errors}

# HELP http_request_duration_ms Average HTTP request duration in milliseconds
# TYPE http_request_duration_ms gauge
http_request_duration_ms ${metrics.requests.total > 0 ? metrics.requests.totalResponseTime / metrics.requests.total : 0}

# HELP database_queries_total Total number of database queries
# TYPE database_queries_total counter
database_queries_total ${metrics.database.queries}

# HELP database_slow_queries_total Total number of slow database queries
# TYPE database_slow_queries_total counter
database_slow_queries_total ${metrics.database.slowQueries}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${process.uptime()}

# HELP nodejs_memory_heap_used_bytes Node.js heap memory used in bytes
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${process.memoryUsage().heapUsed}

# HELP nodejs_memory_heap_total_bytes Node.js heap memory total in bytes
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${process.memoryUsage().heapTotal}
`.trim();

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics);
});

// System info endpoint
router.get('/info', (req: Request, res: Response) => {
  const os = require('os');
  
  res.json({
    application: {
      name: 'Smart Learning System',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAverage: os.loadavg()
    },
    process: {
      pid: process.pid,
      memory: process.memoryUsage(),
      versions: process.versions
    }
  });
});

// Reset metrics endpoint (for testing)
if (process.env.NODE_ENV === 'development') {
  router.post('/metrics/reset', (req: Request, res: Response) => {
    metrics.requests = {
      total: 0,
      errors: 0,
      totalResponseTime: 0,
      slowRequests: 0
    };
    metrics.database = {
      connections: 0,
      queries: 0,
      slowQueries: 0
    };
    metrics.startTime = Date.now();
    
    res.json({ message: 'Metrics reset successfully' });
  });
}

export { router as healthRouter, metrics, metricsMiddleware };
export default router;
