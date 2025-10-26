// Test setup for backend

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/directory_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-key-32-chars-minimum';
process.env.USE_MOCK = 'false';
process.env.LOG_LEVEL = 'error';

// Global test timeout
global.setTimeout = global.setTimeout || setTimeout;
