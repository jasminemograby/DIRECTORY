# Directory Microservice - Complete Documentation

## 🎯 Project Overview

The Directory Microservice is a comprehensive B2B SaaS organizational backbone service for corporate learning platforms. Built with Onion Architecture principles, it provides robust company directory management, employee profiles, trainer information, and training request workflows with automatic rollback-to-mock data capabilities.

## 📚 Documentation Structure

### Core Documentation
- **[API.md](./API.md)** - Complete REST API documentation with examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[SECURITY.md](./SECURITY.md)** - Security implementation and compliance
- **[TESTING.md](./TESTING.md)** - Testing strategy and implementation
- **[ROADMAP.md](./ROADMAP.md)** - Project roadmap and milestones
- **[RUNBOOK.md](./RUNBOOK.md)** - Operations and maintenance procedures

### Quick Start Guides
- **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** - Production readiness checklist
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Developer setup and workflow

## 🏗️ Architecture Highlights

### Onion Architecture Implementation
- **Domain Layer**: Core business entities and rules
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External concerns (database, APIs, file system)
- **Presentation Layer**: HTTP controllers and routes

### Rollback-to-Mock System
- Automatic fallback when database connections fail
- External API service unavailability handling
- Internal microservice failure recovery
- Seamless mock/live mode switching

### Multi-Environment Support
- Development (mock mode enabled)
- Staging (configurable mock/live mode)
- Production (live mode with mock fallback)

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+ (optional)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd directory-microservice

# Install dependencies
npm install

# Start development environment
docker-compose up -d
npm run migrate
npm run seed
npm run dev
```

### Verify Installation
```bash
# Health check
curl http://localhost:3001/health

# Test API
curl http://localhost:3001/api/v1/companies \
  -H "X-Company-ID: company_12345"
```

## 🔧 Configuration

### Environment Variables
```bash
# Core Configuration
NODE_ENV=development
PORT=3001
USE_MOCK=true

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/directory_db

# External APIs
LINKEDIN_API_KEY=your_key
GITHUB_API_KEY=your_key
CREDLY_API_KEY=your_key
GEMINI_API_KEY=your_key
ORCID_API_KEY=your_key

# Internal Services
SKILLS_ENGINE_URL=http://localhost:3002
AUTH_SERVICE_URL=http://localhost:3003
MARKETPLACE_URL=http://localhost:3004
HR_REPORTING_SERVICE_URL=http://localhost:3005
```

## 📊 API Overview

### Base URL
- Development: `http://localhost:3001`
- Staging: `https://staging-directory.example.com`
- Production: `https://directory.example.com`

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "source": "live|mock",
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Key Endpoints
- `GET /api/v1/companies` - List companies
- `GET /api/v1/employees` - List employees
- `POST /api/v1/employees/{id}/enrich` - Enrich employee profile
- `GET /api/v1/trainers` - List trainers
- `GET /api/v1/training-requests` - List training requests

## 🧪 Testing

### Test Suite
```bash
# All tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Test Modes
- **Mock Mode**: Uses JSON-based mock data
- **Live Mode**: Uses real database and external APIs
- **Both modes tested** in CI/CD pipeline

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **Build & Test**: Linting, unit tests, integration tests
2. **Docker Build**: Multi-environment image creation
3. **Deploy**: Environment-specific deployment
4. **Rollback**: Automatic rollback on failure

### Environment Promotion
- `develop` → Staging
- `main` → Production
- Manual deployment via GitHub Actions UI

## 🏥 Monitoring & Health

### Health Check
```http
GET /health
```

### Monitoring Features
- Comprehensive logging with Winston
- Health check endpoints
- Performance metrics
- Error tracking and alerting

## 🔒 Security

### Security Features
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Compliance
- GDPR compliance
- Data encryption
- Audit logging
- Access control

## 📈 Performance

### Optimization Features
- Connection pooling
- Redis caching
- Compression middleware
- Efficient database queries
- Lazy loading

## 🆘 Support

### Getting Help
- Check documentation
- Review existing issues
- Run health checks
- Check logs for errors

### Common Issues
1. **Database Connection Failed**: Check DB credentials
2. **External API Errors**: Verify API keys
3. **Mock Mode Not Working**: Check USE_MOCK variable
4. **Tests Failing**: Ensure test database is running

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process
6. Merge to develop/main

---

**Ready for Production Deployment** ✅
