import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Default configuration
const defaultConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3001,
  HOST: process.env.HOST || '0.0.0.0',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/directory_test',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || 'directory_test',
  DB_USER: process.env.DB_USER || 'test',
  DB_PASSWORD: process.env.DB_PASSWORD || 'test',
  DB_SSL: process.env.DB_SSL === 'true',
  
  // Redis Configuration
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  
  // Authentication & Security
  JWT_SECRET: process.env.JWT_SECRET || 'local-development-jwt-secret-key-32-chars-minimum',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'local-development-encryption-key-32-chars',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  
  // Mock Data Configuration
  USE_MOCK: process.env.USE_MOCK === 'true' || process.env.NODE_ENV === 'development',
  MOCK_DATA_PATH: process.env.MOCK_DATA_PATH || './database/mocks',
  
  // CORS Configuration
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true' || true,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',
  
  // Monitoring & Health Checks
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
  METRICS_ENABLED: process.env.METRICS_ENABLED === 'true' || true,
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // External API Configuration
  LINKEDIN_API_KEY: process.env.LINKEDIN_API_KEY || '',
  GITHUB_API_KEY: process.env.GITHUB_API_KEY || '',
  ORCID_API_KEY: process.env.ORCID_API_KEY || '',
  CREDLY_API_KEY: process.env.CREDLY_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // Internal Microservice URLs
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  SKILLS_ENGINE_URL: process.env.SKILLS_ENGINE_URL || 'http://localhost:3003',
  MARKETPLACE_URL: process.env.MARKETPLACE_URL || 'http://localhost:3004',
  CONTENT_STUDIO_URL: process.env.CONTENT_STUDIO_URL || 'http://localhost:3005',
  COURSE_BUILDER_URL: process.env.COURSE_BUILDER_URL || 'http://localhost:3006',
  DEVLAB_URL: process.env.DEVLAB_URL || 'http://localhost:3007',
  LEARNING_ANALYTICS_URL: process.env.LEARNING_ANALYTICS_URL || 'http://localhost:3008',
  CCA_URL: process.env.CCA_URL || 'http://localhost:3009',
  ASSESSMENT_URL: process.env.ASSESSMENT_URL || 'http://localhost:3010',
  SENDPULSE_URL: process.env.SENDPULSE_URL || 'http://localhost:3011',
  SENDGRID_URL: process.env.SENDGRID_URL || 'http://localhost:3012',
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@company.com',
  
  // External Services
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || ''
};

// Validate required configuration
const validateConfig = (config) => {
  const required = ['JWT_SECRET', 'ENCRYPTION_KEY'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return config;
};

// Export validated configuration
export const config = validateConfig(defaultConfig);

// Export individual config values for convenience
export const {
  NODE_ENV,
  PORT,
  HOST,
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSL,
  REDIS_URL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ENCRYPTION_KEY,
  BCRYPT_ROUNDS,
  USE_MOCK,
  MOCK_DATA_PATH,
  CORS_ORIGINS,
  CORS_CREDENTIALS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  LOG_LEVEL,
  LOG_FILE,
  HEALTH_CHECK_INTERVAL,
  METRICS_ENABLED,
  MAX_FILE_SIZE,
  UPLOAD_PATH,
  LINKEDIN_API_KEY,
  GITHUB_API_KEY,
  ORCID_API_KEY,
  CREDLY_API_KEY,
  GEMINI_API_KEY,
  AUTH_SERVICE_URL,
  SKILLS_ENGINE_URL,
  MARKETPLACE_URL,
  CONTENT_STUDIO_URL,
  COURSE_BUILDER_URL,
  DEVLAB_URL,
  LEARNING_ANALYTICS_URL,
  CCA_URL,
  ASSESSMENT_URL,
  SENDPULSE_URL,
  SENDGRID_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  SENTRY_DSN,
  GOOGLE_ANALYTICS_ID
} = config;
