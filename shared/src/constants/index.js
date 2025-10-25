// Application constants
export const APP_CONFIG = {
  NAME: 'Directory Microservice',
  VERSION: '1.0.0',
  DESCRIPTION: 'B2B SaaS corporate learning platform organizational backbone microservice',
  AUTHOR: 'Your Organization',
  LICENSE: 'MIT'
};

// API Configuration
export const API_CONFIG = {
  VERSION: 'v1',
  BASE_PATH: '/api/v1',
  TIMEOUT: 30000,
  MAX_RETRIES: 3
};

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_POOL_SIZE: 10,
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 30000,
  MAX_RETRIES: 3
};

// Authentication & Security
export const AUTH_CONFIG = {
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000 // 15 minutes
};

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 900000, // 15 minutes
  MAX_REQUESTS: 100,
  SKIP_SUCCESSFUL_REQUESTS: false,
  SKIP_FAILED_REQUESTS: false
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  UPLOAD_PATH: './uploads',
  TEMP_PATH: './temp'
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

// Status Codes
export const STATUS = {
  // Employee Status
  EMPLOYEE: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    TERMINATED: 'terminated',
    ON_LEAVE: 'on_leave'
  },
  
  // Training Request Status
  TRAINING_REQUEST: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    IN_PROGRESS: 'in_progress'
  },
  
  // Trainer Status
  TRAINER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING_APPROVAL: 'pending_approval'
  },
  
  // Company Status
  COMPANY: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    TRIAL: 'trial'
  }
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Employment Types
export const EMPLOYMENT_TYPE = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERN: 'intern',
  FREELANCE: 'freelance'
};

// Trainer Types
export const TRAINER_TYPE = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
  FREELANCE: 'freelance'
};

// Teaching Modes
export const TEACHING_MODE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
};

// Skill Levels
export const SKILL_LEVEL = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert'
};

// Course Levels
export const COURSE_LEVEL = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert'
};

// External API Endpoints
export const EXTERNAL_APIS = {
  LINKEDIN: {
    BASE_URL: 'https://api.linkedin.com/v2',
    ENDPOINTS: {
      PROFILE: '/people/~',
      SKILLS: '/people/~/skills'
    }
  },
  GITHUB: {
    BASE_URL: 'https://api.github.com',
    ENDPOINTS: {
      USER: '/user',
      REPOS: '/user/repos',
      SKILLS: '/user/repos'
    }
  },
  ORCID: {
    BASE_URL: 'https://pub.orcid.org/v3.0',
    ENDPOINTS: {
      PERSON: '/person',
      WORKS: '/works'
    }
  },
  CREDLY: {
    BASE_URL: 'https://api.credly.com/v1',
    ENDPOINTS: {
      BADGES: '/badges',
      MEMBERS: '/members'
    }
  },
  GEMINI: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    ENDPOINTS: {
      GENERATE: '/models/gemini-pro:generateContent'
    }
  }
};

// Internal Microservice URLs
export const INTERNAL_SERVICES = {
  AUTH: 'http://localhost:3002',
  SKILLS_ENGINE: 'http://localhost:3003',
  MARKETPLACE: 'http://localhost:3004',
  CONTENT_STUDIO: 'http://localhost:3005',
  COURSE_BUILDER: 'http://localhost:3006',
  DEVLAB: 'http://localhost:3007',
  LEARNING_ANALYTICS: 'http://localhost:3008',
  CCA: 'http://localhost:3009',
  ASSESSMENT: 'http://localhost:3010',
  SENDPULSE: 'http://localhost:3011',
  SENDGRID: 'http://localhost:3012'
};

// Error Messages
export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_ENTRY: 'Duplicate entry',
  
  // Authentication
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  ACCOUNT_LOCKED: 'Account locked',
  
  // Database
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  DATABASE_QUERY_ERROR: 'Database query error',
  RECORD_NOT_FOUND: 'Record not found',
  
  // External APIs
  EXTERNAL_API_ERROR: 'External API error',
  API_RATE_LIMIT_EXCEEDED: 'API rate limit exceeded',
  API_TIMEOUT: 'API request timeout',
  
  // File Upload
  FILE_TOO_LARGE: 'File too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  OPERATION_COMPLETED: 'Operation completed successfully'
};

// Logging Levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Environment Types
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Data Sources
export const DATA_SOURCES = {
  LIVE: 'live',
  MOCK: 'mock'
};

// Response Sources
export const RESPONSE_SOURCES = {
  LIVE: 'live',
  MOCK: 'mock',
  CACHE: 'cache'
};
