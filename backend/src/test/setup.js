// Test setup for backend

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/directory_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-key-32-chars-minimum';
process.env.USE_MOCK = 'false';
process.env.LOG_LEVEL = 'error';

// Mock external dependencies
const mockLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
};

// Mock Winston
jest.mock('winston', () => ({
  createLogger: () => mockLogger,
  format: {
    combine: () => {},
    timestamp: () => {},
    json: () => {},
    colorize: () => {},
    simple: () => {},
  },
  transports: {
    Console: () => {},
    File: () => {},
  },
}));

// Mock Redis
jest.mock('redis', () => ({
  createClient: () => ({
    connect: () => {},
    disconnect: () => {},
    get: () => {},
    set: () => {},
    del: () => {},
    exists: () => {},
    expire: () => {},
    on: () => {},
  }),
}));

// Mock external APIs
jest.mock('axios', () => ({
  get: () => {},
  post: () => {},
  put: () => {},
  delete: () => {},
  create: () => ({
    get: () => {},
    post: () => {},
    put: () => {},
    delete: () => {},
  }),
}));

// Global test timeout
jest.setTimeout(30000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
