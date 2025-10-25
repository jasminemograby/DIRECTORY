# Directory Microservice Testing Documentation

## 🧪 Testing Overview

The Directory Microservice implements a comprehensive testing strategy following Test-Driven Development (TDD) principles. All tests run in both mock and live modes to ensure compatibility and reliability across different environments.

## 📊 Testing Strategy

### Test Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← Few, High Value
                    │   (Cypress)     │
                    └─────────────────┘
                  ┌─────────────────────┐
                  │ Integration Tests   │  ← Some, Medium Value
                  │   (API + DB)        │
                  └─────────────────────┘
                ┌─────────────────────────┐
                │     Unit Tests          │  ← Many, Fast
                │  (Services + Entities)  │
                └─────────────────────────┘
```

### Test Categories

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **API Tests**: Test HTTP endpoints and responses
4. **Database Tests**: Test data persistence and queries
5. **Mock Mode Tests**: Test fallback mechanisms
6. **Live Mode Tests**: Test real service integrations

## 🏗️ Test Architecture

### Test Structure

```
tests/
├── unit/                          # Unit tests
│   ├── domain/                   # Entity tests
│   │   ├── Company.test.js
│   │   ├── Employee.test.js
│   │   ├── Trainer.test.js
│   │   └── TrainingRequest.test.js
│   ├── application/              # Service tests
│   │   ├── CompanyService.test.js
│   │   ├── EmployeeService.test.js
│   │   ├── TrainerService.test.js
│   │   └── TrainingRequestService.test.js
│   └── infrastructure/           # Repository tests
│       ├── CompanyRepository.test.js
│       ├── EmployeeRepository.test.js
│       └── MockDataService.test.js
├── integration/                  # Integration tests
│   ├── api.test.js              # API endpoint tests
│   ├── database.test.js         # Database integration tests
│   ├── external-apis.test.js    # External API tests
│   └── mock-fallback.test.js    # Mock fallback tests
├── e2e/                         # End-to-end tests
│   ├── company-workflow.test.js
│   ├── employee-enrichment.test.js
│   └── training-request.test.js
├── fixtures/                    # Test data
│   ├── companies.json
│   ├── employees.json
│   ├── trainers.json
│   └── training-requests.json
└── setup.js                     # Test configuration
```

## 🔧 Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
    '!src/interfaces/http/routes/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 30000,
  maxWorkers: 4,
  verbose: true
};
```

### Test Setup

```javascript
// tests/setup.js
import { config } from '../src/config/environment.js';
import { db } from '../src/infrastructure/database/connection.js';
import { logger } from '../src/config/logging.js';

// Test environment setup
process.env.NODE_ENV = 'test';
process.env.USE_MOCK = 'true';
process.env.LOG_LEVEL = 'error';
process.env.DB_NAME = 'directory_test';

export const testConfig = {
  ...config,
  NODE_ENV: 'test',
  MOCK_MODE: true,
  PORT: 3002,
  DB_NAME: 'directory_test',
  LOG_LEVEL: 'error'
};

// Global test setup
beforeAll(async () => {
  await setupTestEnvironment();
});

afterAll(async () => {
  await teardownTestEnvironment();
});

// Clean database between tests
beforeEach(async () => {
  await cleanDatabase();
});

export async function setupTestEnvironment() {
  try {
    await db.connect();
    await runMigrations();
    await seedTestData();
    logger.info('Test environment setup complete');
  } catch (error) {
    logger.error('Test environment setup failed', { error: error.message });
    throw error;
  }
}

export async function teardownTestEnvironment() {
  try {
    await cleanDatabase();
    await db.disconnect();
    logger.info('Test environment teardown complete');
  } catch (error) {
    logger.error('Test environment teardown failed', { error: error.message });
  }
}

export async function cleanDatabase() {
  if (db.isMockMode()) return;
  
  const tables = ['training_requests', 'trainers', 'employees', 'teams', 'departments', 'companies'];
  
  for (const table of tables) {
    await db.query(`DELETE FROM ${table}`);
  }
}
```

## 🧩 Unit Tests

### Domain Entity Tests

```javascript
// tests/unit/domain/Company.test.js
import { Company } from '../../../src/domain/entities/Company.js';

describe('Company Entity', () => {
  describe('Validation', () => {
    test('should validate required fields', () => {
      const company = new Company({
        name: '',
        industry: 'Technology',
        size: '11-50'
      });
      
      const errors = company.validate();
      expect(errors).toContain('Company name must be at least 2 characters long');
    });

    test('should validate industry field', () => {
      const company = new Company({
        name: 'Test Company',
        industry: '',
        size: '11-50'
      });
      
      const errors = company.validate();
      expect(errors).toContain('Industry is required');
    });

    test('should validate company size', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: 'invalid-size'
      });
      
      const errors = company.validate();
      expect(errors).toContain('Company size is required');
    });

    test('should validate website URL format', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        website: 'invalid-url'
      });
      
      const errors = company.validate();
      expect(errors).toContain('Website must be a valid URL');
    });

    test('should validate founded year range', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        foundedYear: 1500
      });
      
      const errors = company.validate();
      expect(errors).toContain('Founded year must be between 1800 and current year');
    });
  });

  describe('Business Logic', () => {
    test('should add department correctly', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      });

      const department = { id: 'dept_1', name: 'Engineering' };
      company.addDepartment(department);

      expect(company.departments).toContain(department);
      expect(company.updatedAt).toBeInstanceOf(Date);
    });

    test('should not add duplicate department', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      });

      const department = { id: 'dept_1', name: 'Engineering' };
      company.addDepartment(department);
      company.addDepartment(department);

      expect(company.departments).toHaveLength(1);
    });

    test('should update KPIs correctly', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        kpis: { revenue: 1000000 }
      });

      company.updateKpis({ growthRate: 0.15 });

      expect(company.kpis).toEqual({
        revenue: 1000000,
        growthRate: 0.15
      });
      expect(company.updatedAt).toBeInstanceOf(Date);
    });

    test('should soft delete correctly', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      });

      company.softDelete();

      expect(company.deletedAt).toBeInstanceOf(Date);
      expect(company.status).toBe('inactive');
      expect(company.updatedAt).toBeInstanceOf(Date);
    });

    test('should restore correctly', () => {
      const company = new Company({
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      });

      company.softDelete();
      company.restore();

      expect(company.deletedAt).toBeNull();
      expect(company.status).toBe('active');
      expect(company.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Serialization', () => {
    test('should serialize to JSON correctly', () => {
      const company = new Company({
        id: 'company_1',
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        foundedYear: 2020
      });

      const json = company.toJSON();

      expect(json).toEqual({
        id: 'company_1',
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        foundedYear: 2020,
        departments: [],
        kpis: {},
        status: 'active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null
      });
    });
  });
});
```

### Application Service Tests

```javascript
// tests/unit/application/CompanyService.test.js
import { CompanyService } from '../../../src/application/services/CompanyService.js';
import { Company } from '../../../src/domain/entities/Company.js';

describe('CompanyService', () => {
  let companyService;
  let mockCompanyRepository;
  let mockMockDataService;

  beforeEach(() => {
    mockCompanyRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    mockMockDataService = {
      getCompany: jest.fn(),
      getCompanies: jest.fn()
    };

    companyService = new CompanyService(mockCompanyRepository, mockMockDataService);
  });

  describe('createCompany', () => {
    test('should create company successfully', async () => {
      const companyData = {
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      };

      const expectedCompany = new Company(companyData);
      mockCompanyRepository.create.mockResolvedValue(expectedCompany);

      const result = await companyService.createCompany(companyData);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith(expect.any(Company));
      expect(result).toEqual(expectedCompany);
    });

    test('should throw error for invalid company data', async () => {
      const invalidCompanyData = {
        name: '', // Invalid: empty name
        industry: 'Technology',
        size: '11-50'
      };

      await expect(companyService.createCompany(invalidCompanyData))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('getCompany', () => {
    test('should return company from repository', async () => {
      const companyId = 'company_1';
      const expectedCompany = new Company({
        id: companyId,
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50'
      });

      mockCompanyRepository.findById.mockResolvedValue(expectedCompany);

      const result = await companyService.getCompany(companyId);

      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(expectedCompany);
    });

    test('should fallback to mock data when repository fails', async () => {
      const companyId = 'company_1';
      const mockCompany = new Company({
        id: companyId,
        name: 'Mock Company',
        industry: 'Technology',
        size: '11-50'
      });

      mockCompanyRepository.findById.mockRejectedValue(new Error('Database error'));
      mockMockDataService.getCompany.mockResolvedValue(mockCompany);

      const result = await companyService.getCompany(companyId);

      expect(mockMockDataService.getCompany).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(mockCompany);
    });

    test('should throw error when company not found', async () => {
      const companyId = 'nonexistent';

      mockCompanyRepository.findById.mockResolvedValue(null);
      mockMockDataService.getCompany.mockResolvedValue(null);

      await expect(companyService.getCompany(companyId))
        .rejects.toThrow('Company not found');
    });
  });

  describe('getCompanies', () => {
    test('should return companies from repository', async () => {
      const filters = { industry: 'Technology' };
      const expectedCompanies = [
        new Company({ id: '1', name: 'Company 1', industry: 'Technology', size: '11-50' }),
        new Company({ id: '2', name: 'Company 2', industry: 'Technology', size: '51-200' })
      ];

      mockCompanyRepository.findAll.mockResolvedValue(expectedCompanies);

      const result = await companyService.getCompanies(filters);

      expect(mockCompanyRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedCompanies);
    });

    test('should fallback to mock data when repository fails', async () => {
      const filters = { industry: 'Technology' };
      const mockCompanies = [
        new Company({ id: '1', name: 'Mock Company 1', industry: 'Technology', size: '11-50' })
      ];

      mockCompanyRepository.findAll.mockRejectedValue(new Error('Database error'));
      mockMockDataService.getCompanies.mockResolvedValue(mockCompanies);

      const result = await companyService.getCompanies(filters);

      expect(mockMockDataService.getCompanies).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockCompanies);
    });
  });
});
```

## 🔗 Integration Tests

### API Integration Tests

```javascript
// tests/integration/api.test.js
import request from 'supertest';
import app from '../../src/app.js';
import { setupTestEnvironment, teardownTestEnvironment } from '../setup.js';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('Health Check', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          environment: 'test',
          mockMode: true
        },
        source: 'live'
      });
    });
  });

  describe('Company API', () => {
    test('GET /api/v1/companies should return companies list', async () => {
      const response = await request(app)
        .get('/api/v1/companies')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.any(Array)
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('industry');
    });

    test('GET /api/v1/companies/:id should return specific company', async () => {
      const response = await request(app)
        .get('/api/v1/companies/company_12345')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.objectContaining({
          id: 'company_12345',
          name: expect.any(String),
          industry: expect.any(String)
        })
      });
    });

    test('POST /api/v1/companies should create new company', async () => {
      const newCompany = {
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        description: 'Test company description'
      };

      const response = await request(app)
        .post('/api/v1/companies')
        .set('X-Company-ID', 'company_12345')
        .send(newCompany)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        source: 'live',
        message: 'Company created successfully',
        data: expect.objectContaining({
          name: 'Test Company',
          industry: 'Technology'
        })
      });
    });

    test('POST /api/v1/companies should validate required fields', async () => {
      const invalidCompany = {
        name: '', // Invalid: empty name
        industry: 'Technology',
        size: '11-50'
      };

      const response = await request(app)
        .post('/api/v1/companies')
        .set('X-Company-ID', 'company_12345')
        .send(invalidCompany)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        source: 'live',
        error: expect.objectContaining({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        })
      });
    });
  });

  describe('Employee API', () => {
    test('GET /api/v1/employees should return employees list', async () => {
      const response = await request(app)
        .get('/api/v1/employees')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.any(Array)
      });
    });

    test('POST /api/v1/employees/:id/enrich should enrich employee profile', async () => {
      const response = await request(app)
        .post('/api/v1/employees/emp_12347/enrich')
        .set('X-Company-ID', 'company_12345')
        .send({ sources: ['linkedin', 'github'] })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        message: expect.stringContaining('enriched'),
        data: expect.objectContaining({
          id: 'emp_12347',
          enrichmentStatus: 'completed',
          normalizedSkills: expect.any(Array)
        })
      });
    });

    test('GET /api/v1/employees/:id/skill-gap should return skill gaps', async () => {
      const response = await request(app)
        .get('/api/v1/employees/emp_12347/skill-gap')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.objectContaining({
          employeeId: 'emp_12347',
          skillGaps: expect.any(Array),
          overallGapScore: expect.any(Number)
        })
      });
    });

    test('GET /api/v1/employees/:id/relevance should return relevance score', async () => {
      const response = await request(app)
        .get('/api/v1/employees/emp_12347/relevance')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.objectContaining({
          employeeId: 'emp_12347',
          relevanceScore: expect.any(Number),
          scoreBreakdown: expect.any(Object)
        })
      });
    });
  });

  describe('Trainer API', () => {
    test('GET /api/v1/trainers should return trainers list', async () => {
      const response = await request(app)
        .get('/api/v1/trainers')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.any(Array)
      });
    });

    test('GET /api/v1/trainers/search should search trainers by skills', async () => {
      const response = await request(app)
        .get('/api/v1/trainers/search?skills=JavaScript,React')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.any(Array)
      });
    });
  });

  describe('Training Request API', () => {
    test('GET /api/v1/training-requests should return training requests', async () => {
      const response = await request(app)
        .get('/api/v1/training-requests')
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.any(Array)
      });
    });

    test('POST /api/v1/training-requests should create training request', async () => {
      const newRequest = {
        companyId: 'company_12345',
        requesterId: 'emp_12347',
        title: 'JavaScript Advanced Training',
        description: 'Learn advanced JavaScript concepts',
        type: 'skill-driven',
        skillCategories: ['JavaScript'],
        targetLevel: 'intermediate'
      };

      const response = await request(app)
        .post('/api/v1/training-requests')
        .set('X-Company-ID', 'company_12345')
        .send(newRequest)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        source: 'live',
        message: 'Training request created successfully',
        data: expect.objectContaining({
          title: 'JavaScript Advanced Training',
          type: 'skill-driven'
        })
      });
    });
  });

  describe('Mock API Endpoints', () => {
    test('POST /mock/enrichment/employees/:id/enrich should work', async () => {
      const response = await request(app)
        .post('/mock/enrichment/employees/emp_12347/enrich')
        .send({ sources: ['linkedin', 'github'] })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.objectContaining({
          id: 'emp_12347',
          enrichmentStatus: 'completed'
        })
      });
    });

    test('PATCH /mock/skills/employees/:id/skills should work', async () => {
      const response = await request(app)
        .patch('/mock/skills/employees/emp_12347/skills')
        .send({ skills: [{ name: 'JavaScript', level: 'advanced' }] })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        source: 'mock',
        data: expect.objectContaining({
          id: 'emp_12347',
          skills: expect.any(Array)
        })
      });
    });
  });

  describe('Error Handling', () => {
    test('GET /api/v1/companies/nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/api/v1/companies/nonexistent')
        .set('X-Company-ID', 'company_12345')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        source: 'mock',
        error: expect.objectContaining({
          message: 'Company not found',
          code: 'NOT_FOUND'
        })
      });
    });

    test('POST /api/v1/companies with invalid data should return 400', async () => {
      const response = await request(app)
        .post('/api/v1/companies')
        .set('X-Company-ID', 'company_12345')
        .send({ name: '' }) // Invalid data
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        source: 'live',
        error: expect.objectContaining({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        })
      });
    });
  });

  describe('Response Format Consistency', () => {
    test('All successful responses should have consistent format', async () => {
      const endpoints = [
        '/api/v1/companies',
        '/api/v1/employees',
        '/api/v1/trainers',
        '/api/v1/training-requests'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set('X-Company-ID', 'company_12345')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('source');
        expect(response.body).toHaveProperty('timestamp');
        expect(['live', 'mock']).toContain(response.body.source);
      }
    });

    test('All error responses should have consistent format', async () => {
      const response = await request(app)
        .get('/api/v1/companies/nonexistent')
        .set('X-Company-ID', 'company_12345')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('source');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('code');
    });
  });
});
```

### Database Integration Tests

```javascript
// tests/integration/database.test.js
import { db } from '../../src/infrastructure/database/connection.js';
import { CompanyRepository } from '../../src/infrastructure/database/repositories/CompanyRepository.js';
import { Company } from '../../src/domain/entities/Company.js';

describe('Database Integration Tests', () => {
  let companyRepository;

  beforeAll(async () => {
    companyRepository = new CompanyRepository();
  });

  describe('Company Repository', () => {
    test('should create company in database', async () => {
      const companyData = {
        name: 'Test Company',
        industry: 'Technology',
        size: '11-50',
        description: 'Test company description'
      };

      const company = new Company(companyData);
      const result = await companyRepository.create(company);

      expect(result).toBeInstanceOf(Company);
      expect(result.name).toBe('Test Company');
      expect(result.industry).toBe('Technology');
    });

    test('should find company by ID', async () => {
      const companyData = {
        name: 'Find Test Company',
        industry: 'Technology',
        size: '11-50'
      };

      const company = new Company(companyData);
      const created = await companyRepository.create(company);
      const found = await companyRepository.findById(created.id);

      expect(found).toBeInstanceOf(Company);
      expect(found.id).toBe(created.id);
      expect(found.name).toBe('Find Test Company');
    });

    test('should update company', async () => {
      const companyData = {
        name: 'Update Test Company',
        industry: 'Technology',
        size: '11-50'
      };

      const company = new Company(companyData);
      const created = await companyRepository.create(company);

      const updates = { name: 'Updated Company Name' };
      const updated = await companyRepository.update(created.id, updates);

      expect(updated.name).toBe('Updated Company Name');
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    test('should soft delete company', async () => {
      const companyData = {
        name: 'Delete Test Company',
        industry: 'Technology',
        size: '11-50'
      };

      const company = new Company(companyData);
      const created = await companyRepository.create(company);

      await companyRepository.softDelete(created.id);
      const found = await companyRepository.findById(created.id);

      expect(found).toBeNull();
    });

    test('should find companies with filters', async () => {
      // Create test companies
      const company1 = new Company({
        name: 'Tech Company 1',
        industry: 'Technology',
        size: '11-50'
      });
      const company2 = new Company({
        name: 'Finance Company',
        industry: 'Finance',
        size: '51-200'
      });

      await companyRepository.create(company1);
      await companyRepository.create(company2);

      const techCompanies = await companyRepository.findAll({ industry: 'Technology' });
      const largeCompanies = await companyRepository.findAll({ size: '51-200' });

      expect(techCompanies).toHaveLength(1);
      expect(techCompanies[0].industry).toBe('Technology');
      expect(largeCompanies).toHaveLength(1);
      expect(largeCompanies[0].size).toBe('51-200');
    });
  });

  describe('Database Transactions', () => {
    test('should handle transaction rollback on error', async () => {
      await expect(
        db.transaction(async (client) => {
          // Create company
          await client.query(
            'INSERT INTO companies (id, name, industry, size) VALUES ($1, $2, $3, $4)',
            ['tx_test_1', 'Transaction Test', 'Technology', '11-50']
          );

          // Force error
          throw new Error('Transaction error');
        })
      ).rejects.toThrow('Transaction error');

      // Verify company was not created
      const result = await db.query('SELECT * FROM companies WHERE id = $1', ['tx_test_1']);
      expect(result.rows).toHaveLength(0);
    });

    test('should commit transaction on success', async () => {
      await db.transaction(async (client) => {
        await client.query(
          'INSERT INTO companies (id, name, industry, size) VALUES ($1, $2, $3, $4)',
          ['tx_test_2', 'Transaction Success', 'Technology', '11-50']
        );
      });

      // Verify company was created
      const result = await db.query('SELECT * FROM companies WHERE id = $1', ['tx_test_2']);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].name).toBe('Transaction Success');
    });
  });
});
```

## 🎭 Mock Mode Testing

### Mock Fallback Tests

```javascript
// tests/integration/mock-fallback.test.js
import { MockDataService } from '../../src/infrastructure/mock/MockDataService.js';
import { ExternalAPIService } from '../../src/infrastructure/external/ExternalAPIService.js';

describe('Mock Fallback Tests', () => {
  let mockDataService;
  let externalAPIService;

  beforeEach(() => {
    mockDataService = new MockDataService();
    externalAPIService = new ExternalAPIService();
  });

  describe('Mock Data Service', () => {
    test('should return mock company data', async () => {
      const company = await mockDataService.getCompany('company_12345');

      expect(company).toBeDefined();
      expect(company.id).toBe('company_12345');
      expect(company.name).toBe('TechCorp Solutions');
      expect(company.industry).toBe('Technology');
    });

    test('should return mock employee data', async () => {
      const employee = await mockDataService.getEmployee('emp_12347');

      expect(employee).toBeDefined();
      expect(employee.id).toBe('emp_12347');
      expect(employee.firstName).toBe('Alice');
      expect(employee.lastName).toBe('Johnson');
      expect(employee.skills).toBeInstanceOf(Array);
    });

    test('should enrich employee profile with mock data', async () => {
      const enrichment = await mockDataService.enrichEmployeeProfile('emp_12347', ['linkedin', 'github']);

      expect(enrichment).toBeDefined();
      expect(enrichment.id).toBe('emp_12347');
      expect(enrichment.enrichmentStatus).toBe('completed');
      expect(enrichment.normalizedSkills).toBeInstanceOf(Array);
      expect(enrichment.relevanceScore).toBe(75);
    });

    test('should return mock skill gap data', async () => {
      const skillGap = await mockDataService.getSkillGap('emp_12347', 'Senior Engineer');

      expect(skillGap).toBeDefined();
      expect(skillGap.employeeId).toBe('emp_12347');
      expect(skillGap.careerGoal).toBe('Senior Engineer');
      expect(skillGap.skillGaps).toBeInstanceOf(Array);
      expect(skillGap.overallGapScore).toBe(65);
    });
  });

  describe('External API Service Mock Fallback', () => {
    test('should fallback to mock data when external API fails', async () => {
      // Mock external API failure
      jest.spyOn(externalAPIService, 'fetchFromSource').mockRejectedValue(new Error('API Error'));

      const employee = {
        id: 'emp_12347',
        firstName: 'Alice',
        lastName: 'Johnson',
        externalProfiles: {
          linkedin: 'https://linkedin.com/in/alicejohnson',
          github: 'alicejohnson'
        }
      };

      const enrichment = await externalAPIService.enrichProfile(employee, ['linkedin', 'github']);

      expect(enrichment).toBeDefined();
      expect(enrichment.skills).toBeInstanceOf(Array);
      expect(enrichment.sources).toContain('linkedin');
      expect(enrichment.sources).toContain('github');
    });
  });

  describe('Service Layer Mock Fallback', () => {
    test('should fallback to mock data in service layer', async () => {
      const companyService = new CompanyService(null, mockDataService); // No repository

      const company = await companyService.getCompany('company_12345');

      expect(company).toBeDefined();
      expect(company.id).toBe('company_12345');
      expect(company.name).toBe('TechCorp Solutions');
    });
  });
});
```

## 🌐 End-to-End Tests

### Company Workflow Tests

```javascript
// tests/e2e/company-workflow.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('Company Workflow E2E Tests', () => {
  describe('Complete Company Management Workflow', () => {
    test('should complete full company lifecycle', async () => {
      // 1. Create company
      const companyData = {
        name: 'E2E Test Company',
        industry: 'Technology',
        size: '11-50',
        description: 'End-to-end test company'
      };

      const createResponse = await request(app)
        .post('/api/v1/companies')
        .set('X-Company-ID', 'company_12345')
        .send(companyData)
        .expect(201);

      const companyId = createResponse.body.data.id;

      // 2. Get company details
      const getResponse = await request(app)
        .get(`/api/v1/companies/${companyId}`)
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(getResponse.body.data.name).toBe('E2E Test Company');

      // 3. Update company
      const updateResponse = await request(app)
        .put(`/api/v1/companies/${companyId}`)
        .set('X-Company-ID', 'company_12345')
        .send({ description: 'Updated description' })
        .expect(200);

      expect(updateResponse.body.data.description).toBe('Updated description');

      // 4. Get company hierarchy
      const hierarchyResponse = await request(app)
        .get(`/api/v1/companies/${companyId}/hierarchy`)
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(hierarchyResponse.body.data.departments).toBeInstanceOf(Array);

      // 5. Delete company
      const deleteResponse = await request(app)
        .delete(`/api/v1/companies/${companyId}`)
        .set('X-Company-ID', 'company_12345')
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
    });
  });
});
```

## 📊 Test Coverage

### Coverage Configuration

```javascript
// Coverage thresholds
const coverageThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './src/domain/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  './src/application/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85
  }
};
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🚀 Test Execution

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Tests with coverage
npm run test:coverage

# Tests in watch mode
npm run test:watch

# Tests in specific mode
USE_MOCK=true npm test
USE_MOCK=false npm test
```

### CI/CD Test Execution

```yaml
# GitHub Actions test matrix
strategy:
  matrix:
    node-version: [18.x]
    test-mode: [mock, live]

steps:
- name: Run tests in ${{ matrix.test-mode }} mode
  run: |
    USE_MOCK=${{ matrix.test-mode == 'mock' }} npm test
  env:
    NODE_ENV: test
    DB_NAME: directory_test
```

## 📋 Testing Best Practices

### Test Organization
- **Arrange**: Set up test data and mocks
- **Act**: Execute the code under test
- **Assert**: Verify the expected outcomes

### Test Naming
- Use descriptive test names
- Include the scenario being tested
- Specify expected behavior

### Mock Management
- Mock external dependencies
- Use realistic test data
- Clean up mocks between tests

### Error Testing
- Test both success and failure scenarios
- Verify error messages and codes
- Test edge cases and boundary conditions

This comprehensive testing strategy ensures the Directory Microservice is reliable, maintainable, and ready for production deployment.
