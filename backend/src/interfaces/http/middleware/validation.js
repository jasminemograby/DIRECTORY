import Joi from 'joi';
import { logger } from '../../../config/logging.js';

// Company validation schema
export const companySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  industry: Joi.string().min(2).max(100).required(),
  size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+').required(),
  description: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional(),
  logo: Joi.string().uri().optional(),
  headquarters: Joi.object({
    address: Joi.string().max(500).optional(),
    country: Joi.string().max(100).optional(),
    timezone: Joi.string().max(50).optional()
  }).optional(),
  foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  kpis: Joi.object().optional()
});

// Employee validation schema
export const employeeSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional(),
  employeeId: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('hr_admin', 'manager', 'team_lead', 'employee', 'trainer').required(),
  jobTitle: Joi.string().min(2).max(255).required(),
  level: Joi.string().valid('junior', 'mid', 'senior', 'lead', 'principal').optional(),
  careerPath: Joi.string().max(100).optional(),
  hireDate: Joi.date().max('now').required(),
  location: Joi.string().max(255).optional(),
  careerGoal: Joi.string().max(1000).optional(),
  experienceYears: Joi.number().integer().min(0).max(50).optional(),
  skills: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
      verified: Joi.boolean().optional(),
      source: Joi.string().optional(),
      yearsExperience: Joi.number().integer().min(0).optional(),
      lastUpdated: Joi.date().optional()
    })
  ).optional(),
  competences: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      subCompetences: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          skills: Joi.array().items(
            Joi.object({
              name: Joi.string().required(),
              verified: Joi.boolean().optional(),
              source: Joi.string().optional(),
              lastUpdated: Joi.date().optional(),
              level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
              yearsExperience: Joi.number().integer().min(0).optional()
            })
          ).optional()
        })
      ).optional()
    })
  ).optional(),
  externalProfiles: Joi.object({
    linkedin: Joi.string().uri().optional(),
    github: Joi.string().optional(),
    credly: Joi.string().uri().optional(),
    orcid: Joi.string().optional(),
    youtube: Joi.string().uri().optional()
  }).optional(),
  enrichmentStatus: Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'failed').optional(),
    lastEnriched: Joi.date().optional(),
    sources: Joi.array().items(Joi.string()).optional()
  }).optional()
});

// Skills validation schema
export const skillsSchema = Joi.object({
  skills: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
      verified: Joi.boolean().optional(),
      source: Joi.string().optional(),
      yearsExperience: Joi.number().integer().min(0).optional(),
      lastUpdated: Joi.date().optional()
    })
  ).required()
});

// Trainer validation schema
export const trainerSchema = Joi.object({
  employeeId: Joi.string().required(),
  companyId: Joi.string().required(),
  trainerType: Joi.string().valid('internal', 'external').required(),
  teachingMode: Joi.array().items(
    Joi.string().valid('online', 'offline', 'blended')
  ).min(1).required(),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuer: Joi.string().required(),
      issuedDate: Joi.date().max('now').required(),
      expiryDate: Joi.date().min(Joi.ref('issuedDate')).optional(),
      credentialId: Joi.string().optional()
    })
  ).optional(),
  languages: Joi.array().items(Joi.string()).min(1).required(),
  availability: Joi.object({
    timezone: Joi.string().required(),
    schedule: Joi.object().pattern(
      Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      Joi.array().items(Joi.string().pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/))
    ).required()
  }).required(),
  pricing: Joi.object({
    hourlyRate: Joi.number().min(0).required(),
    currency: Joi.string().length(3).required(),
    minimumHours: Joi.number().integer().min(1).optional()
  }).required(),
  aiEditingEnabled: Joi.boolean().optional(),
  publishPermission: Joi.string().valid('internal', 'system_wide').optional()
});

// Certifications validation schema
export const certificationsSchema = Joi.object({
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuer: Joi.string().required(),
      issuedDate: Joi.date().max('now').required(),
      expiryDate: Joi.date().min(Joi.ref('issuedDate')).optional(),
      credentialId: Joi.string().optional()
    })
  ).required()
});

// Availability validation schema
export const availabilitySchema = Joi.object({
  availability: Joi.object({
    timezone: Joi.string().required(),
    schedule: Joi.object().pattern(
      Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      Joi.array().items(Joi.string().pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/))
    ).required()
  }).required()
});

// Training request validation schema
export const trainingRequestSchema = Joi.object({
  companyId: Joi.string().required(),
  requesterId: Joi.string().required(),
  employeeId: Joi.string().optional(),
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(10).max(2000).required(),
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').required(),
  skillCategories: Joi.array().items(Joi.string()).min(1).required(),
  targetLevel: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
  preferredMode: Joi.string().valid('online', 'offline', 'blended').optional(),
  startDate: Joi.date().min('now').optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  estimatedDuration: Joi.number().integer().min(1).max(1000).optional(),
  budget: Joi.number().min(0).optional()
});

// Approval validation schema
export const approvalSchema = Joi.object({
  comments: Joi.string().max(1000).optional()
});

// Rejection validation schema
export const rejectionSchema = Joi.object({
  reason: Joi.string().min(10).max(1000).required()
});

// Assignment validation schema
export const assignmentSchema = Joi.object({
  trainerId: Joi.string().required()
});

// Enrichment validation schema
export const enrichmentSchema = Joi.object({
  sources: Joi.array().items(
    Joi.string().valid('linkedin', 'github', 'credly', 'gemini', 'orcid', 'youtube')
  ).min(1).required()
});

// Generic validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation error', {
        errors,
        method: req.method,
        url: req.url,
        body: req.body
      });

      return res.status(400).json({ 
        success: false,
        error: { 
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          type: 'validation',
          severity: 'low',
          details: errors
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    
    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Query parameter validation middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Query validation error', {
        errors,
        method: req.method,
        url: req.url,
        query: req.query
      });

      return res.status(400).json({ 
        success: false,
        error: { 
          message: 'Query validation failed',
          code: 'VALIDATION_ERROR',
          type: 'validation',
          severity: 'low',
          details: errors
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    
    // Replace request query with validated and sanitized data
    req.query = value;
    next();
  };
};

// Path parameter validation middleware
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Params validation error', {
        errors,
        method: req.method,
        url: req.url,
        params: req.params
      });

      return res.status(400).json({ 
        success: false,
        error: { 
          message: 'Parameter validation failed',
          code: 'VALIDATION_ERROR',
          type: 'validation',
          severity: 'low',
          details: errors
        },
        source: 'live',
        timestamp: new Date().toISOString()
      });
    }
    
    // Replace request params with validated and sanitized data
    req.params = value;
    next();
  };
};

// Common query schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const searchSchema = Joi.object({
  search: Joi.string().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

export const companyFilterSchema = Joi.object({
  industry: Joi.string().optional(),
  size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+').optional()
});

export const employeeFilterSchema = Joi.object({
  departmentId: Joi.string().optional(),
  teamId: Joi.string().optional(),
  role: Joi.string().valid('hr_admin', 'manager', 'team_lead', 'employee', 'trainer').optional(),
  level: Joi.string().valid('junior', 'mid', 'senior', 'lead', 'principal').optional()
});

export const trainerFilterSchema = Joi.object({
  trainerType: Joi.string().valid('internal', 'external').optional(),
  skills: Joi.string().optional(), // Comma-separated skills
  teachingMode: Joi.string().optional() // Comma-separated modes
});

export const trainingRequestFilterSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled').optional(),
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').optional(),
  requesterId: Joi.string().optional()
});

// UUID validation schema
export const uuidSchema = Joi.string().uuid().required();

// Email validation schema
export const emailSchema = Joi.string().email().required();

// URL validation schema
export const urlSchema = Joi.string().uri().required();

// Date range validation schema
export const dateRangeSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional()
});

// File upload validation schema
export const fileUploadSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'application/pdf').required(),
  size: Joi.number().max(5 * 1024 * 1024).required() // 5MB max
});

// Custom validation functions
export const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validatePhone = (value) => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(value);
};

export const validateURL = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const validateTimeRange = (value) => {
  const timeRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
  return timeRegex.test(value);
};

// Sanitization functions
export const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

export const sanitizeHTML = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '');
};

export const sanitizeSQL = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/[';-]/g, '');
};

export const sanitizeXSS = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
