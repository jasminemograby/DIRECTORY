import { logger } from '../../../config/logging.js';

export class BaseController {
  constructor() {
    this.logger = logger;
  }

  // Standardized success response
  successResponse(data, source = 'live', message = 'Success') {
    return {
      success: true,
      data,
      source,
      message,
      timestamp: new Date().toISOString()
    };
  }

  // Standardized error response
  errorResponse(error, source = 'live', _statusCode = 500) {
    const errorMessage = error.message || 'Internal server error';
    const errorCode = error.code || 'INTERNAL_ERROR';
    
    return {
      success: false,
      error: {
        message: errorMessage,
        code: errorCode,
        type: error.type || 'unknown',
        severity: error.severity || 'high'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Async error handler wrapper
  handleAsync(asyncFn, _req, _res) {
    return async (req, res, next) => {
      try {
        await asyncFn(req, res);
      } catch (error) {
        this.logger.error('Controller error', {
          error: error.message,
          stack: error.stack,
          method: req.method,
          url: req.url,
          userId: req.user?.id,
          companyId: req.companyId
        });
        next(error);
      }
    };
  }

  // Validation error response
  validationErrorResponse(errors, source = 'live') {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        type: 'validation',
        severity: 'low',
        details: errors
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Not found error response
  notFoundResponse(resource, source = 'live') {
    return {
      success: false,
      error: {
        message: `${resource} not found`,
        code: 'NOT_FOUND',
        type: 'not_found',
        severity: 'low'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Unauthorized error response
  unauthorizedResponse(message = 'Unauthorized access', source = 'live') {
    return {
      success: false,
      error: {
        message,
        code: 'UNAUTHORIZED',
        type: 'authentication',
        severity: 'medium'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Forbidden error response
  forbiddenResponse(message = 'Access forbidden', source = 'live') {
    return {
      success: false,
      error: {
        message,
        code: 'FORBIDDEN',
        type: 'authorization',
        severity: 'medium'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Conflict error response
  conflictResponse(message = 'Resource conflict', source = 'live') {
    return {
      success: false,
      error: {
        message,
        code: 'CONFLICT',
        type: 'conflict',
        severity: 'medium'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Service unavailable error response
  serviceUnavailableResponse(message = 'Service temporarily unavailable', source = 'live') {
    return {
      success: false,
      error: {
        message,
        code: 'SERVICE_UNAVAILABLE',
        type: 'service_unavailable',
        severity: 'high'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Rate limit error response
  rateLimitResponse(message = 'Too many requests', source = 'live') {
    return {
      success: false,
      error: {
        message,
        code: 'RATE_LIMIT_EXCEEDED',
        type: 'rate_limit',
        severity: 'medium'
      },
      source,
      timestamp: new Date().toISOString()
    };
  }

  // Pagination response
  paginatedResponse(data, pagination, source = 'live', message = 'Success') {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      },
      source,
      message,
      timestamp: new Date().toISOString()
    };
  }

  // Log controller action
  logAction(action, details = {}) {
    this.logger.info('Controller action', {
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Log controller error
  logError(action, error, details = {}) {
    this.logger.error('Controller error', {
      action,
      error: error.message,
      stack: error.stack,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Validate request parameters
  validateParams(params, requiredParams) {
    const missingParams = requiredParams.filter(param => !params[param]);
    
    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }
  }

  // Validate request body
  validateBody(body, requiredFields) {
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  // Sanitize input data
  sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }

  // Extract pagination parameters
  extractPagination(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  // Extract sorting parameters
  extractSorting(query) {
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    
    return { sortBy, sortOrder };
  }

  // Extract filtering parameters
  extractFilters(query, allowedFilters) {
    const filters = {};
    
    for (const filter of allowedFilters) {
      if (query[filter] !== undefined) {
        filters[filter] = query[filter];
      }
    }
    
    return filters;
  }

  // Format response data
  formatResponseData(data, fields = []) {
    if (!data) return null;
    
    if (Array.isArray(data)) {
      return data.map(item => this.formatResponseData(item, fields));
    }
    
    if (fields.length > 0) {
      const formatted = {};
      for (const field of fields) {
        if (data[field] !== undefined) {
          formatted[field] = data[field];
        }
      }
      return formatted;
    }
    
    return data;
  }

  // Calculate response time
  calculateResponseTime(startTime) {
    return Date.now() - startTime;
  }

  // Set response headers
  setResponseHeaders(res, additionalHeaders = {}) {
    res.set({
      'Content-Type': 'application/json',
      'X-Response-Time': `${this.calculateResponseTime(res.startTime)}ms`,
      ...additionalHeaders
    });
  }
}
