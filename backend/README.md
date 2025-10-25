# Directory Microservice Backend

B2B SaaS corporate learning platform organizational backbone microservice backend implementation.

## 🏗️ Architecture

This backend follows **Onion Architecture** (Clean Architecture) principles:

```
src/
├── domain/           # Core business entities and rules
├── application/      # Use cases and business logic
├── infrastructure/   # External concerns (DB, APIs, etc.)
└── interfaces/       # Controllers, routes, middleware
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup:**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm run health` - Check API health

## 🔧 Configuration

### Environment Variables

Key environment variables (see `env.example` for complete list):

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `USE_MOCK` - Enable mock data fallback (true/false)

### Mock Data Mode

When `USE_MOCK=true`, the API automatically falls back to mock JSON data if:
- Database connection fails
- External API calls fail
- Data is not yet implemented

Mock data files are located in `/database/mocks/` and follow the naming pattern `mock-[entity].json`.

## 🛠️ API Endpoints

### Companies
- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/:id` - Get company details
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company

### Employees
- `GET /api/v1/employees` - List employees
- `GET /api/v1/employees/:id` - Get employee details
- `GET /api/v1/employees/:id/profile` - Get employee profile
- `PATCH /api/v1/employees/:id/skills` - Update employee skills
- `POST /api/v1/employees/:id/enrich` - Enrich employee profile
- `GET /api/v1/employees/:id/skill-gap` - Get skill gaps
- `GET /api/v1/employees/:id/relevance` - Get relevance score

### Trainers
- `GET /api/v1/trainers` - List trainers
- `GET /api/v1/trainers/:id` - Get trainer details
- `POST /api/v1/trainers` - Create trainer
- `PUT /api/v1/trainers/:id` - Update trainer
- `DELETE /api/v1/trainers/:id` - Delete trainer

### Training Requests
- `GET /api/v1/training-requests` - List training requests
- `GET /api/v1/training-requests/:id` - Get training request details
- `POST /api/v1/training-requests` - Create training request
- `PUT /api/v1/training-requests/:id` - Update training request
- `PATCH /api/v1/training-requests/:id/approve` - Approve request
- `PATCH /api/v1/training-requests/:id/reject` - Reject request

### Health & Monitoring
- `GET /health` - Health check endpoint
- `GET /metrics` - Application metrics (if enabled)

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **JWT Authentication** - Token-based authentication
- **Input Validation** - Request validation with Joi
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests** - Test individual functions and classes
- **Integration Tests** - Test API endpoints and database interactions
- **Mock Tests** - Test mock data fallback functionality

## 📊 Monitoring & Logging

### Logging

Uses Winston for structured logging with different levels:
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages

### Health Checks

The `/health` endpoint provides:
- Database connectivity status
- Redis connectivity status
- External API status
- Application uptime
- Memory usage

## 🐳 Docker Support

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker build -f Dockerfile.prod -t directory-backend .
docker run -p 3001:3001 directory-backend
```

## 🔄 Rollback to Mock Data

The system automatically falls back to mock data when:

1. **Database Connection Fails**
   - Returns mock data with `source: "mock"`
   - Logs the fallback event

2. **External API Failures**
   - Uses mock responses for external integrations
   - Continues normal operation

3. **Development Mode**
   - When `USE_MOCK=true`
   - All endpoints return mock data

## 📈 Performance

### Optimization Features

- **Connection Pooling** - PostgreSQL connection pooling
- **Redis Caching** - Optional Redis caching layer
- **Compression** - Gzip compression for responses
- **Rate Limiting** - Prevents abuse and overload

### Monitoring

- Request/response times
- Database query performance
- Memory usage
- Error rates

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables:**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-production-secret
   USE_MOCK=false
   ```

2. **Database Migration:**
   ```bash
   npm run migrate
   ```

3. **Start Application:**
   ```bash
   npm start
   ```

### Railway Deployment

The backend is configured for Railway deployment with:
- Automatic builds from Git
- Environment variable configuration
- Health check endpoints
- Log aggregation

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Mock Data Not Loading**
   - Check `USE_MOCK=true` in `.env`
   - Verify mock files exist in `/database/mocks/`
   - Check file permissions

3. **External API Failures**
   - Verify API keys in `.env`
   - Check network connectivity
   - Review rate limiting settings

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

## 📚 API Documentation

For detailed API documentation, see:
- `/docs/API.md` - Complete API reference
- `/docs/ARCHITECTURE.md` - Architecture overview
- `/docs/SECURITY.md` - Security implementation

## 🤝 Contributing

1. Follow the Onion Architecture pattern
2. Write tests for new features
3. Use ESLint and Prettier for code formatting
4. Update documentation for API changes
5. Ensure mock data fallback works

## 📄 License

MIT License - see LICENSE file for details.
