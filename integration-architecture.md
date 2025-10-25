# Directory Microservice - Integration Architecture

## Integration Overview

The Directory microservice integrates with 11 internal microservices and 7 external APIs, all implemented with comprehensive mock fallback mechanisms. All integrations follow REST-only communication patterns with environment-based switching between real and mock implementations.

## Internal Microservice Integrations

### 1. Auth Service Integration
```javascript
// backend/src/infrastructure/internal/auth/AuthServiceClient.js
class AuthServiceClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.AUTH_SERVICE_URL;
        this.apiKey = process.env.AUTH_SERVICE_KEY;
        this.mockDataService = mockDataService;
    }

    async verifyUser(userId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('auth/verify', { userId });
            }

            const response = await fetch(`${this.baseUrl}/verify/${userId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('auth/verify', { userId });
        }
    }

    async getUserRoles(userId) {
        // Similar implementation with mock fallback
    }

    async checkPermissions(userId, resource, action) {
        // Similar implementation with mock fallback
    }
}
```

**Mock Response Example:**
```json
{
  "user_id": "user_12345",
  "is_verified": true,
  "roles": ["employee"],
  "permissions": ["read_profile", "update_own_profile"],
  "company_id": "company_12345",
  "last_login": "2024-12-19T10:30:00Z"
}
```

### 2. Skills Engine Integration
```javascript
// backend/src/infrastructure/internal/skills/SkillsEngineClient.js
class SkillsEngineClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.SKILLS_ENGINE_URL;
        this.apiKey = process.env.SKILLS_ENGINE_KEY;
        this.mockDataService = mockDataService;
    }

    async normalizeSkills(rawSkills) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('skills/normalize', { rawSkills });
            }

            const response = await fetch(`${this.baseUrl}/normalize`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ skills: rawSkills })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('skills/normalize', { rawSkills });
        }
    }

    async verifySkills(employeeId, skills) {
        // Similar implementation with mock fallback
    }

    async analyzeSkillGaps(employeeId, careerPath) {
        // Similar implementation with mock fallback
    }
}
```

**Mock Response Example:**
```json
{
  "normalized_skills": [
    {
      "original": "JS",
      "normalized": "JavaScript",
      "category": "Programming Languages",
      "level": "expert",
      "verified": true
    }
  ],
  "skill_gaps": [
    {
      "skill": "Machine Learning",
      "priority": "high",
      "recommended_courses": ["ML Fundamentals"]
    }
  ],
  "relevance_score": 0.85
}
```

### 3. Marketplace Integration
```javascript
// backend/src/infrastructure/internal/marketplace/MarketplaceClient.js
class MarketplaceClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.MARKETPLACE_URL;
        this.apiKey = process.env.MARKETPLACE_KEY;
        this.mockDataService = mockDataService;
    }

    async findTrainers(skills, location, availability) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('marketplace/match', { skills, location, availability });
            }

            const response = await fetch(`${this.baseUrl}/trainers/search`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ skills, location, availability })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('marketplace/match', { skills, location, availability });
        }
    }

    async createFallbackCourse(trainingRequest) {
        // Similar implementation with mock fallback
    }
}
```

**Mock Response Example:**
```json
{
  "matched_trainers": [
    {
      "trainer_id": "trainer_12345",
      "name": "Jane Doe",
      "skills": ["JavaScript", "React"],
      "rating": 4.8,
      "availability": "2024-12-20",
      "price_per_hour": 150
    }
  ],
  "fallback_course": {
    "course_id": "course_67890",
    "title": "JavaScript Fundamentals",
    "created_by": "system",
    "estimated_duration": 40
  }
}
```

### 4. Content Studio Integration
```javascript
// backend/src/infrastructure/internal/content/ContentStudioClient.js
class ContentStudioClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.CONTENT_STUDIO_URL;
        this.apiKey = process.env.CONTENT_STUDIO_KEY;
        this.mockDataService = mockDataService;
    }

    async createContent(trainerId, contentData) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('content/create', { trainerId, contentData });
            }

            const response = await fetch(`${this.baseUrl}/content`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ trainerId, ...contentData })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('content/create', { trainerId, contentData });
        }
    }

    async updateContentStatus(courseId, status) {
        // Similar implementation with mock fallback
    }
}
```

### 5. Course Builder Integration
```javascript
// backend/src/infrastructure/internal/course/CourseBuilderClient.js
class CourseBuilderClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.COURSE_BUILDER_URL;
        this.apiKey = process.env.COURSE_BUILDER_KEY;
        this.mockDataService = mockDataService;
    }

    async getLearningFeedback(employeeId, courseId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('course/feedback', { employeeId, courseId });
            }

            const response = await fetch(`${this.baseUrl}/feedback/${employeeId}/${courseId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('course/feedback', { employeeId, courseId });
        }
    }
}
```

### 6. DevLab Integration
```javascript
// backend/src/infrastructure/internal/devlab/DevLabClient.js
class DevLabClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.DEVLAB_URL;
        this.apiKey = process.env.DEVLAB_KEY;
        this.mockDataService = mockDataService;
    }

    async provisionExercises(employeeId, courseData) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('devlab/provision', { employeeId, courseData });
            }

            const response = await fetch(`${this.baseUrl}/exercises/provision`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ employeeId, ...courseData })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('devlab/provision', { employeeId, courseData });
        }
    }
}
```

### 7. Learning Analytics Integration
```javascript
// backend/src/infrastructure/internal/analytics/LearningAnalyticsClient.js
class LearningAnalyticsClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.LEARNING_ANALYTICS_URL;
        this.apiKey = process.env.LEARNING_ANALYTICS_KEY;
        this.mockDataService = mockDataService;
    }

    async sendCompanyData(companyId, employeeData) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('analytics/company-data', { companyId, employeeData });
            }

            const response = await fetch(`${this.baseUrl}/company-data`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ companyId, employeeData })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('analytics/company-data', { companyId, employeeData });
        }
    }
}
```

### 8. Contextual Corporate Assistant (CCA) Integration
```javascript
// backend/src/infrastructure/internal/cca/CCAClient.js
class CCAClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.CCA_URL;
        this.apiKey = process.env.CCA_KEY;
        this.mockDataService = mockDataService;
    }

    async provideRAGData(companyId, context) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('cca/rag-data', { companyId, context });
            }

            const response = await fetch(`${this.baseUrl}/rag-data`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ companyId, context })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('cca/rag-data', { companyId, context });
        }
    }
}
```

### 9. Assessment Integration
```javascript
// backend/src/infrastructure/internal/assessment/AssessmentClient.js
class AssessmentClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.ASSESSMENT_URL;
        this.apiKey = process.env.ASSESSMENT_KEY;
        this.mockDataService = mockDataService;
    }

    async configureAssessment(employeeId, skills) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('assessment/configure', { employeeId, skills });
            }

            const response = await fetch(`${this.baseUrl}/configure`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ employeeId, skills })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('assessment/configure', { employeeId, skills });
        }
    }
}
```

### 10. SendPulse Integration
```javascript
// backend/src/infrastructure/internal/notifications/SendPulseClient.js
class SendPulseClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.SENDPULSE_URL;
        this.apiKey = process.env.SENDPULSE_KEY;
        this.mockDataService = mockDataService;
    }

    async sendInAppNotification(userId, notification) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('sendpulse/notification', { userId, notification });
            }

            const response = await fetch(`${this.baseUrl}/notifications`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ userId, ...notification })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('sendpulse/notification', { userId, notification });
        }
    }
}
```

### 11. SendGrid Integration
```javascript
// backend/src/infrastructure/internal/notifications/SendGridClient.js
class SendGridClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.SENDGRID_URL;
        this.apiKey = process.env.SENDGRID_KEY;
        this.mockDataService = mockDataService;
    }

    async sendEmail(to, template, data) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('sendgrid/email', { to, template, data });
            }

            const response = await fetch(`${this.baseUrl}/send`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ to, template, data })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('sendgrid/email', { to, template, data });
        }
    }
}
```

## External API Integrations

### 1. LinkedIn API Integration
```javascript
// backend/src/infrastructure/external/linkedin/LinkedInClient.js
class LinkedInClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.LINKEDIN_API_URL;
        this.apiKey = process.env.LINKEDIN_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getProfile(linkedinId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('linkedin/profile', { linkedinId });
            }

            const response = await fetch(`${this.baseUrl}/people/${linkedinId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('linkedin/profile', { linkedinId });
        }
    }

    async getConnections(linkedinId) {
        // Similar implementation with mock fallback
    }
}
```

### 2. GitHub API Integration
```javascript
// backend/src/infrastructure/external/github/GitHubClient.js
class GitHubClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.GITHUB_API_URL;
        this.apiKey = process.env.GITHUB_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getProfile(username) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('github/profile', { username });
            }

            const response = await fetch(`${this.baseUrl}/users/${username}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('github/profile', { username });
        }
    }

    async getRepositories(username) {
        // Similar implementation with mock fallback
    }
}
```

### 3. Credly API Integration
```javascript
// backend/src/infrastructure/external/credly/CredlyClient.js
class CredlyClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.CREDLY_API_URL;
        this.apiKey = process.env.CREDLY_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getBadges(credlyId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('credly/badges', { credlyId });
            }

            const response = await fetch(`${this.baseUrl}/badges/${credlyId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('credly/badges', { credlyId });
        }
    }
}
```

### 4. Gemini API Integration
```javascript
// backend/src/infrastructure/external/gemini/GeminiClient.js
class GeminiClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.GEMINI_API_URL;
        this.apiKey = process.env.GEMINI_API_KEY;
        this.mockDataService = mockDataService;
    }

    async generateBio(employeeData) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('gemini/bio', { employeeData });
            }

            const response = await fetch(`${this.baseUrl}/generate-bio`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                body: JSON.stringify({ employeeData })
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('gemini/bio', { employeeData });
        }
    }

    async generateValueProposition(employeeData) {
        // Similar implementation with mock fallback
    }
}
```

### 5. ORCID API Integration
```javascript
// backend/src/infrastructure/external/orcid/ORCIDClient.js
class ORCIDClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.ORCID_API_URL;
        this.apiKey = process.env.ORCID_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getProfile(orcidId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('orcid/profile', { orcidId });
            }

            const response = await fetch(`${this.baseUrl}/person/${orcidId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('orcid/profile', { orcidId });
        }
    }
}
```

### 6. Crossref API Integration
```javascript
// backend/src/infrastructure/external/crossref/CrossrefClient.js
class CrossrefClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.CROSSREF_API_URL;
        this.apiKey = process.env.CROSSREF_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getResearch(orcidId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('crossref/research', { orcidId });
            }

            const response = await fetch(`${this.baseUrl}/works?filter=orcid:${orcidId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('crossref/research', { orcidId });
        }
    }
}
```

### 7. YouTube API Integration
```javascript
// backend/src/infrastructure/external/youtube/YouTubeClient.js
class YouTubeClient {
    constructor(mockDataService) {
        this.baseUrl = process.env.YOUTUBE_API_URL;
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.mockDataService = mockDataService;
    }

    async getChannel(channelId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse('youtube/channel', { channelId });
            }

            const response = await fetch(`${this.baseUrl}/channels/${channelId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            return await response.json();
        } catch (error) {
            return await this.mockDataService.getMockResponse('youtube/channel', { channelId });
        }
    }
}
```

## Integration Configuration

### Environment Variables
```javascript
// backend/src/config/integrations.js
export const integrationConfig = {
    internal: {
        auth: {
            url: process.env.AUTH_SERVICE_URL,
            key: process.env.AUTH_SERVICE_KEY,
            timeout: 5000
        },
        skillsEngine: {
            url: process.env.SKILLS_ENGINE_URL,
            key: process.env.SKILLS_ENGINE_KEY,
            timeout: 10000
        },
        marketplace: {
            url: process.env.MARKETPLACE_URL,
            key: process.env.MARKETPLACE_KEY,
            timeout: 8000
        },
        // ... other internal services
    },
    external: {
        linkedin: {
            url: process.env.LINKEDIN_API_URL,
            key: process.env.LINKEDIN_API_KEY,
            timeout: 10000
        },
        github: {
            url: process.env.GITHUB_API_URL,
            key: process.env.GITHUB_API_KEY,
            timeout: 8000
        },
        // ... other external APIs
    }
};
```

### Circuit Breaker Pattern
```javascript
// backend/src/infrastructure/common/CircuitBreaker.js
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    }

    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
        }
    }
}
```

This integration architecture ensures that the Directory microservice can operate completely independently with comprehensive mock data while providing seamless integration with all required services when they become available.
