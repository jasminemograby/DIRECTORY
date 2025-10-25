# Directory Microservice Security Documentation

## 🔒 Security Overview

The Directory Microservice implements comprehensive security measures following industry best practices, GDPR compliance requirements, and defense-in-depth principles. All security measures are designed to protect sensitive organizational data while maintaining system availability and performance.

## 🛡️ Security Architecture

### Multi-Layered Security Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Input Validation│  │ Authentication  │  │ Authorization│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Encryption    │  │  Audit Logging  │  │  Rate Limit │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Network Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │     HTTPS       │  │   CORS Policy   │  │   Firewall  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization

### JWT-Based Authentication

```javascript
// JWT Token Validation
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: { 
        message: 'Access token required',
        code: 'UNAUTHORIZED' 
      }
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Invalid or expired token',
          code: 'FORBIDDEN' 
        }
      });
    }
    req.user = user;
    next();
  });
};
```

### Role-Based Access Control (RBAC)

```javascript
// Role-based authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Insufficient permissions',
          code: 'FORBIDDEN' 
        }
      });
    }
    next();
  };
};

// Usage in routes
router.get('/companies', 
  authenticateToken, 
  authorize(['hr_admin', 'manager']), 
  companyController.getCompanies
);
```

### Company-Based Data Isolation

```javascript
// Multi-tenant data isolation
const validateCompanyAccess = (req, res, next) => {
  const companyId = req.headers['x-company-id'];
  const userCompanyId = req.user.companyId;

  if (!companyId || companyId !== userCompanyId) {
    return res.status(403).json({ 
      success: false,
      error: { 
        message: 'Access denied to company data',
        code: 'FORBIDDEN' 
      }
    });
  }

  req.companyId = companyId;
  next();
};
```

## 🛡️ Input Validation & Sanitization

### Joi Schema Validation

```javascript
// Company validation schema
const companySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  industry: Joi.string().min(2).max(100).required(),
  size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+').required(),
  description: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional(),
  logo: Joi.string().uri().optional(),
  foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional()
});

// Employee validation schema
const employeeSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  jobTitle: Joi.string().min(2).max(255).required(),
  role: Joi.string().valid('hr_admin', 'manager', 'team_lead', 'employee', 'trainer').required()
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        success: false,
        error: { 
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors 
        }
      });
    }
    
    req.body = value; // Sanitized data
    next();
  };
};
```

### SQL Injection Prevention

```javascript
// Parameterized queries only
class CompanyRepository {
  async findById(id) {
    // ✅ Safe - parameterized query
    const query = 'SELECT * FROM companies WHERE id = $1 AND deleted_at IS NULL';
    const result = await this.db.query(query, [id]);
    return this.mapRowToCompany(result.rows[0]);
  }

  async searchCompanies(searchTerm) {
    // ✅ Safe - parameterized query with LIKE
    const query = `
      SELECT * FROM companies 
      WHERE (name ILIKE $1 OR description ILIKE $1) 
      AND deleted_at IS NULL
    `;
    const result = await this.db.query(query, [`%${searchTerm}%`]);
    return result.rows.map(row => this.mapRowToCompany(row));
  }
}
```

### XSS Prevention

```javascript
// HTML sanitization
const DOMPurify = require('isomorphic-dompurify');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [] 
    });
  }
  return input;
};

// Sanitization middleware
const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};
```

## 🔒 Data Encryption

### Encryption at Rest

```javascript
// Database encryption configuration
const dbConfig = {
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
};

// Sensitive data encryption
const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.secretKey = crypto.scryptSync(config.ENCRYPTION_KEY, 'salt', 32);
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('directory-microservice', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAAD(Buffer.from('directory-microservice', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### Encryption in Transit

```javascript
// HTTPS enforcement
const helmet = require('helmet');

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
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Force HTTPS in production
if (config.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 🚦 Rate Limiting & DDoS Protection

### Express Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// General rate limiting
const generalLimiter = rateLimit({
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
  legacyHeaders: false
});

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

// Apply rate limiting
app.use('/api/v1/', generalLimiter);
app.use('/api/v1/employees/*/enrich', strictLimiter);
app.use('/api/v1/companies', strictLimiter);
```

### IP Whitelisting

```javascript
// IP whitelist for admin endpoints
const ipWhitelist = (allowedIPs) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        error: { 
          message: 'Access denied from this IP',
          code: 'FORBIDDEN' 
        }
      });
    }
  };
};

// Apply to sensitive routes
router.use('/admin', ipWhitelist(config.ADMIN_IP_WHITELIST));
```

## 📝 Audit Logging

### Comprehensive Audit Trail

```javascript
// Audit logging service
class AuditLogger {
  async log(action, details) {
    const auditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user_id: details.userId,
      company_id: details.companyId,
      ip_address: details.ipAddress,
      user_agent: details.userAgent,
      request_id: details.requestId
    };

    try {
      await this.db.query(
        'INSERT INTO audit_logs (id, action, details, user_id, company_id, ip_address, user_agent, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [auditEntry.id, auditEntry.action, JSON.stringify(auditEntry.details), auditEntry.user_id, auditEntry.company_id, auditEntry.ip_address, auditEntry.user_agent, auditEntry.timestamp]
      );
    } catch (error) {
      logger.error('Failed to write audit log', { error: error.message, auditEntry });
    }
  }
}

// Audit middleware
const auditMiddleware = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log after response is sent
      auditLogger.log(action, {
        userId: req.user?.id,
        companyId: req.companyId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.id,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseSize: data.length
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};
```

### Database Audit Triggers

```sql
-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        user_id,
        company_id,
        created_at
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        current_setting('app.current_user_id', true)::uuid,
        current_setting('app.current_company_id', true)::uuid,
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER companies_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER employees_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 🔐 GDPR Compliance

### Data Minimization

```javascript
// Data minimization in responses
class DataMinimizationService {
  minimizeEmployeeData(employee, userRole) {
    const baseData = {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      jobTitle: employee.jobTitle,
      department: employee.department,
      team: employee.team
    };

    // Add role-specific data
    if (['hr_admin', 'manager'].includes(userRole)) {
      baseData.email = employee.email;
      baseData.phone = employee.phone;
      baseData.skills = employee.skills;
      baseData.relevanceScore = employee.relevanceScore;
    }

    if (userRole === 'hr_admin') {
      baseData.salary = employee.salary;
      baseData.performance = employee.performance;
      baseData.personalNotes = employee.personalNotes;
    }

    return baseData;
  }
}
```

### Right to Erasure (Data Deletion)

```javascript
// GDPR-compliant data deletion
class GDPRComplianceService {
  async deleteEmployeeData(employeeId, companyId) {
    const transaction = await this.db.beginTransaction();
    
    try {
      // Soft delete employee record
      await transaction.query(
        'UPDATE employees SET deleted_at = NOW(), status = $1 WHERE id = $2 AND company_id = $3',
        ['deleted', employeeId, companyId]
      );

      // Anonymize audit logs
      await transaction.query(
        'UPDATE audit_logs SET user_id = NULL WHERE record_id = $1',
        [employeeId]
      );

      // Delete from external systems (if applicable)
      await this.deleteFromExternalSystems(employeeId);

      // Log deletion
      await this.auditLogger.log('GDPR_DELETION', {
        employeeId,
        companyId,
        deletedAt: new Date().toISOString()
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

### Data Portability

```javascript
// GDPR data export
class DataPortabilityService {
  async exportEmployeeData(employeeId, companyId) {
    const employee = await this.employeeRepository.findById(employeeId);
    
    if (!employee || employee.companyId !== companyId) {
      throw new Error('Employee not found or access denied');
    }

    const exportData = {
      personalData: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        jobTitle: employee.jobTitle,
        department: employee.department,
        team: employee.team,
        hireDate: employee.hireDate,
        location: employee.location
      },
      professionalData: {
        skills: employee.skills,
        competences: employee.competences,
        experienceYears: employee.experienceYears,
        careerGoal: employee.careerGoal,
        relevanceScore: employee.relevanceScore
      },
      externalProfiles: employee.externalProfiles,
      trainingHistory: await this.getTrainingHistory(employeeId),
      auditTrail: await this.getAuditTrail(employeeId)
    };

    return exportData;
  }
}
```

## 🛡️ Security Headers

### Helmet.js Configuration

```javascript
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
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = config.CORS_ORIGINS.split(',');
    
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
```

## 🔍 Security Monitoring

### Intrusion Detection

```javascript
// Suspicious activity detection
class SecurityMonitor {
  async detectSuspiciousActivity(req, res, next) {
    const clientIP = req.ip;
    const userAgent = req.get('User-Agent');
    const userId = req.user?.id;

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /<script/i,
      /javascript:/i,
      /onload=/i,
      /onerror=/i
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(req.url) || pattern.test(userAgent)
    );

    if (isSuspicious) {
      await this.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
        ip: clientIP,
        userAgent,
        userId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      });

      return res.status(403).json({ 
        success: false,
        error: { 
          message: 'Suspicious activity detected',
          code: 'FORBIDDEN' 
        }
      });
    }

    next();
  }
}
```

### Failed Login Protection

```javascript
// Brute force protection
class BruteForceProtection {
  constructor() {
    this.failedAttempts = new Map();
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.maxAttempts = 5;
  }

  async checkBruteForce(clientIP) {
    const attempts = this.failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    // Reset if lockout period has passed
    if (now - attempts.lastAttempt > this.lockoutDuration) {
      this.failedAttempts.delete(clientIP);
      return false;
    }

    return attempts.count >= this.maxAttempts;
  }

  async recordFailedAttempt(clientIP) {
    const attempts = this.failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.failedAttempts.set(clientIP, attempts);
  }

  async recordSuccessfulAttempt(clientIP) {
    this.failedAttempts.delete(clientIP);
  }
}
```

## 🔐 Secrets Management

### Environment Variables Security

```javascript
// Secrets validation
class SecretsValidator {
  validateSecrets() {
    const requiredSecrets = [
      'JWT_SECRET',
      'DATABASE_URL',
      'ENCRYPTION_KEY'
    ];

    const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);

    if (missingSecrets.length > 0) {
      throw new Error(`Missing required secrets: ${missingSecrets.join(', ')}`);
    }

    // Validate secret strength
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    if (process.env.ENCRYPTION_KEY.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
    }
  }
}
```

### API Key Management

```javascript
// External API key validation
class APIKeyValidator {
  validateExternalAPIKeys() {
    const apiKeys = {
      linkedin: process.env.LINKEDIN_API_KEY,
      github: process.env.GITHUB_API_KEY,
      credly: process.env.CREDLY_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
      orcid: process.env.ORCID_API_KEY
    };

    const invalidKeys = Object.entries(apiKeys)
      .filter(([service, key]) => !key || key.length < 10)
      .map(([service]) => service);

    if (invalidKeys.length > 0) {
      logger.warn('Invalid or missing API keys', { services: invalidKeys });
    }

    return apiKeys;
  }
}
```

## 🚨 Incident Response

### Security Incident Handling

```javascript
// Security incident response
class SecurityIncidentHandler {
  async handleSecurityIncident(type, details) {
    const incident = {
      id: uuidv4(),
      type,
      details,
      timestamp: new Date().toISOString(),
      severity: this.determineSeverity(type, details),
      status: 'open'
    };

    // Log incident
    await this.logIncident(incident);

    // Alert security team for high severity incidents
    if (incident.severity === 'high' || incident.severity === 'critical') {
      await this.alertSecurityTeam(incident);
    }

    // Take automatic mitigation actions
    await this.takeMitigationActions(incident);

    return incident;
  }

  determineSeverity(type, details) {
    const severityMap = {
      'SQL_INJECTION_ATTEMPT': 'high',
      'XSS_ATTEMPT': 'high',
      'BRUTE_FORCE_ATTACK': 'medium',
      'SUSPICIOUS_ACTIVITY': 'low',
      'DATA_BREACH': 'critical'
    };

    return severityMap[type] || 'low';
  }
}
```

## 📊 Security Metrics

### Security Dashboard

```javascript
// Security metrics collection
class SecurityMetrics {
  async getSecurityMetrics() {
    const metrics = {
      totalRequests: await this.getTotalRequests(),
      blockedRequests: await this.getBlockedRequests(),
      failedLogins: await this.getFailedLogins(),
      suspiciousActivities: await this.getSuspiciousActivities(),
      dataAccess: await this.getDataAccessMetrics(),
      auditLogs: await this.getAuditLogMetrics()
    };

    return {
      ...metrics,
      securityScore: this.calculateSecurityScore(metrics),
      lastUpdated: new Date().toISOString()
    };
  }

  calculateSecurityScore(metrics) {
    const blockedRate = metrics.blockedRequests / metrics.totalRequests;
    const failedLoginRate = metrics.failedLogins / metrics.totalRequests;
    
    // Calculate security score (0-100)
    let score = 100;
    score -= blockedRate * 20; // Penalize high block rate
    score -= failedLoginRate * 30; // Penalize high failed login rate
    score -= metrics.suspiciousActivities * 5; // Penalize suspicious activities
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}
```

## 🔒 Security Checklist

### Pre-Deployment Security Checklist

- [ ] **Authentication & Authorization**
  - [ ] JWT tokens properly configured
  - [ ] Role-based access control implemented
  - [ ] Company-based data isolation verified
  - [ ] Password policies enforced

- [ ] **Input Validation**
  - [ ] All inputs validated with Joi schemas
  - [ ] SQL injection prevention verified
  - [ ] XSS protection implemented
  - [ ] File upload restrictions in place

- [ ] **Data Protection**
  - [ ] Encryption at rest configured
  - [ ] HTTPS enforced in production
  - [ ] GDPR compliance implemented
  - [ ] Data minimization applied

- [ ] **Network Security**
  - [ ] Rate limiting configured
  - [ ] CORS policy properly set
  - [ ] Security headers implemented
  - [ ] IP whitelisting for admin endpoints

- [ ] **Monitoring & Logging**
  - [ ] Audit logging enabled
  - [ ] Security monitoring active
  - [ ] Incident response procedures documented
  - [ ] Security metrics dashboard available

- [ ] **Secrets Management**
  - [ ] Environment variables secured
  - [ ] API keys properly configured
  - [ ] Database credentials protected
  - [ ] Encryption keys rotated regularly

### Ongoing Security Maintenance

- [ ] **Regular Security Reviews**
  - [ ] Monthly security audits
  - [ ] Quarterly penetration testing
  - [ ] Annual security training
  - [ ] Continuous vulnerability scanning

- [ ] **Incident Response**
  - [ ] Security incident procedures documented
  - [ ] Response team identified
  - [ ] Communication plan established
  - [ ] Recovery procedures tested

This comprehensive security implementation ensures the Directory Microservice meets enterprise-grade security standards while maintaining compliance with GDPR and other regulatory requirements.
