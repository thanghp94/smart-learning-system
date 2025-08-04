// Security middleware for input sanitization and basic rate limiting
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

// Simple in-memory rate limiting store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    logger.error('Input sanitization error', { error, url: req.url });
    res.status(400).json({ error: 'Invalid input data' });
  }
};

// Recursive object sanitization
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  return obj;
}

// String sanitization
function sanitizeString(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    // Remove potential XSS patterns
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove potential SQL injection patterns
    .replace(/('|(\\')|(;)|(\\)|(\/\*)|(--)|(\*\/))/g, '')
    // Trim whitespace
    .trim();
}

// Simple rate limiting middleware
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    rateLimitStore.forEach((entry, ip) => {
      if (now > entry.resetTime) {
        rateLimitStore.delete(ip);
      }
    });

    let entry = rateLimitStore.get(key);
    
    if (!entry) {
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
      return next();
    }

    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
      return next();
    }

    if (entry.count >= max) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.url,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(429).json({
        error: 'Too many requests',
        message: message || 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round((entry.resetTime - now) / 1000)
      });
    }

    entry.count++;
    next();
  };
};

// Different rate limits for different endpoints
export const rateLimits = {
  // General API rate limit
  api: createRateLimit(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  
  // Stricter limit for authentication endpoints
  auth: createRateLimit(15 * 60 * 1000, 5), // 5 requests per 15 minutes
  
  // More lenient for read operations
  read: createRateLimit(15 * 60 * 1000, 200), // 200 requests per 15 minutes
  
  // Stricter for write operations
  write: createRateLimit(15 * 60 * 1000, 50), // 50 requests per 15 minutes
  
  // Very strict for sensitive operations
  sensitive: createRateLimit(60 * 60 * 1000, 10), // 10 requests per hour
  
  // File upload limits
  upload: createRateLimit(60 * 60 * 1000, 20) // 20 uploads per hour
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Strict transport security (HTTPS only)
  if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Request size limits
export const requestSizeLimits = {
  // General JSON limit
  json: '10mb',
  
  // URL encoded data limit
  urlencoded: '10mb',
  
  // File upload limit
  fileUpload: '50mb'
};

// IP whitelist middleware (for admin endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || '';
    
    if (allowedIPs.includes(clientIP) || allowedIPs.includes('*')) {
      next();
    } else {
      logger.warn('IP blocked', { ip: clientIP, url: req.url });
      res.status(403).json({ error: 'Access denied' });
    }
  };
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious patterns in URL
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /\/etc\/passwd/,  // System file access
    /\/proc\//,  // Process information
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /drop.*table/i,  // SQL injection
    /exec\(/i,  // Code execution
    /eval\(/i   // Code execution
  ];

  const url = req.url.toLowerCase();
  const userAgent = req.get('User-Agent') || '';

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      logger.warn('Suspicious request detected', {
        ip: req.ip,
        url: req.url,
        userAgent,
        pattern: pattern.toString()
      });
      
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  // Check for excessively long URLs
  if (req.url.length > 2048) {
    logger.warn('Excessively long URL', { ip: req.ip, urlLength: req.url.length });
    return res.status(414).json({ error: 'URL too long' });
  }

  next();
};

// Honeypot middleware (trap for bots)
export const honeypot = (req: Request, res: Response, next: NextFunction) => {
  // Check for honeypot field in POST requests
  if (req.method === 'POST' && req.body && req.body.honeypot) {
    logger.warn('Honeypot triggered', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      honeypotValue: req.body.honeypot
    });
    
    // Respond normally but don't process the request
    return res.status(200).json({ success: true });
  }

  next();
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length')
    };

    // Log suspicious activity
    if (res.statusCode >= 400) {
      logger.warn('HTTP error response', logData);
    } else if (duration > 5000) {
      logger.warn('Slow request', logData);
    } else {
      logger.info('Request processed', logData);
    }
  });

  next();
};

// Export all security middleware
export const securityMiddleware = {
  sanitizeInput,
  securityHeaders,
  validateRequest,
  honeypot,
  securityLogger,
  rateLimits,
  corsOptions,
  requestSizeLimits,
  ipWhitelist
};

export default securityMiddleware;
