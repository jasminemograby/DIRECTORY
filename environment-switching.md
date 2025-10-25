# Directory Microservice - Environment-Based Switching

## Environment Configuration System

The Directory microservice implements a comprehensive environment-based switching system that allows seamless transition between mock and real API implementations across different environments.

## Environment Configuration

### 1. Environment Variables
```javascript
// backend/src/config/environment.js
const environments = {
    development: {
        // Always use mock data in development
        useMockData: true,
        mockDelay: true,
        mockErrors: false,
        logLevel: 'debug',
        database: {
            url: process.env.DEV_DATABASE_URL,
            ssl: false
        },
        externalApis: {
            linkedin: { useMock: true, timeout: 5000 },
            github: { useMock: true, timeout: 5000 },
            credly: { useMock: true, timeout: 5000 },
            gemini: { useMock: true, timeout: 8000 },
            orcid: { useMock: true, timeout: 5000 },
            crossref: { useMock: true, timeout: 5000 },
            youtube: { useMock: true, timeout: 5000 }
        },
        internalServices: {
            auth: { useMock: true, timeout: 3000 },
            skillsEngine: { useMock: true, timeout: 5000 },
            marketplace: { useMock: true, timeout: 5000 },
            contentStudio: { useMock: true, timeout: 5000 },
            courseBuilder: { useMock: true, timeout: 5000 },
            devlab: { useMock: true, timeout: 5000 },
            analytics: { useMock: true, timeout: 5000 },
            cca: { useMock: true, timeout: 5000 },
            assessment: { useMock: true, timeout: 5000 },
            sendpulse: { useMock: true, timeout: 3000 },
            sendgrid: { useMock: true, timeout: 3000 }
        }
    },

    staging: {
        // Mixed mode - some real, some mock
        useMockData: process.env.USE_MOCK_DATA === 'true',
        mockDelay: true,
        mockErrors: true,
        logLevel: 'info',
        database: {
            url: process.env.STAGING_DATABASE_URL,
            ssl: true
        },
        externalApis: {
            linkedin: { useMock: process.env.LINKEDIN_USE_MOCK === 'true', timeout: 10000 },
            github: { useMock: process.env.GITHUB_USE_MOCK === 'true', timeout: 10000 },
            credly: { useMock: process.env.CREDLY_USE_MOCK === 'true', timeout: 10000 },
            gemini: { useMock: process.env.GEMINI_USE_MOCK === 'true', timeout: 15000 },
            orcid: { useMock: process.env.ORCID_USE_MOCK === 'true', timeout: 10000 },
            crossref: { useMock: process.env.CROSSREF_USE_MOCK === 'true', timeout: 10000 },
            youtube: { useMock: process.env.YOUTUBE_USE_MOCK === 'true', timeout: 10000 }
        },
        internalServices: {
            auth: { useMock: process.env.AUTH_USE_MOCK === 'true', timeout: 5000 },
            skillsEngine: { useMock: process.env.SKILLS_USE_MOCK === 'true', timeout: 8000 },
            marketplace: { useMock: process.env.MARKETPLACE_USE_MOCK === 'true', timeout: 8000 },
            contentStudio: { useMock: process.env.CONTENT_USE_MOCK === 'true', timeout: 8000 },
            courseBuilder: { useMock: process.env.COURSE_USE_MOCK === 'true', timeout: 8000 },
            devlab: { useMock: process.env.DEVLAB_USE_MOCK === 'true', timeout: 8000 },
            analytics: { useMock: process.env.ANALYTICS_USE_MOCK === 'true', timeout: 8000 },
            cca: { useMock: process.env.CCA_USE_MOCK === 'true', timeout: 8000 },
            assessment: { useMock: process.env.ASSESSMENT_USE_MOCK === 'true', timeout: 8000 },
            sendpulse: { useMock: process.env.SENDPULSE_USE_MOCK === 'true', timeout: 5000 },
            sendgrid: { useMock: process.env.SENDGRID_USE_MOCK === 'true', timeout: 5000 }
        }
    },

    production: {
        // Real APIs with fallback to mock
        useMockData: process.env.USE_MOCK_DATA === 'true',
        mockDelay: false,
        mockErrors: false,
        logLevel: 'warn',
        database: {
            url: process.env.PRODUCTION_DATABASE_URL,
            ssl: true
        },
        externalApis: {
            linkedin: { useMock: false, timeout: 15000, fallbackToMock: true },
            github: { useMock: false, timeout: 15000, fallbackToMock: true },
            credly: { useMock: false, timeout: 15000, fallbackToMock: true },
            gemini: { useMock: false, timeout: 20000, fallbackToMock: true },
            orcid: { useMock: false, timeout: 15000, fallbackToMock: true },
            crossref: { useMock: false, timeout: 15000, fallbackToMock: true },
            youtube: { useMock: false, timeout: 15000, fallbackToMock: true }
        },
        internalServices: {
            auth: { useMock: false, timeout: 8000, fallbackToMock: true },
            skillsEngine: { useMock: false, timeout: 12000, fallbackToMock: true },
            marketplace: { useMock: false, timeout: 12000, fallbackToMock: true },
            contentStudio: { useMock: false, timeout: 12000, fallbackToMock: true },
            courseBuilder: { useMock: false, timeout: 12000, fallbackToMock: true },
            devlab: { useMock: false, timeout: 12000, fallbackToMock: true },
            analytics: { useMock: false, timeout: 12000, fallbackToMock: true },
            cca: { useMock: false, timeout: 12000, fallbackToMock: true },
            assessment: { useMock: false, timeout: 12000, fallbackToMock: true },
            sendpulse: { useMock: false, timeout: 8000, fallbackToMock: true },
            sendgrid: { useMock: false, timeout: 8000, fallbackToMock: true }
        }
    }
};

export const getEnvironmentConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return environments[env] || environments.development;
};

export const getServiceConfig = (serviceType, serviceName) => {
    const config = getEnvironmentConfig();
    return config[serviceType][serviceName];
};
```

### 2. Service Configuration Manager
```javascript
// backend/src/config/ServiceConfigManager.js
class ServiceConfigManager {
    constructor() {
        this.config = getEnvironmentConfig();
        this.circuitBreakers = new Map();
    }

    shouldUseMockData(serviceType, serviceName) {
        const serviceConfig = this.config[serviceType][serviceName];
        return serviceConfig.useMock;
    }

    shouldFallbackToMock(serviceType, serviceName) {
        const serviceConfig = this.config[serviceType][serviceName];
        return serviceConfig.fallbackToMock || false;
    }

    getTimeout(serviceType, serviceName) {
        const serviceConfig = this.config[serviceType][serviceName];
        return serviceConfig.timeout || 10000;
    }

    getCircuitBreaker(serviceName) {
        if (!this.circuitBreakers.has(serviceName)) {
            this.circuitBreakers.set(serviceName, new CircuitBreaker(5, 60000));
        }
        return this.circuitBreakers.get(serviceName);
    }

    isServiceHealthy(serviceName) {
        const circuitBreaker = this.getCircuitBreaker(serviceName);
        return circuitBreaker.state !== 'OPEN';
    }
}

export const serviceConfigManager = new ServiceConfigManager();
```

## API Client Base Class

### 1. Base API Client
```javascript
// backend/src/infrastructure/common/BaseApiClient.js
class BaseApiClient {
    constructor(serviceType, serviceName, mockDataService) {
        this.serviceType = serviceType;
        this.serviceName = serviceName;
        this.mockDataService = mockDataService;
        this.config = serviceConfigManager;
        this.baseUrl = this.getBaseUrl();
        this.apiKey = this.getApiKey();
    }

    getBaseUrl() {
        const envVar = `${this.serviceName.toUpperCase()}_URL`;
        return process.env[envVar];
    }

    getApiKey() {
        const envVar = `${this.serviceName.toUpperCase()}_KEY`;
        return process.env[envVar];
    }

    async makeRequest(endpoint, options = {}) {
        const shouldUseMock = this.config.shouldUseMockData(this.serviceType, this.serviceName);
        const shouldFallback = this.config.shouldFallbackToMock(this.serviceType, this.serviceName);
        const timeout = this.config.getTimeout(this.serviceType, this.serviceName);

        if (shouldUseMock) {
            return await this.getMockResponse(endpoint, options);
        }

        try {
            const circuitBreaker = this.config.getCircuitBreaker(this.serviceName);
            return await circuitBreaker.execute(async () => {
                return await this.makeRealApiCall(endpoint, options, timeout);
            });
        } catch (error) {
            if (shouldFallback) {
                console.warn(`${this.serviceName} API failed, falling back to mock: ${error.message}`);
                return await this.getMockResponse(endpoint, options);
            }
            throw error;
        }
    }

    async getMockResponse(endpoint, options) {
        const mockEndpoint = `${this.serviceName}/${endpoint}`;
        return await this.mockDataService.getMockResponse(mockEndpoint, options);
    }

    async makeRealApiCall(endpoint, options, timeout) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}
```

### 2. Specific Service Clients
```javascript
// backend/src/infrastructure/external/linkedin/LinkedInClient.js
class LinkedInClient extends BaseApiClient {
    constructor(mockDataService) {
        super('externalApis', 'linkedin', mockDataService);
    }

    async getProfile(linkedinId) {
        return await this.makeRequest(`/people/${linkedinId}`, {
            method: 'GET'
        });
    }

    async getConnections(linkedinId) {
        return await this.makeRequest(`/people/${linkedinId}/connections`, {
            method: 'GET'
        });
    }
}

// backend/src/infrastructure/internal/auth/AuthServiceClient.js
class AuthServiceClient extends BaseApiClient {
    constructor(mockDataService) {
        super('internalServices', 'auth', mockDataService);
    }

    async verifyUser(userId) {
        return await this.makeRequest(`/verify/${userId}`, {
            method: 'GET'
        });
    }

    async getUserRoles(userId) {
        return await this.makeRequest(`/users/${userId}/roles`, {
            method: 'GET'
        });
    }
}
```

## Runtime Configuration Switching

### 1. Configuration API Endpoints
```javascript
// backend/src/interfaces/controllers/ConfigController.js
class ConfigController {
    async getServiceStatus(req, res) {
        const services = {
            external: {},
            internal: {}
        };

        // Check external API status
        for (const [serviceName, config] of Object.entries(serviceConfigManager.config.externalApis)) {
            services.external[serviceName] = {
                useMock: config.useMock,
                healthy: serviceConfigManager.isServiceHealthy(serviceName),
                timeout: config.timeout
            };
        }

        // Check internal service status
        for (const [serviceName, config] of Object.entries(serviceConfigManager.config.internalServices)) {
            services.internal[serviceName] = {
                useMock: config.useMock,
                healthy: serviceConfigManager.isServiceHealthy(serviceName),
                timeout: config.timeout
            };
        }

        res.json({
            environment: process.env.NODE_ENV,
            services,
            timestamp: new Date().toISOString()
        });
    }

    async updateServiceConfig(req, res) {
        const { serviceType, serviceName, useMock } = req.body;
        
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ error: 'Configuration changes not allowed in production' });
        }

        serviceConfigManager.config[serviceType][serviceName].useMock = useMock;
        
        res.json({
            message: `Service ${serviceName} configuration updated`,
            useMock,
            timestamp: new Date().toISOString()
        });
    }
}
```

### 2. Health Check Endpoints
```javascript
// backend/src/interfaces/controllers/HealthController.js
class HealthController {
    async healthCheck(req, res) {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {},
            database: await this.checkDatabaseHealth(),
            environment: process.env.NODE_ENV
        };

        // Check all service health
        for (const serviceType of ['externalApis', 'internalServices']) {
            health.services[serviceType] = {};
            for (const serviceName of Object.keys(serviceConfigManager.config[serviceType])) {
                health.services[serviceType][serviceName] = {
                    healthy: serviceConfigManager.isServiceHealthy(serviceName),
                    useMock: serviceConfigManager.shouldUseMockData(serviceType, serviceName)
                };
            }
        }

        const allHealthy = Object.values(health.services)
            .flatMap(services => Object.values(services))
            .every(service => service.healthy);

        health.status = allHealthy ? 'healthy' : 'degraded';

        res.status(allHealthy ? 200 : 503).json(health);
    }

    async checkDatabaseHealth() {
        try {
            // Simple database query to check connectivity
            await database.query('SELECT 1');
            return { status: 'healthy', connected: true };
        } catch (error) {
            return { status: 'unhealthy', connected: false, error: error.message };
        }
    }
}
```

## Environment Variables Template

### 1. Development Environment
```bash
# .env.development
NODE_ENV=development
USE_MOCK_DATA=true

# Database
DEV_DATABASE_URL=postgresql://user:password@localhost:5432/directory_dev

# External APIs (Mock Mode)
LINKEDIN_USE_MOCK=true
GITHUB_USE_MOCK=true
CREDLY_USE_MOCK=true
GEMINI_USE_MOCK=true
ORCID_USE_MOCK=true
CROSSREF_USE_MOCK=true
YOUTUBE_USE_MOCK=true

# Internal Services (Mock Mode)
AUTH_USE_MOCK=true
SKILLS_USE_MOCK=true
MARKETPLACE_USE_MOCK=true
CONTENT_USE_MOCK=true
COURSE_USE_MOCK=true
DEVLAB_USE_MOCK=true
ANALYTICS_USE_MOCK=true
CCA_USE_MOCK=true
ASSESSMENT_USE_MOCK=true
SENDPULSE_USE_MOCK=true
SENDGRID_USE_MOCK=true
```

### 2. Staging Environment
```bash
# .env.staging
NODE_ENV=staging
USE_MOCK_DATA=false

# Database
STAGING_DATABASE_URL=postgresql://user:password@staging-db:5432/directory_staging

# External APIs (Mixed Mode)
LINKEDIN_USE_MOCK=false
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_API_KEY=your_linkedin_api_key

GITHUB_USE_MOCK=true
GITHUB_API_URL=https://api.github.com
GITHUB_API_KEY=your_github_api_key

# Internal Services (Real APIs)
AUTH_USE_MOCK=false
AUTH_SERVICE_URL=https://auth-service.staging.yourdomain.com
AUTH_SERVICE_KEY=your_auth_service_key

SKILLS_USE_MOCK=true
SKILLS_ENGINE_URL=https://skills-engine.staging.yourdomain.com
SKILLS_ENGINE_KEY=your_skills_engine_key
```

### 3. Production Environment
```bash
# .env.production
NODE_ENV=production
USE_MOCK_DATA=false

# Database
PRODUCTION_DATABASE_URL=postgresql://user:password@prod-db:5432/directory_prod

# External APIs (Real APIs with Fallback)
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_API_KEY=your_production_linkedin_api_key

GITHUB_API_URL=https://api.github.com
GITHUB_API_KEY=your_production_github_api_key

# Internal Services (Real APIs with Fallback)
AUTH_SERVICE_URL=https://auth-service.yourdomain.com
AUTH_SERVICE_KEY=your_production_auth_service_key

SKILLS_ENGINE_URL=https://skills-engine.yourdomain.com
SKILLS_ENGINE_KEY=your_production_skills_engine_key
```

## Monitoring and Observability

### 1. Service Status Monitoring
```javascript
// backend/src/infrastructure/monitoring/ServiceMonitor.js
class ServiceMonitor {
    constructor() {
        this.metrics = new Map();
        this.alerts = [];
    }

    recordApiCall(serviceName, success, duration, usedMock) {
        const key = `${serviceName}_${usedMock ? 'mock' : 'real'}`;
        if (!this.metrics.has(key)) {
            this.metrics.set(key, {
                totalCalls: 0,
                successfulCalls: 0,
                failedCalls: 0,
                totalDuration: 0,
                averageDuration: 0
            });
        }

        const metric = this.metrics.get(key);
        metric.totalCalls++;
        metric.totalDuration += duration;
        metric.averageDuration = metric.totalDuration / metric.totalCalls;

        if (success) {
            metric.successfulCalls++;
        } else {
            metric.failedCalls++;
        }

        // Check for alerts
        this.checkAlerts(serviceName, metric);
    }

    checkAlerts(serviceName, metric) {
        const failureRate = metric.failedCalls / metric.totalCalls;
        if (failureRate > 0.1 && metric.totalCalls > 10) {
            this.alerts.push({
                service: serviceName,
                type: 'high_failure_rate',
                message: `High failure rate detected: ${(failureRate * 100).toFixed(2)}%`,
                timestamp: new Date().toISOString()
            });
        }
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    getAlerts() {
        return this.alerts;
    }
}
```

This environment-based switching system provides complete flexibility for development, testing, and production environments while ensuring the Directory microservice can operate independently with comprehensive mock data when needed.
