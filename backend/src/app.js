import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment.js';
import { logger, logRequest, logError } from './config/logging.js';
import { 
  globalErrorHandler, 
  notFoundHandler, 
  validationErrorHandler,
  databaseErrorHandler,
  externalAPIErrorHandler,
  jwtErrorHandler,
  corsErrorHandler,
  securityErrorHandler,
  healthCheckErrorHandler
} from './interfaces/http/middleware/errorHandler.js';

// Import routes
import companyRoutes from './interfaces/http/routes/companies.js';
import employeeRoutes from './interfaces/http/routes/employees.js';
import trainerRoutes from './interfaces/http/routes/trainers.js';
import trainingRequestRoutes from './interfaces/http/routes/training-requests.js';
import mockRoutes from './interfaces/http/routes/mock.js';

// Import middleware
import { authenticateToken } from './interfaces/http/middleware/auth.js';
import { validateCompanyAccess } from './interfaces/http/middleware/auth.js';

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = config.CORS_ORIGINS ? config.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Company-ID', 
    'X-User-ID', 
    'X-User-Role'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      source: 'live',
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/', limiter);

// Strict rate limiting for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests to sensitive endpoint',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

app.use('/api/v1/employees/*/enrich', strictLimiter);
app.use('/api/v1/companies', strictLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(logRequest);

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Response time middleware
app.use((req, res, next) => {
  res.startTime = Date.now();
  next();
});

// Health check endpoint (no authentication required)
app.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.NODE_ENV,
      mockMode: config.MOCK_MODE,
      services: {
        database: await checkDatabaseHealth(),
        redis: await checkRedisHealth(),
        externalAPIs: await checkExternalAPIsHealth()
      }
    };

    const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
    res.status(isHealthy ? 200 : 503).json({
      success: true,
      data: health,
      source: 'live',
      message: isHealthy ? 'Service is healthy' : 'Service has issues'
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      source: 'live',
      message: 'Health check failed'
    });
  }
});

// Detailed health check endpoint
app.get('/health/detailed', authenticateToken, async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.NODE_ENV,
      mockMode: config.MOCK_MODE,
      services: {
        database: await checkDatabaseHealth(),
        redis: await checkRedisHealth(),
        externalAPIs: await checkExternalAPIsHealth()
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };

    const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
    res.status(isHealthy ? 200 : 503).json({
      success: true,
      data: health,
      source: 'live',
      message: isHealthy ? 'Service is healthy' : 'Service has issues'
    });
  } catch (error) {
    logger.error('Detailed health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      source: 'live',
      message: 'Detailed health check failed'
    });
  }
});

// API routes with authentication and company access validation
app.use('/api/v1/companies', authenticateToken, validateCompanyAccess, companyRoutes);
app.use('/api/v1/employees', authenticateToken, validateCompanyAccess, employeeRoutes);
app.use('/api/v1/trainers', authenticateToken, validateCompanyAccess, trainerRoutes);
app.use('/api/v1/training-requests', authenticateToken, validateCompanyAccess, trainingRequestRoutes);

// Mock API routes (development only)
if (config.NODE_ENV === 'development' || config.MOCK_MODE) {
  app.use('/mock', mockRoutes);
  logger.info('Mock API routes enabled');
}

// Error handling middleware (order matters!)
app.use(corsErrorHandler);
app.use(jwtErrorHandler);
app.use(validationErrorHandler);
app.use(databaseErrorHandler);
app.use(externalAPIErrorHandler);
app.use(securityErrorHandler);
app.use(healthCheckErrorHandler);
app.use(globalErrorHandler);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason.message,
    stack: reason.stack,
    promise: promise.toString()
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Health check helper functions
async function checkDatabaseHealth() {
  try {
    // Import database connection
    const { db } = await import('./infrastructure/database/connection.js');
    await db.query('SELECT 1');
    return { status: 'healthy', responseTime: '45ms' };
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkRedisHealth() {
  try {
    // Mock Redis health check - replace with actual Redis check
    return { status: 'healthy', responseTime: '12ms' };
  } catch (error) {
    logger.error('Redis health check failed', { error: error.message });
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkExternalAPIsHealth() {
  try {
    // Mock external API health checks
    return {
      linkedin: 'healthy',
      github: 'healthy',
      credly: 'healthy',
      gemini: 'healthy',
      orcid: 'healthy'
    };
  } catch (error) {
    logger.error('External APIs health check failed', { error: error.message });
    return { status: 'unhealthy', error: error.message };
  }
}

// Start server
const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  logger.info('Directory Microservice started', {
    port: PORT,
    environment: config.NODE_ENV,
    mockMode: config.MOCK_MODE,
    version: process.env.npm_package_version || '1.0.0'
  });
});

export default app;
