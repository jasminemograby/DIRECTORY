# Directory Microservice Architecture

## 🏗️ Architecture Overview

The Directory Microservice follows **Onion Architecture** (Clean Architecture) principles, providing a robust, maintainable, and testable system with comprehensive rollback-to-mock data capabilities.

## 📐 Onion Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ HTTP Controllers│  │   Express Routes│  │  Middleware │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Use Cases     │  │  Business Logic │  │   Services  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │    Entities     │  │  Business Rules │  │ Interfaces  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Database      │  │  External APIs  │  │   Mock Data │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Principles

### 1. Dependency Inversion
- Inner layers don't depend on outer layers
- Dependencies point inward toward the domain
- Abstractions in domain layer, implementations in infrastructure

### 2. Separation of Concerns
- **Domain**: Core business logic and rules
- **Application**: Use cases and orchestration
- **Infrastructure**: External concerns (database, APIs, file system)
- **Presentation**: HTTP controllers and routes

### 3. Rollback-to-Mock System
- Automatic fallback when external services fail
- Seamless switching between live and mock data
- Consistent API responses regardless of data source

## 🏢 Domain Layer

### Entities
Core business objects with their own identity and lifecycle:

```javascript
// Company Entity
class Company {
  constructor({ id, name, industry, size, ... }) {
    this.id = id;
    this.name = name;
    this.industry = industry;
    this.size = size;
    // ... other properties
  }

  validate() {
    // Business validation rules
  }

  addDepartment(department) {
    // Business logic for adding departments
  }
}

// Employee Entity
class Employee {
  constructor({ id, companyId, firstName, lastName, ... }) {
    this.id = id;
    this.companyId = companyId;
    this.firstName = firstName;
    this.lastName = lastName;
    // ... other properties
  }

  calculateRelevanceScore() {
    // Business logic for relevance calculation
  }

  updateEnrichmentStatus(status, sources) {
    // Business logic for enrichment tracking
  }
}
```

### Repository Interfaces
Abstractions for data access:

```javascript
// ICompanyRepository Interface
class ICompanyRepository {
  async create(company) { throw new Error('Method must be implemented'); }
  async findById(id) { throw new Error('Method must be implemented'); }
  async findAll(filters) { throw new Error('Method must be implemented'); }
  async update(id, updates) { throw new Error('Method must be implemented'); }
  async delete(id) { throw new Error('Method must be implemented'); }
}
```

## 🔧 Application Layer

### Services
Orchestrate use cases and business logic:

```javascript
// CompanyService
class CompanyService {
  constructor(companyRepository, mockDataService) {
    this.companyRepository = companyRepository;
    this.mockDataService = mockDataService;
  }

  async getCompany(companyId) {
    try {
      const company = await this.companyRepository.findById(companyId);
      return company;
    } catch (error) {
      // Rollback to mock data
      const mockCompany = await this.mockDataService.getCompany(companyId);
      return mockCompany;
    }
  }

  async createCompany(companyData) {
    const company = new Company(companyData);
    const validationErrors = company.validate();
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    return await this.companyRepository.create(company);
  }
}
```

### Use Cases
Specific business operations:

- **Company Management**: Create, read, update, delete companies
- **Employee Profiles**: Manage employee data and enrichment
- **Trainer Management**: Handle trainer profiles and availability
- **Training Requests**: Process training request workflows

## 🗄️ Infrastructure Layer

### Database Repositories
PostgreSQL implementations of repository interfaces:

```javascript
// CompanyRepository Implementation
class CompanyRepository extends ICompanyRepository {
  constructor() {
    super();
    this.db = db; // Database connection
  }

  async findById(id) {
    const query = 'SELECT * FROM companies WHERE id = $1 AND deleted_at IS NULL';
    const result = await this.db.query(query, [id]);
    return this.mapRowToCompany(result.rows[0]);
  }

  async create(company) {
    const query = `
      INSERT INTO companies (id, name, industry, size, ...)
      VALUES ($1, $2, $3, $4, ...)
      RETURNING *
    `;
    const values = [company.id, company.name, company.industry, company.size];
    const result = await this.db.query(query, values);
    return this.mapRowToCompany(result.rows[0]);
  }
}
```

### External API Services
Integration with external services:

```javascript
// ExternalAPIService
class ExternalAPIService {
  async enrichProfile(employee, sources) {
    const enrichmentData = { skills: [], valueProposition: '', sources: [] };

    for (const source of sources) {
      try {
        const sourceData = await this.fetchFromSource(employee, source);
        enrichmentData.skills.push(...sourceData.skills);
        enrichmentData.sources.push(source);
      } catch (error) {
        // Log error but continue with other sources
        logger.error(`Failed to fetch from ${source}`, { error: error.message });
      }
    }

    return enrichmentData;
  }
}
```

### Mock Data Service
Fallback data provider:

```javascript
// MockDataService
class MockDataService {
  async getCompany(companyId) {
    const data = await this.loadMockData('companies/mock-companies.json');
    return data.companies.find(c => c.id === companyId) || null;
  }

  async enrichEmployeeProfile(employeeId, sources) {
    // Return mock enrichment data
    return {
      id: employeeId,
      enrichmentStatus: 'completed',
      valueProposition: 'Mock value proposition...',
      normalizedSkills: [...],
      relevanceScore: 75
    };
  }
}
```

## 🌐 Presentation Layer

### HTTP Controllers
Handle HTTP requests and responses:

```javascript
// CompanyController
class CompanyController extends BaseController {
  constructor(companyService) {
    super();
    this.companyService = companyService;
  }

  async getCompany(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      try {
        const company = await this.companyService.getCompany(id);
        const response = this.successResponse(company, 'live');
        return res.status(200).json(response);
      } catch (error) {
        // Rollback to mock data
        const mockCompany = await this.companyService.getCompany(id, { useMock: true });
        const response = this.successResponse(mockCompany, 'mock');
        return res.status(200).json(response);
      }
    }, req, res, 'live');
  }
}
```

### Express Routes
Define API endpoints:

```javascript
// Company Routes
router.get('/', (req, res) => companyController.getCompanies(req, res));
router.get('/:id', (req, res) => companyController.getCompany(req, res));
router.post('/', (req, res) => companyController.createCompany(req, res));
router.put('/:id', (req, res) => companyController.updateCompany(req, res));
router.delete('/:id', (req, res) => companyController.deleteCompany(req, res));
```

## 🔄 Rollback-to-Mock System

### Automatic Fallback Mechanism

```javascript
// Service Layer with Rollback
class EmployeeService {
  async enrichEmployeeProfile(employeeId, sources) {
    try {
      // Try live enrichment
      const enrichmentData = await this.externalAPIService.enrichProfile(employee, sources);
      const normalizedSkills = await this.internalService.normalizeSkills(enrichmentData.skills);
      
      return {
        enrichmentStatus: 'completed',
        normalizedSkills,
        source: 'live'
      };
    } catch (error) {
      logger.warn('Live enrichment failed, using mock data', { error: error.message });
      
      // Rollback to mock data
      const mockEnrichment = await this.mockDataService.enrichEmployeeProfile(employeeId, sources);
      return {
        ...mockEnrichment,
        source: 'mock'
      };
    }
  }
}
```

### Environment-Based Switching

```javascript
// Configuration-based mode switching
const config = {
  MOCK_MODE: process.env.USE_MOCK === 'true' || process.env.NODE_ENV === 'development',
  FORCE_MOCK: process.env.FORCE_MOCK === 'true'
};

// Database connection with fallback
class DatabaseConnection {
  async connect() {
    try {
      if (this.mockMode) {
        logger.info('Running in mock mode - database connection skipped');
        return;
      }

      this.pool = new Pool({ connectionString: config.DATABASE_URL });
      await this.pool.query('SELECT NOW()');
      this.isConnected = true;
    } catch (error) {
      logger.error('Database connection failed, switching to mock mode');
      this.mockMode = true;
      this.isConnected = true;
    }
  }
}
```

## 🗃️ Database Architecture

### Multi-Tenancy Design
All data is isolated by company:

```sql
-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    -- ... other fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Employees table with company isolation
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    -- ... other fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Row Level Security for multi-tenancy
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_isolation_policy ON companies
    FOR ALL TO authenticated
    USING (id = current_setting('app.current_company_id')::uuid);
```

### Audit Logging
Comprehensive audit trail:

```sql
-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    company_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔌 Integration Architecture

### External API Integrations
- **LinkedIn API**: Professional profile data
- **GitHub API**: Code repositories and skills
- **Credly API**: Digital badges and certifications
- **Gemini API**: AI-powered skill analysis
- **ORCID API**: Academic and research profiles

### Internal Microservice Integrations
- **Auth Service**: User authentication and authorization
- **Skills Engine**: Skill normalization and gap analysis
- **Marketplace**: Course recommendations
- **Content Studio**: Training content management
- **HR Reporting**: Analytics and reporting (external)

### Integration Patterns

```javascript
// Circuit Breaker Pattern for External APIs
class ExternalAPIService {
  async fetchWithCircuitBreaker(source, employee) {
    try {
      if (this.circuitBreaker.isOpen(source)) {
        throw new Error(`Circuit breaker open for ${source}`);
      }

      const result = await this.fetchFromSource(employee, source);
      this.circuitBreaker.recordSuccess(source);
      return result;
    } catch (error) {
      this.circuitBreaker.recordFailure(source);
      throw error;
    }
  }
}

// Retry Pattern with Exponential Backoff
async function retryWithBackoff(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 🚀 Deployment Architecture

### Containerization
```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER nodejs
EXPOSE 3001
CMD ["node", "dist/app.js"]
```

### Environment Configuration
```yaml
# Docker Compose for different environments
version: '3.8'
services:
  backend:
    build: .
    environment:
      NODE_ENV: ${NODE_ENV}
      USE_MOCK: ${USE_MOCK}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

## 📊 Monitoring & Observability

### Health Checks
```javascript
// Comprehensive health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: config.NODE_ENV,
    mockMode: config.MOCK_MODE,
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      externalAPIs: await checkExternalAPIsHealth()
    }
  };

  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### Logging Strategy
```javascript
// Structured logging with Winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'directory-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});
```

## 🔒 Security Architecture

### Authentication & Authorization
```javascript
// JWT-based authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Role-based access control
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **GDPR Compliance**: Data minimization and right to deletion
- **Audit Logging**: Comprehensive audit trail for all operations
- **Input Validation**: Joi schema validation for all inputs

## 📈 Performance Architecture

### Caching Strategy
```javascript
// Redis caching with fallback
class CacheService {
  async get(key) {
    try {
      if (!this.redis) return null;
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get failed', { key, error: error.message });
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (!this.redis) return false;
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set failed', { key, error: error.message });
      return false;
    }
  }
}
```

### Connection Pooling
```javascript
// PostgreSQL connection pooling
const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20, // Maximum connections
  min: 2,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

## 🧪 Testing Architecture

### Test Structure
```
tests/
├── unit/                    # Unit tests
│   ├── domain/             # Entity tests
│   ├── application/        # Service tests
│   └── infrastructure/     # Repository tests
├── integration/            # Integration tests
│   ├── api.test.js        # API endpoint tests
│   └── database.test.js   # Database tests
└── setup.js               # Test configuration
```

### Test Modes
- **Mock Mode**: Uses JSON-based mock data
- **Live Mode**: Uses real database and external APIs
- **Both modes tested** in CI/CD pipeline

## 🔄 CI/CD Architecture

### GitHub Actions Pipeline
```yaml
# Build and Test
- name: Run tests
  run: |
    npm run test:unit
    npm run test:integration

# Build Docker Image
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: ./backend
    push: true
    tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

# Deploy
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: ./scripts/deploy.sh staging
```

## 📋 Architecture Benefits

### Maintainability
- Clear separation of concerns
- Dependency inversion principle
- Testable components
- Consistent patterns

### Scalability
- Horizontal scaling capability
- Database connection pooling
- Caching strategies
- Load balancing ready

### Reliability
- Automatic fallback mechanisms
- Circuit breaker patterns
- Comprehensive error handling
- Health monitoring

### Security
- Multi-layered security approach
- Data encryption
- Audit logging
- GDPR compliance

This architecture provides a solid foundation for the Directory Microservice, ensuring maintainability, scalability, reliability, and security while supporting the unique requirements of automatic rollback-to-mock data capabilities.
