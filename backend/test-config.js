// Test configuration for local development
module.exports = {
  NODE_ENV: 'development',
  PORT: 3001,
  HOST: '0.0.0.0',
  
  // Mock Data Configuration
  USE_MOCK: true,
  MOCK_DATA_PATH: './database/mocks',
  
  // Database Configuration (Mock mode - no real DB needed)
  DATABASE_URL: 'postgresql://test:test@localhost:5432/directory_test',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: 'directory_test',
  DB_USER: 'test',
  DB_PASSWORD: 'test',
  DB_SSL: false,
  
  // Authentication & Security
  JWT_SECRET: 'local-development-jwt-secret-key-32-chars-minimum',
  JWT_EXPIRES_IN: '24h',
  ENCRYPTION_KEY: 'local-development-encryption-key-32-chars',
  BCRYPT_ROUNDS: 12,
  
  // CORS Configuration
  CORS_ORIGINS: 'http://localhost:5173,http://localhost:3000',
  CORS_CREDENTIALS: true,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 900000,
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Logging
  LOG_LEVEL: 'debug',
  LOG_FILE: './logs/app.log',
  
  // Monitoring & Health Checks
  HEALTH_CHECK_INTERVAL: 30000,
  METRICS_ENABLED: true,
  
  // File Upload
  MAX_FILE_SIZE: 10485760,
  UPLOAD_PATH: './uploads',
  
  // External API Configuration (Mock mode)
  LINKEDIN_API_KEY: '',
  GITHUB_API_KEY: '',
  ORCID_API_KEY: '',
  CREDLY_API_KEY: '',
  GEMINI_API_KEY: '',
  
  // Internal Microservice URLs (Mock mode)
  AUTH_SERVICE_URL: 'http://localhost:3002',
  SKILLS_ENGINE_URL: 'http://localhost:3003',
  MARKETPLACE_URL: 'http://localhost:3004',
  CONTENT_STUDIO_URL: 'http://localhost:3005',
  COURSE_BUILDER_URL: 'http://localhost:3006',
  DEVLAB_URL: 'http://localhost:3007',
  LEARNING_ANALYTICS_URL: 'http://localhost:3008',
  CCA_URL: 'http://localhost:3009',
  ASSESSMENT_URL: 'http://localhost:3010',
  SENDPULSE_URL: 'http://localhost:3011',
  SENDGRID_URL: 'http://localhost:3012',
  
  // Email Configuration (Mock mode)
  SMTP_HOST: '',
  SMTP_PORT: 587,
  SMTP_USER: '',
  SMTP_PASS: '',
  FROM_EMAIL: 'noreply@company.com',
  
  // External Services (Mock mode)
  SENTRY_DSN: '',
  GOOGLE_ANALYTICS_ID: ''
};
