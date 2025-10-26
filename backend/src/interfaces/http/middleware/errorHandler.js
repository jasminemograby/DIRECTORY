import { logger, createErrorResponse, classifyError } from '../../../config/logging.js';
import { config } from '../../../config/environment.js';

// Global error handler middleware
export const globalErrorHandler = (error, req, res, _next) => {
  // Log the error
  logger.error('Unhandled error', {
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

  // Classify the error
  const classification = classifyError(error);
  
  // Determine status code based on error type
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  
  switch (classification.type) {
    case 'validation':
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      break;
    case 'authentication':
      statusCode = 401;
      errorCode = 'UNAUTHORIZED';
      break;
    case 'authorization':
      statusCode = 403;
      errorCode = 'FORBIDDEN';
      break;
    case 'not_found':
      statusCode = 404;
      errorCode = 'NOT_FOUND';
      break;
    case 'duplicate':
      statusCode = 409;
      errorCode = 'DUPLICATE_ENTRY';
      break;
    case 'foreign_key':
      statusCode = 400;
      errorCode = 'INVALID_REFERENCE';
      break;
    case 'connection':
    case 'dns':
      statusCode = 503;
      errorCode = 'SERVICE_UNAVAILABLE';
      break;
    default:
      statusCode = 500;
      errorCode = 'INTERNAL_ERROR';
  }

  // Create error response
  const errorResponse = createErrorResponse(error, req);
  errorResponse.error.code = errorCode;

  // Send response
  res.status(statusCode).json(errorResponse);
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res) => {
  const errorResponse = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.url} not found`,
      code: 'NOT_FOUND',
      type: 'not_found',
      severity: 'low'
    },
    source: 'live',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  };

  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
export const validationErrorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const validationErrors = error.details.map(detail => detail.message);
    
    const errorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        type: 'validation',
        severity: 'low',
        details: validationErrors
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.warn('Validation error', {
      errors: validationErrors,
      method: req.method,
      url: req.url,
      body: req.body
    });

    return res.status(400).json(errorResponse);
  }
  
  next(error);
};

// Database error handler
export const databaseErrorHandler = (error, req, res, next) => {
  if (error.code && error.code.startsWith('ER_')) {
    let message = 'Database error occurred';
    let code = 'DATABASE_ERROR';
    let statusCode = 500;

    switch (error.code) {
      case 'ER_DUP_ENTRY':
        message = 'Duplicate entry found';
        code = 'DUPLICATE_ENTRY';
        statusCode = 409;
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        message = 'Referenced record not found';
        code = 'INVALID_REFERENCE';
        statusCode = 400;
        break;
      case 'ER_ROW_IS_REFERENCED_2':
        message = 'Cannot delete referenced record';
        code = 'REFERENCE_CONSTRAINT';
        statusCode = 400;
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        message = 'Database access denied';
        code = 'DATABASE_ACCESS_DENIED';
        statusCode = 503;
        break;
      case 'ER_BAD_DB_ERROR':
        message = 'Database not found';
        code = 'DATABASE_NOT_FOUND';
        statusCode = 503;
        break;
      case 'ER_CON_COUNT_ERROR':
        message = 'Too many database connections';
        code = 'DATABASE_CONNECTION_LIMIT';
        statusCode = 503;
        break;
    }

    const errorResponse = {
      success: false,
      error: {
        message,
        code,
        type: 'database',
        severity: 'high',
        details: config.NODE_ENV === 'development' ? error.message : undefined
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.error('Database error', {
      code: error.code,
      message: error.message,
      method: req.method,
      url: req.url,
      sql: config.NODE_ENV === 'development' ? error.sql : undefined
    });

    return res.status(statusCode).json(errorResponse);
  }
  
  next(error);
};

// External API error handler
export const externalAPIErrorHandler = (error, req, res, next) => {
  if (error.isAxiosError || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    let message = 'External service unavailable';
    let code = 'EXTERNAL_SERVICE_ERROR';
    let statusCode = 503;

    if (error.response) {
      // API responded with error status
      statusCode = error.response.status >= 500 ? 503 : 502;
      message = `External API error: ${error.response.status}`;
      code = 'EXTERNAL_API_ERROR';
    } else if (error.code === 'ECONNREFUSED') {
      message = 'External service connection refused';
      code = 'CONNECTION_REFUSED';
    } else if (error.code === 'ETIMEDOUT') {
      message = 'External service timeout';
      code = 'SERVICE_TIMEOUT';
    }

    const errorResponse = {
      success: false,
      error: {
        message,
        code,
        type: 'external_service',
        severity: 'high',
        details: config.NODE_ENV === 'development' ? error.message : undefined
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.error('External API error', {
      code: error.code,
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: req.method,
      endpoint: req.url
    });

    return res.status(statusCode).json(errorResponse);
  }
  
  next(error);
};

// Rate limiting error handler
export const rateLimitErrorHandler = (req, res) => {
  const errorResponse = {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      type: 'rate_limit',
      severity: 'medium'
    },
    source: 'live',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  };

  logger.warn('Rate limit exceeded', {
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent')
  });

  res.status(429).json(errorResponse);
};

// JWT error handler
export const jwtErrorHandler = (error, req, res, next) => {
  if (error.name === 'JsonWebTokenError') {
    const errorResponse = {
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
        type: 'authentication',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.warn('Invalid JWT token', {
      error: error.message,
      method: req.method,
      url: req.url,
      ip: req.ip
    });

    return res.status(401).json(errorResponse);
  }
  
  if (error.name === 'TokenExpiredError') {
    const errorResponse = {
      success: false,
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        type: 'authentication',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.warn('Expired JWT token', {
      expiredAt: error.expiredAt,
      method: req.method,
      url: req.url,
      ip: req.ip
    });

    return res.status(401).json(errorResponse);
  }
  
  next(error);
};

// CORS error handler
export const corsErrorHandler = (error, req, res, next) => {
  if (error.message && error.message.includes('CORS')) {
    const errorResponse = {
      success: false,
      error: {
        message: 'CORS policy violation',
        code: 'CORS_ERROR',
        type: 'cors',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.warn('CORS error', {
      error: error.message,
      origin: req.get('Origin'),
      method: req.method,
      url: req.url
    });

    return res.status(403).json(errorResponse);
  }
  
  next(error);
};

// Security error handler
export const securityErrorHandler = (error, req, res, next) => {
  if (error.name === 'SecurityError' || error.type === 'security') {
    const errorResponse = {
      success: false,
      error: {
        message: error.message || 'Security violation detected',
        code: 'SECURITY_ERROR',
        type: 'security',
        severity: 'high'
      },
      source: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown'
    };

    logger.error('Security error', {
      error: error.message,
      type: error.type,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json(errorResponse);
  }
  
  next(error);
};

// Health check error handler
export const healthCheckErrorHandler = (error, req, res, next) => {
  if (req.url === '/health' || req.url === '/health/detailed') {
    const errorResponse = {
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: config.NODE_ENV,
        error: error.message
      },
      source: 'live',
      message: 'Health check failed'
    };

    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });

    return res.status(503).json(errorResponse);
  }
  
  next(error);
};
