import jwt from 'jsonwebtoken';
import { config } from '../../../config/environment.js';
import { logger, logSecurityEvent } from '../../../config/logging.js';

// JWT token validation middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logSecurityEvent('MISSING_TOKEN', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent')
    });

    return res.status(401).json({ 
      success: false,
      error: { 
        message: 'Access token required',
        code: 'UNAUTHORIZED',
        type: 'authentication',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      logSecurityEvent('INVALID_TOKEN', {
        ip: req.ip,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        error: err.message
      });

      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Invalid or expired token',
          code: 'FORBIDDEN',
          type: 'authentication',
          severity: 'medium'
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logSecurityEvent('INSUFFICIENT_PERMISSIONS', {
        userId: req.user?.id,
        userRole: req.user?.role,
        requiredRoles: roles,
        ip: req.ip,
        method: req.method,
        url: req.url
      });

      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Insufficient permissions',
          code: 'FORBIDDEN',
          type: 'authorization',
          severity: 'medium'
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

// Company-based data isolation middleware
export const validateCompanyAccess = (req, res, next) => {
  const companyId = req.headers['x-company-id'];
  const userCompanyId = req.user?.companyId;

  if (!companyId) {
    logSecurityEvent('MISSING_COMPANY_ID', {
      userId: req.user?.id,
      ip: req.ip,
      method: req.method,
      url: req.url
    });

    return res.status(400).json({ 
      success: false,
      error: { 
        message: 'Company ID header required',
        code: 'BAD_REQUEST',
        type: 'validation',
        severity: 'low'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }

  if (userCompanyId && companyId !== userCompanyId) {
    logSecurityEvent('COMPANY_ACCESS_VIOLATION', {
      userId: req.user?.id,
      userCompanyId,
      requestedCompanyId: companyId,
      ip: req.ip,
      method: req.method,
      url: req.url
    });

    return res.status(403).json({ 
      success: false,
      error: { 
        message: 'Access denied to company data',
        code: 'FORBIDDEN',
        type: 'authorization',
        severity: 'high'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }

  req.companyId = companyId;
  next();
};

// Resource ownership validation middleware
export const validateResourceOwnership = (resourceType) => {
  return (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // HR admins can access all resources
    if (userRole === 'hr_admin') {
      return next();
    }

    // Managers can access resources in their department
    if (userRole === 'manager') {
      // Add department validation logic here
      return next();
    }

    // Team leads can access resources in their team
    if (userRole === 'team_lead') {
      // Add team validation logic here
      return next();
    }

    // Employees can only access their own resources
    if (userRole === 'employee') {
      if (resourceId !== userId) {
        logSecurityEvent('RESOURCE_ACCESS_VIOLATION', {
          userId,
          resourceType,
          resourceId,
          ip: req.ip,
          method: req.method,
          url: req.url
        });

        return res.status(403).json({ 
          success: false,
          error: { 
            message: `Access denied to ${resourceType}`,
            code: 'FORBIDDEN',
            type: 'authorization',
            severity: 'medium'
          },
          source: 'live',
          timestamp: new Date().toISOString()
        });
      }
    }

    next();
  };
};

// API key validation middleware (for external services)
export const validateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ 
      success: false,
      error: { 
        message: 'API key required',
        code: 'UNAUTHORIZED',
        type: 'authentication',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }

  // Validate API key against configured keys
  const validAPIKeys = config.API_KEYS ? config.API_KEYS.split(',') : [];
  
  if (!validAPIKeys.includes(apiKey)) {
    logSecurityEvent('INVALID_API_KEY', {
      apiKey: apiKey.substring(0, 8) + '...',
      ip: req.ip,
      method: req.method,
      url: req.url
    });

    return res.status(403).json({ 
      success: false,
      error: { 
        message: 'Invalid API key',
        code: 'FORBIDDEN',
        type: 'authentication',
        severity: 'medium'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// IP whitelist middleware
export const ipWhitelist = (allowedIPs) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      logSecurityEvent('IP_WHITELIST_VIOLATION', {
        ip: clientIP,
        allowedIPs,
        method: req.method,
        url: req.url
      });

      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Access denied from this IP',
          code: 'FORBIDDEN',
          type: 'authorization',
          severity: 'high'
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  };
};

// Request size validation middleware
export const validateRequestSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = req.get('content-length');
    
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);
      
      if (sizeInBytes > maxSizeInBytes) {
        logSecurityEvent('REQUEST_SIZE_EXCEEDED', {
          size: contentLength,
          maxSize,
          ip: req.ip,
          method: req.method,
          url: req.url
        });

        return res.status(413).json({ 
          success: false,
          error: { 
            message: 'Request size too large',
            code: 'PAYLOAD_TOO_LARGE',
            type: 'validation',
            severity: 'low'
          },
          source: 'live',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    next();
  };
};

// Helper function to parse size strings
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  
  if (!match) {
    return 0;
  }
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return value * units[unit];
}

// Audit logging middleware
export const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log audit event after response is sent
      logger.info('Audit event', {
        action,
        userId: req.user?.id,
        companyId: req.companyId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseSize: data.length,
        timestamp: new Date().toISOString()
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Request ID middleware
export const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
};
