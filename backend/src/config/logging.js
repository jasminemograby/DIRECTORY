import winston from 'winston';
import { config } from './environment.js';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'directory-backend',
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transports
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom logging methods
export const logRequest = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    companyId: req.companyId
  });
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      companyId: req.companyId
    });
  });
  
  next();
};

export const logError = (error, req, res, next) => {
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id,
    companyId: req.companyId,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  next(error);
};

export const logSecurityEvent = (event, details) => {
  logger.warn('Security event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export const logAuditEvent = (action, details) => {
  logger.info('Audit event', {
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export const logPerformance = (operation, duration, details = {}) => {
  const level = duration > 1000 ? 'warn' : 'info';
  logger[level]('Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...details
  });
};

export const logDatabaseOperation = (operation, table, duration, details = {}) => {
  logger.debug('Database operation', {
    operation,
    table,
    duration: `${duration}ms`,
    ...details
  });
};

export const logExternalAPI = (service, operation, duration, success, details = {}) => {
  const level = success ? 'info' : 'warn';
  logger[level]('External API call', {
    service,
    operation,
    duration: `${duration}ms`,
    success,
    ...details
  });
};

export const logMockFallback = (service, operation, reason, details = {}) => {
  logger.warn('Mock fallback activated', {
    service,
    operation,
    reason,
    ...details
  });
};

// Error classification
export const classifyError = (error) => {
  if (error.name === 'ValidationError') {
    return { type: 'validation', severity: 'low' };
  }
  
  if (error.name === 'UnauthorizedError') {
    return { type: 'authentication', severity: 'medium' };
  }
  
  if (error.name === 'ForbiddenError') {
    return { type: 'authorization', severity: 'medium' };
  }
  
  if (error.name === 'NotFoundError') {
    return { type: 'not_found', severity: 'low' };
  }
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return { type: 'connection', severity: 'high' };
  }
  
  if (error.code === 'ENOTFOUND') {
    return { type: 'dns', severity: 'high' };
  }
  
  if (error.code === 'ER_DUP_ENTRY') {
    return { type: 'duplicate', severity: 'medium' };
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return { type: 'foreign_key', severity: 'medium' };
  }
  
  return { type: 'unknown', severity: 'high' };
};

// Structured error response
export const createErrorResponse = (error, req) => {
  const classification = classifyError(error);
  
  const errorResponse = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      type: classification.type,
      severity: classification.severity
    },
    source: 'live',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  };
  
  // Add stack trace in development
  if (config.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
  }
  
  // Add additional details for specific error types
  if (error.details) {
    errorResponse.error.details = error.details;
  }
  
  if (error.validation) {
    errorResponse.error.validation = error.validation;
  }
  
  return errorResponse;
};

// Health check logging
export const logHealthCheck = (status, details = {}) => {
  const level = status === 'healthy' ? 'info' : 'warn';
  logger[level]('Health check', {
    status,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Rate limiting logging
export const logRateLimit = (ip, endpoint, limit, remaining) => {
  logger.warn('Rate limit warning', {
    ip,
    endpoint,
    limit,
    remaining,
    timestamp: new Date().toISOString()
  });
};

// Database connection logging
export const logDatabaseConnection = (status, details = {}) => {
  const level = status === 'connected' ? 'info' : 'error';
  logger[level]('Database connection', {
    status,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// External service logging
export const logExternalService = (service, status, details = {}) => {
  const level = status === 'healthy' ? 'info' : 'warn';
  logger[level]('External service status', {
    service,
    status,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export default logger;
