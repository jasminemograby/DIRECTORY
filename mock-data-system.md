# Directory Microservice - Mock Data System Architecture

## Mock Data System Overview

The mock data system provides comprehensive fallback mechanisms for all external integrations and internal microservice communications. It ensures the Directory microservice can function completely even when external APIs or internal services are unavailable.

## Mock Data Structure

### Directory Structure
```
/database/mocks/
├── companies/
│   ├── mock-companies.json
│   ├── mock-company-registration.json
│   └── mock-company-hierarchy.json
├── employees/
│   ├── mock-employees.json
│   ├── mock-employee-profiles.json
│   └── mock-employee-skills.json
├── trainers/
│   ├── mock-trainers.json
│   ├── mock-trainer-profiles.json
│   └── mock-teaching-history.json
├── training-requests/
│   ├── mock-training-requests.json
│   ├── mock-approval-workflows.json
│   └── mock-training-progress.json
├── external-apis/
│   ├── linkedin/
│   │   ├── mock-linkedin-profile.json
│   │   ├── mock-linkedin-connections.json
│   │   └── mock-linkedin-experience.json
│   ├── github/
│   │   ├── mock-github-profile.json
│   │   ├── mock-github-repositories.json
│   │   └── mock-github-contributions.json
│   ├── credly/
│   │   ├── mock-credly-badges.json
│   │   ├── mock-credly-certifications.json
│   │   └── mock-credly-achievements.json
│   ├── gemini/
│   │   ├── mock-gemini-bio-generation.json
│   │   ├── mock-gemini-value-proposition.json
│   │   └── mock-gemini-skill-analysis.json
│   ├── orcid/
│   │   ├── mock-orcid-profile.json
│   │   └── mock-orcid-publications.json
│   ├── crossref/
│   │   ├── mock-crossref-research.json
│   │   └── mock-crossref-citations.json
│   └── youtube/
│       ├── mock-youtube-channel.json
│       └── mock-youtube-content.json
└── internal-services/
    ├── auth/
    │   ├── mock-auth-verification.json
    │   ├── mock-auth-roles.json
    │   └── mock-auth-permissions.json
    ├── skills-engine/
    │   ├── mock-skills-normalization.json
    │   ├── mock-skills-verification.json
    │   └── mock-skills-gap-analysis.json
    ├── marketplace/
    │   ├── mock-trainer-matching.json
    │   ├── mock-course-discovery.json
    │   └── mock-fallback-course-creation.json
    ├── content-studio/
    │   ├── mock-content-creation.json
    │   ├── mock-content-upload.json
    │   └── mock-content-status-updates.json
    ├── course-builder/
    │   ├── mock-learning-feedback.json
    │   ├── mock-course-progress.json
    │   └── mock-course-completion.json
    ├── devlab/
    │   ├── mock-exercise-provisioning.json
    │   ├── mock-practice-workloads.json
    │   └── mock-exercise-tracking.json
    ├── analytics/
    │   ├── mock-learning-analytics.json
    │   ├── mock-hr-reporting.json
    │   └── mock-performance-metrics.json
    ├── cca/
    │   ├── mock-rag-data-provision.json
    │   ├── mock-contextual-responses.json
    │   └── mock-personalized-recommendations.json
    ├── assessment/
    │   ├── mock-assessment-configuration.json
    │   ├── mock-test-results.json
    │   └── mock-attempt-tracking.json
    ├── sendpulse/
    │   ├── mock-in-app-notifications.json
    │   └── mock-notification-delivery.json
    └── sendgrid/
        ├── mock-email-templates.json
        └── mock-email-delivery.json
```

## Mock Data Implementation

### 1. Mock Data Service
```javascript
// backend/src/infrastructure/mock/MockDataService.js
class MockDataService {
    constructor() {
        this.mockDataPath = path.join(process.cwd(), 'database', 'mocks');
        this.cache = new Map();
    }

    async getMockResponse(endpoint, params = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const mockFile = this.getMockFilePath(endpoint);
        const mockData = await this.loadMockData(mockFile);
        const response = this.generateResponse(mockData, params);
        
        this.cache.set(cacheKey, response);
        return response;
    }

    getMockFilePath(endpoint) {
        const endpointMap = {
            'linkedin/profile': 'external-apis/linkedin/mock-linkedin-profile.json',
            'github/profile': 'external-apis/github/mock-github-profile.json',
            'credly/badges': 'external-apis/credly/mock-credly-badges.json',
            'gemini/bio': 'external-apis/gemini/mock-gemini-bio-generation.json',
            'auth/verify': 'internal-services/auth/mock-auth-verification.json',
            'skills/normalize': 'internal-services/skills-engine/mock-skills-normalization.json',
            'marketplace/match': 'internal-services/marketplace/mock-trainer-matching.json',
            // ... more mappings
        };
        
        return endpointMap[endpoint] || 'default/mock-response.json';
    }

    async loadMockData(filePath) {
        const fullPath = path.join(this.mockDataPath, filePath);
        const data = await fs.readFile(fullPath, 'utf8');
        return JSON.parse(data);
    }

    generateResponse(mockData, params) {
        // Add realistic delays to simulate API calls
        const delay = Math.random() * 1000 + 500; // 500-1500ms
        
        return {
            success: true,
            data: this.personalizeMockData(mockData, params),
            timestamp: new Date().toISOString(),
            source: 'mock',
            delay: delay
        };
    }

    personalizeMockData(mockData, params) {
        // Personalize mock data based on request parameters
        if (params.userId) {
            return this.addUserSpecificData(mockData, params.userId);
        }
        return mockData;
    }
}
```

### 2. Environment-Based Switching
```javascript
// backend/src/config/environment.js
const config = {
    development: {
        useMockData: true,
        mockDelay: true,
        mockErrors: false
    },
    staging: {
        useMockData: process.env.USE_MOCK_DATA === 'true',
        mockDelay: true,
        mockErrors: true
    },
    production: {
        useMockData: process.env.USE_MOCK_DATA === 'true',
        mockDelay: false,
        mockErrors: false
    }
};

export const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return config[env];
};
```

### 3. API Client with Mock Fallback
```javascript
// backend/src/infrastructure/external/linkedin/LinkedInClient.js
class LinkedInClient {
    constructor(mockDataService) {
        this.mockDataService = mockDataService;
        this.baseUrl = process.env.LINKEDIN_API_URL;
        this.apiKey = process.env.LINKEDIN_API_KEY;
    }

    async getProfile(userId) {
        try {
            if (this.shouldUseMockData()) {
                return await this.mockDataService.getMockResponse(
                    'linkedin/profile', 
                    { userId }
                );
            }

            const response = await this.makeRealApiCall(`/profile/${userId}`);
            return this.formatResponse(response);
            
        } catch (error) {
            console.warn(`LinkedIn API failed, falling back to mock data: ${error.message}`);
            return await this.mockDataService.getMockResponse(
                'linkedin/profile', 
                { userId }
            );
        }
    }

    shouldUseMockData() {
        const config = getConfig();
        return config.useMockData || !this.apiKey;
    }

    async makeRealApiCall(endpoint) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`LinkedIn API error: ${response.status}`);
        }

        return await response.json();
    }
}
```

## Sample Mock Data Files

### 1. Mock Company Data
```json
// database/mocks/companies/mock-companies.json
{
  "companies": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "TechCorp Solutions",
      "industry": "Technology",
      "size": "medium",
      "location": "San Francisco, CA",
      "website": "https://techcorp.com",
      "description": "Leading provider of enterprise software solutions",
      "kpis": {
        "employee_count": 250,
        "revenue": 50000000,
        "growth_rate": 0.15
      },
      "settings": {
        "timezone": "America/Los_Angeles",
        "working_hours": "9-17",
        "currency": "USD"
      },
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Global Manufacturing Inc",
      "industry": "Manufacturing",
      "size": "large",
      "location": "Detroit, MI",
      "website": "https://globalmfg.com",
      "description": "International manufacturing and supply chain solutions",
      "kpis": {
        "employee_count": 1200,
        "revenue": 200000000,
        "growth_rate": 0.08
      },
      "settings": {
        "timezone": "America/New_York",
        "working_hours": "8-16",
        "currency": "USD"
      },
      "status": "active",
      "created_at": "2024-02-01T14:30:00Z"
    }
  ]
}
```

### 2. Mock Employee Data
```json
// database/mocks/employees/mock-employees.json
{
  "employees": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "company_id": "550e8400-e29b-41d4-a716-446655440001",
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@techcorp.com",
      "phone": "+1-555-0123",
      "employee_id": "TC001",
      "role": "employee",
      "job_title": "Senior Software Engineer",
      "level": "senior",
      "career_path": "Engineering",
      "hire_date": "2022-03-15",
      "location": "San Francisco, CA",
      "bio": "Experienced software engineer with expertise in full-stack development",
      "skills": [
        {
          "name": "JavaScript",
          "level": "expert",
          "verified": true,
          "years_experience": 5
        },
        {
          "name": "React",
          "level": "advanced",
          "verified": true,
          "years_experience": 4
        },
        {
          "name": "Node.js",
          "level": "advanced",
          "verified": true,
          "years_experience": 3
        }
      ],
      "verified_skills": ["JavaScript", "React", "Node.js"],
      "relevance_score": 0.85,
      "status": "active",
      "is_trainer": false,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 3. Mock LinkedIn API Response
```json
// database/mocks/external-apis/linkedin/mock-linkedin-profile.json
{
  "profile": {
    "id": "linkedin_12345",
    "firstName": "John",
    "lastName": "Smith",
    "headline": "Senior Software Engineer at TechCorp Solutions",
    "summary": "Passionate software engineer with 5+ years of experience in building scalable web applications. Expertise in JavaScript, React, and Node.js.",
    "location": {
      "name": "San Francisco Bay Area"
    },
    "industry": "Information Technology and Services",
    "positions": [
      {
        "title": "Senior Software Engineer",
        "companyName": "TechCorp Solutions",
        "startDate": "2022-03",
        "description": "Leading development of enterprise software solutions using React and Node.js"
      }
    ],
    "skills": [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "Docker"
    ],
    "educations": [
      {
        "schoolName": "Stanford University",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2016",
        "endDate": "2020"
      }
    ],
    "connections": 500,
    "profilePicture": "https://media.licdn.com/dms/image/profile_picture.jpg"
  }
}
```

### 4. Mock Skills Engine Response
```json
// database/mocks/internal-services/skills-engine/mock-skills-normalization.json
{
  "normalized_skills": [
    {
      "original_skill": "JavaScript",
      "normalized_skill": "JavaScript",
      "category": "Programming Languages",
      "competency_level": "expert",
      "verification_status": "verified",
      "confidence_score": 0.95
    },
    {
      "original_skill": "React",
      "normalized_skill": "React.js",
      "category": "Frontend Frameworks",
      "competency_level": "advanced",
      "verification_status": "verified",
      "confidence_score": 0.90
    }
  ],
  "skill_gaps": [
    {
      "skill": "Machine Learning",
      "gap_reason": "Required for AI/ML career path",
      "priority": "high",
      "recommended_courses": ["ML Fundamentals", "Python for Data Science"]
    }
  ],
  "relevance_score": 0.85,
  "career_path_alignment": 0.80
}
```

## Mock Data Features

### 1. **Realistic Data Generation**
- Consistent relationships between entities
- Realistic names, emails, and professional information
- Proper data types and formats
- Realistic skill levels and experience

### 2. **Error Simulation**
- Network timeout simulation
- API rate limit simulation
- Invalid response simulation
- Partial data failure simulation

### 3. **Performance Simulation**
- Realistic API response delays
- Large dataset handling
- Pagination simulation
- Caching behavior simulation

### 4. **Data Personalization**
- User-specific data generation
- Company-specific customization
- Role-based data filtering
- Context-aware responses

## Integration with Real APIs

### 1. **Seamless Switching**
- Environment-based configuration
- Runtime switching capability
- Gradual migration support
- A/B testing support

### 2. **Fallback Mechanisms**
- Automatic fallback on API failures
- Graceful degradation
- Error recovery
- Retry mechanisms

### 3. **Data Consistency**
- Mock data validation
- Schema compliance
- Relationship integrity
- Data freshness simulation

This mock data system ensures the Directory microservice can operate completely independently while providing realistic data for development, testing, and demonstration purposes.
