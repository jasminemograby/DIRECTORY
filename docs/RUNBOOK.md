# Directory Microservice Operations Runbook

## 🚀 Overview

This runbook provides comprehensive operational procedures for the Directory Microservice, including deployment, monitoring, maintenance, troubleshooting, and incident response.

## 📋 Table of Contents

1. [Deployment Procedures](#deployment-procedures)
2. [Environment Management](#environment-management)
3. [Monitoring & Health Checks](#monitoring--health-checks)
4. [Database Operations](#database-operations)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Incident Response](#incident-response)
7. [Maintenance Procedures](#maintenance-procedures)
8. [Backup & Recovery](#backup--recovery)
9. [Performance Optimization](#performance-optimization)
10. [Security Operations](#security-operations)

## 🚀 Deployment Procedures

### Initial Deployment

#### 1. Prerequisites
```bash
# Verify system requirements
node --version  # Should be 18.x+
docker --version  # Should be 20.x+
docker-compose --version  # Should be 2.x+

# Verify access to deployment platforms
# - Vercel account for frontend
# - Railway account for backend
# - Supabase account for database
```

#### 2. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd directory-microservice

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

#### 3. Database Deployment (Supabase)
```bash
# Create Supabase project
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Note connection string

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Verify deployment
npm run test:integration
```

#### 4. Backend Deployment (Railway)
```bash
# Connect GitHub repository to Railway
# 1. Go to https://railway.app
# 2. Connect GitHub repository
# 3. Configure environment variables
# 4. Deploy

# Verify deployment
curl https://your-backend-url.railway.app/health
```

#### 5. Frontend Deployment (Vercel)
```bash
# Connect GitHub repository to Vercel
# 1. Go to https://vercel.com
# 2. Import GitHub repository
# 3. Configure build settings
# 4. Set environment variables
# 5. Deploy

# Verify deployment
curl https://your-frontend-url.vercel.app
```

### Automated Deployment (CI/CD)

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Directory Microservice

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: ./scripts/deploy-staging.sh
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: ./scripts/deploy-production.sh
```

#### Deployment Scripts
```bash
#!/bin/bash
# scripts/deploy-staging.sh

echo "Deploying to staging environment..."

# Build and test
npm ci
npm run test
npm run build

# Deploy backend
railway deploy --environment staging

# Deploy frontend
vercel deploy --env staging

echo "Staging deployment complete!"
```

## 🌍 Environment Management

### Environment Configuration

#### Development Environment
```bash
# .env.development
NODE_ENV=development
PORT=3001
USE_MOCK=true
DATABASE_URL=postgresql://localhost:5432/directory_dev
LOG_LEVEL=debug
```

#### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
PORT=3001
USE_MOCK=false
DATABASE_URL=postgresql://staging-db-url
LOG_LEVEL=info
```

#### Production Environment
```bash
# .env.production
NODE_ENV=production
PORT=3001
USE_MOCK=false
DATABASE_URL=postgresql://production-db-url
LOG_LEVEL=warn
```

### Environment Switching

#### Manual Environment Switch
```bash
# Switch to mock mode
export USE_MOCK=true
npm run dev

# Switch to live mode
export USE_MOCK=false
npm run dev
```

#### Runtime Environment Switch
```bash
# Health check endpoint
curl -X POST https://your-backend-url/health/switch-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "mock"}'
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints

#### Basic Health Check
```bash
# Check service health
curl https://your-backend-url/health

# Expected response
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-12-19T10:00:00.000Z",
    "version": "1.0.0",
    "environment": "production",
    "mockMode": false,
    "database": "connected",
    "redis": "connected"
  }
}
```

#### Detailed Health Check
```bash
# Detailed health information
curl https://your-backend-url/health/detailed

# Expected response
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": {
        "status": "healthy",
        "responseTime": "45ms",
        "connections": 5
      },
      "redis": {
        "status": "healthy",
        "responseTime": "12ms"
      },
      "externalAPIs": {
        "linkedin": "healthy",
        "github": "healthy",
        "credly": "healthy"
      }
    }
  }
}
```

### Monitoring Setup

#### Application Metrics
```javascript
// Custom metrics collection
const metrics = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    averageResponseTime: 0
  },
  database: {
    queries: 0,
    averageQueryTime: 0,
    connectionPool: {
      active: 0,
      idle: 0,
      total: 0
    }
  },
  externalAPIs: {
    calls: 0,
    failures: 0,
    averageResponseTime: 0
  }
};
```

#### Log Monitoring
```bash
# View application logs
docker logs directory-backend

# View specific log levels
docker logs directory-backend | grep ERROR
docker logs directory-backend | grep WARN

# Follow logs in real-time
docker logs -f directory-backend
```

## 🗄️ Database Operations

### Database Maintenance

#### Connection Management
```bash
# Check database connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Check connection pool status
curl https://your-backend-url/health/database
```

#### Migration Management
```bash
# Run pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback
```

#### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_20241219_100000.sql
```

### Data Management

#### Seed Data
```bash
# Seed development data
npm run seed

# Seed specific data
npm run seed:companies
npm run seed:employees
npm run seed:trainers
```

#### Data Cleanup
```bash
# Clean up test data
npm run cleanup:test

# Archive old data
npm run archive:old-data
```

## 🔧 Troubleshooting Guide

### Common Issues

#### 1. Database Connection Issues
```bash
# Symptoms
- Health check shows database: "disconnected"
- API responses show source: "mock"
- Error logs show connection timeouts

# Diagnosis
curl https://your-backend-url/health/database
psql $DATABASE_URL -c "SELECT 1;"

# Resolution
# 1. Check DATABASE_URL environment variable
# 2. Verify database server is running
# 3. Check network connectivity
# 4. Verify credentials
```

#### 2. External API Failures
```bash
# Symptoms
- Enrichment endpoints return source: "mock"
- Error logs show API timeouts
- Health check shows external APIs: "unhealthy"

# Diagnosis
curl https://your-backend-url/health/external-apis
curl https://your-backend-url/api/v1/employees/emp_12347/enrich

# Resolution
# 1. Check API keys in environment variables
# 2. Verify API endpoints are accessible
# 3. Check rate limiting
# 4. Verify API quotas
```

#### 3. High Memory Usage
```bash
# Symptoms
- Application becomes slow
- Memory usage increases over time
- Potential out-of-memory errors

# Diagnosis
docker stats directory-backend
curl https://your-backend-url/health/memory

# Resolution
# 1. Check for memory leaks
# 2. Restart application
# 3. Increase memory limits
# 4. Optimize database queries
```

#### 4. Rate Limiting Issues
```bash
# Symptoms
- API returns 429 status codes
- Error logs show rate limit exceeded
- External API calls fail

# Diagnosis
curl -I https://your-backend-url/api/v1/companies
# Check X-RateLimit-* headers

# Resolution
# 1. Check rate limit configuration
# 2. Implement exponential backoff
# 3. Increase rate limits if appropriate
# 4. Use caching to reduce API calls
```

### Performance Issues

#### Slow Database Queries
```sql
-- Check slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

#### High CPU Usage
```bash
# Check CPU usage
docker stats directory-backend

# Profile application
npm run profile

# Check for infinite loops
grep -r "while\|for" src/
```

## 🚨 Incident Response

### Incident Classification

#### Severity Levels
- **P1 (Critical)**: Service completely down, data loss
- **P2 (High)**: Major functionality affected
- **P3 (Medium)**: Minor functionality affected
- **P4 (Low)**: Cosmetic issues, non-critical

### Incident Response Process

#### 1. Detection
```bash
# Automated monitoring alerts
# - Health check failures
# - Error rate spikes
# - Performance degradation
# - Security incidents
```

#### 2. Assessment
```bash
# Quick assessment
curl https://your-backend-url/health
curl https://your-backend-url/health/detailed

# Check logs
docker logs directory-backend --tail 100
```

#### 3. Response
```bash
# P1/P2 incidents
# 1. Immediate response (within 15 minutes)
# 2. Escalate to on-call engineer
# 3. Implement workaround if possible
# 4. Communicate to stakeholders

# P3/P4 incidents
# 1. Response within 4 hours
# 2. Document issue
# 3. Plan resolution
```

#### 4. Resolution
```bash
# Implement fix
# 1. Deploy hotfix if critical
# 2. Test in staging first
# 3. Deploy to production
# 4. Verify resolution
```

#### 5. Post-Incident
```bash
# Post-incident review
# 1. Document incident
# 2. Root cause analysis
# 3. Implement preventive measures
# 4. Update runbook
```

### Emergency Procedures

#### Service Recovery
```bash
# Restart services
docker-compose restart

# Rollback deployment
git revert <commit-hash>
npm run deploy:rollback

# Switch to mock mode
curl -X POST https://your-backend-url/health/switch-mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "mock"}'
```

#### Data Recovery
```bash
# Restore from backup
psql $DATABASE_URL < latest_backup.sql

# Verify data integrity
npm run verify:data-integrity
```

## 🔧 Maintenance Procedures

### Regular Maintenance

#### Daily Tasks
```bash
# Check service health
curl https://your-backend-url/health

# Review error logs
docker logs directory-backend | grep ERROR

# Check disk space
df -h
```

#### Weekly Tasks
```bash
# Update dependencies
npm audit
npm update

# Clean up logs
docker system prune

# Review performance metrics
npm run metrics:report
```

#### Monthly Tasks
```bash
# Security updates
npm audit fix
docker pull node:18-alpine

# Database maintenance
npm run db:vacuum
npm run db:analyze

# Backup verification
npm run backup:verify
```

### Version Updates

#### Application Updates
```bash
# Update application
git pull origin main
npm install
npm run test
npm run deploy

# Verify update
curl https://your-backend-url/health
```

#### Database Updates
```bash
# Run migrations
npm run migrate

# Verify schema
npm run db:verify-schema
```

#### Infrastructure Updates
```bash
# Update Docker images
docker-compose pull
docker-compose up -d

# Update Node.js version
# 1. Update Dockerfile
# 2. Test in staging
# 3. Deploy to production
```

## 💾 Backup & Recovery

### Backup Strategy

#### Database Backups
```bash
# Daily automated backups
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz

# Weekly full backups
pg_dump $DATABASE_URL --verbose --clean --no-owner --no-privileges > full_backup_$(date +%Y%m%d).sql

# Monthly archive backups
tar -czf archive_$(date +%Y%m).tar.gz backup_*.sql.gz
```

#### Application Backups
```bash
# Configuration backups
cp -r config/ backups/config_$(date +%Y%m%d)/

# Environment backups
cp .env.* backups/
```

### Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
gunzip -c backup_20241219.sql.gz | psql $DATABASE_URL

# Verify recovery
npm run verify:data-integrity
```

#### Application Recovery
```bash
# Restore from Git
git checkout <last-known-good-commit>
npm install
npm run deploy
```

## ⚡ Performance Optimization

### Performance Monitoring

#### Key Metrics
```bash
# Response times
curl -w "@curl-format.txt" https://your-backend-url/api/v1/companies

# Database performance
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Memory usage
docker stats directory-backend
```

#### Performance Tuning

#### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_employees_company_id ON employees(company_id);
CREATE INDEX CONCURRENTLY idx_employees_department_id ON employees(department_id);
CREATE INDEX CONCURRENTLY idx_employees_skills ON employees USING GIN(skills);

-- Analyze tables for query optimization
ANALYZE employees;
ANALYZE companies;
ANALYZE trainers;
```

#### Application Optimization
```javascript
// Connection pooling
const pool = new Pool({
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Caching
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Response compression
app.use(compression());
```

## 🔒 Security Operations

### Security Monitoring

#### Security Checks
```bash
# Vulnerability scanning
npm audit
docker scan directory-backend

# Security headers verification
curl -I https://your-backend-url/health

# Access log analysis
docker logs directory-backend | grep "403\|401\|500"
```

#### Security Incidents

#### Incident Response
```bash
# Immediate response
# 1. Isolate affected systems
# 2. Preserve evidence
# 3. Notify security team
# 4. Document incident

# Investigation
# 1. Analyze logs
# 2. Check for data breaches
# 3. Identify attack vector
# 4. Assess impact
```

#### Security Updates
```bash
# Update dependencies
npm audit fix
npm update

# Update base images
docker pull node:18-alpine

# Security patches
npm run security:update
```

### Access Control

#### User Management
```bash
# Review user access
psql $DATABASE_URL -c "SELECT * FROM audit_logs WHERE action = 'LOGIN' ORDER BY created_at DESC LIMIT 10;"

# Revoke access
psql $DATABASE_URL -c "UPDATE users SET status = 'inactive' WHERE id = 'user_id';"
```

#### API Key Management
```bash
# Rotate API keys
# 1. Generate new keys
# 2. Update environment variables
# 3. Deploy with new keys
# 4. Revoke old keys
```

## 📞 Support & Escalation

### Support Contacts

#### Internal Team
- **Primary On-Call**: [Contact Information]
- **Secondary On-Call**: [Contact Information]
- **Engineering Manager**: [Contact Information]
- **Security Team**: [Contact Information]

#### External Services
- **Vercel Support**: [Support Portal]
- **Railway Support**: [Support Portal]
- **Supabase Support**: [Support Portal]

### Escalation Procedures

#### Level 1: Initial Response
- **Response Time**: 15 minutes
- **Actions**: Basic troubleshooting, service restart

#### Level 2: Advanced Support
- **Response Time**: 1 hour
- **Actions**: Deep investigation, configuration changes

#### Level 3: Engineering Team
- **Response Time**: 4 hours
- **Actions**: Code changes, infrastructure modifications

#### Level 4: Management
- **Response Time**: 8 hours
- **Actions**: Business decisions, resource allocation

## 📋 Maintenance Checklist

### Daily Checklist
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor performance metrics
- [ ] Verify backup completion

### Weekly Checklist
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Clean up logs
- [ ] Performance analysis

### Monthly Checklist
- [ ] Security updates
- [ ] Database maintenance
- [ ] Backup verification
- [ ] Capacity planning

### Quarterly Checklist
- [ ] Disaster recovery testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation review

---

This runbook provides comprehensive operational procedures for the Directory Microservice. Regular updates and reviews ensure the procedures remain current and effective.
