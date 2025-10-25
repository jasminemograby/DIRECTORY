# Directory Microservice API Documentation

## 📋 Overview

The Directory Microservice provides a comprehensive REST API for managing company directories, employee profiles, trainer information, and training requests. All endpoints support both live and mock data modes with automatic fallback capabilities.

## 🔗 Base URLs

- **Development**: `http://localhost:3001`
- **Staging**: `https://staging-directory.example.com`
- **Production**: `https://directory.example.com`

## 🔐 Authentication

Include these headers in all requests:

```bash
X-Company-ID: your-company-id
X-User-ID: your-user-id
X-User-Role: your-role
```

## 📊 Response Format

All API responses follow this standardized format:

```json
{
  "success": true,
  "data": { ... },
  "source": "live|mock",
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "source": "live|mock",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🏢 Company Endpoints

### Get Companies
```http
GET /api/v1/companies
```

**Query Parameters:**
- `search` (string): Search term for company name or description
- `industry` (string): Filter by industry
- `size` (string): Filter by company size (`1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1000+`)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "company_12345",
      "name": "TechCorp Solutions",
      "industry": "Technology",
      "size": "201-500",
      "description": "Leading technology company...",
      "website": "https://techcorp-solutions.com",
      "logo": "https://techcorp-solutions.com/logo.png",
      "headquarters": {
        "address": "123 Tech Street, San Francisco, CA 94105",
        "country": "United States",
        "timezone": "America/Los_Angeles"
      },
      "foundedYear": 2015,
      "kpis": {
        "revenue": 50000000,
        "growthRate": 0.18,
        "employeeSatisfaction": 4.2,
        "retentionRate": 0.92
      },
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-12-19T10:00:00Z"
    }
  ],
  "source": "live"
}
```

### Get Company Details
```http
GET /api/v1/companies/{id}
```

**Parameters:**
- `id` (string): Company ID

**Response:** Same as company object above

### Get Company Hierarchy
```http
GET /api/v1/companies/{id}/hierarchy
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "company_12345",
    "name": "TechCorp Solutions",
    "departments": [
      {
        "id": "dept_12345",
        "name": "Engineering",
        "description": "Software development and engineering",
        "headId": "emp_12345",
        "budget": 1000000,
        "kpis": {},
        "teams": [
          {
            "id": "team_12345",
            "name": "Frontend Team",
            "description": "Frontend development team",
            "leadId": "emp_12345",
            "maxMembers": 10,
            "kpis": {},
            "employeeCount": 5
          }
        ]
      }
    ]
  },
  "source": "live"
}
```

### Create Company
```http
POST /api/v1/companies
Content-Type: application/json

{
  "name": "New Company",
  "industry": "Technology",
  "size": "11-50",
  "description": "Company description",
  "website": "https://newcompany.com",
  "logo": "https://newcompany.com/logo.png",
  "headquarters": {
    "address": "456 Business Ave, New York, NY 10001",
    "country": "United States",
    "timezone": "America/New_York"
  },
  "foundedYear": 2024
}
```

### Update Company
```http
PUT /api/v1/companies/{id}
Content-Type: application/json

{
  "name": "Updated Company Name",
  "description": "Updated description"
}
```

### Delete Company
```http
DELETE /api/v1/companies/{id}
```

## 👥 Employee Endpoints

### Get Employees
```http
GET /api/v1/employees
```

**Query Parameters:**
- `search` (string): Search term
- `departmentId` (string): Filter by department
- `teamId` (string): Filter by team
- `role` (string): Filter by role (`hr_admin`, `manager`, `team_lead`, `employee`, `trainer`)
- `level` (string): Filter by level (`junior`, `mid`, `senior`, `lead`, `principal`)
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "emp_12347",
      "companyId": "company_12345",
      "departmentId": "dept_12345",
      "teamId": "team_12345",
      "managerId": "emp_12345",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@techcorp.com",
      "phone": "+1-555-0124",
      "employeeId": "TC002",
      "role": "employee",
      "jobTitle": "Software Engineer",
      "level": "mid",
      "careerPath": "Engineering",
      "hireDate": "2024-01-15",
      "location": "San Francisco, CA",
      "careerGoal": "Become a Team Leader within one year",
      "experienceYears": 2,
      "skills": [
        {
          "name": "JavaScript",
          "level": "intermediate",
          "verified": true,
          "source": "github",
          "yearsExperience": 2,
          "lastUpdated": "2024-12-19T10:00:00Z"
        }
      ],
      "competences": [
        {
          "name": "Full Stack Development",
          "subCompetences": [
            {
              "name": "Frontend",
              "skills": [
                {
                  "name": "React",
                  "verified": true,
                  "source": "github",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "intermediate",
                  "yearsExperience": 2
                }
              ]
            }
          ]
        }
      ],
      "externalProfiles": {
        "linkedin": "https://linkedin.com/in/alicejohnson",
        "github": "alicejohnson",
        "credly": "https://credly.com/users/alicejohnson",
        "orcid": "0000-0000-0000-0000",
        "youtube": "https://youtube.com/@alicejohnson"
      },
      "enrichmentStatus": {
        "status": "completed",
        "lastEnriched": "2024-12-19T10:00:00Z",
        "sources": ["linkedin", "github", "credly", "gemini"]
      },
      "relevanceScore": 75,
      "valueProposition": "Alice works as a Software Engineer with 2 years experience...",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-12-19T10:00:00Z"
    }
  ],
  "source": "live"
}
```

### Get Employee Profile
```http
GET /api/v1/employees/{id}
```

### Enrich Employee Profile
```http
POST /api/v1/employees/{id}/enrich
Content-Type: application/json

{
  "sources": ["linkedin", "github", "credly", "gemini"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "emp_12347",
    "enrichmentStatus": "completed",
    "valueProposition": "Enhanced value proposition...",
    "normalizedSkills": [
      {
        "name": "JavaScript",
        "level": "intermediate",
        "verified": true,
        "source": "github",
        "yearsExperience": 2,
        "lastUpdated": "2024-12-19T10:00:00Z"
      }
    ],
    "relevanceScore": 75,
    "enrichmentData": {
      "sources": ["linkedin", "github", "credly", "gemini"],
      "skillsFound": 5,
      "lastEnriched": "2024-12-19T10:00:00Z"
    }
  },
  "source": "live"
}
```

### Update Employee Skills
```http
PATCH /api/v1/employees/{id}/skills
Content-Type: application/json

{
  "skills": [
    {
      "name": "JavaScript",
      "level": "advanced",
      "verified": true,
      "yearsExperience": 3
    }
  ]
}
```

### Get Skill Gap Analysis
```http
GET /api/v1/employees/{id}/skill-gap?careerGoal=Senior%20Engineer
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp_12347",
    "careerGoal": "Senior Engineer",
    "skillGaps": [
      {
        "skill": "Advanced JavaScript",
        "requiredLevel": "advanced",
        "currentLevel": "intermediate",
        "gap": "medium",
        "recommendedCourses": [
          {
            "id": "course_1",
            "title": "Advanced JavaScript Patterns",
            "provider": "TechAcademy",
            "duration": "40 hours",
            "level": "advanced",
            "rating": 4.8,
            "url": "https://marketplace.com/courses/advanced-js-patterns"
          }
        ]
      }
    ],
    "overallGapScore": 65,
    "prioritySkills": ["Advanced JavaScript", "System Design"]
  },
  "source": "live"
}
```

### Get Relevance Score
```http
GET /api/v1/employees/{id}/relevance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp_12347",
    "relevanceScore": 75,
    "scoreBreakdown": {
      "skillsMatch": 80,
      "experienceAlignment": 70,
      "enrichmentCompleteness": 75,
      "careerPathAlignment": 88
    },
    "factors": {
      "verifiedSkills": 3,
      "totalSkills": 5,
      "experienceYears": 2,
      "targetExperience": 3,
      "enrichedSources": 4,
      "totalSources": 5
    },
    "lastCalculated": "2024-12-19T10:00:00Z"
  },
  "source": "live"
}
```

### Get Employee Competences
```http
GET /api/v1/employees/{id}/skills/competences
```

## 🧑‍🏫 Trainer Endpoints

### Get Trainers
```http
GET /api/v1/trainers
```

**Query Parameters:**
- `companyId` (string): Filter by company
- `trainerType` (string): Filter by type (`internal`, `external`)
- `skills` (string): Comma-separated skills to filter by

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trainer_12345",
      "employeeId": "emp_12347",
      "companyId": "company_12345",
      "trainerType": "internal",
      "teachingMode": ["online", "offline", "blended"],
      "certifications": [
        {
          "name": "AWS Certified Solutions Architect",
          "issuer": "Amazon Web Services",
          "issuedDate": "2023-06-15",
          "expiryDate": "2026-06-15",
          "credentialId": "AWS-CSA-12345"
        }
      ],
      "languages": ["English", "Spanish"],
      "availability": {
        "timezone": "America/Los_Angeles",
        "schedule": {
          "monday": ["09:00-17:00"],
          "tuesday": ["09:00-17:00"],
          "wednesday": ["09:00-17:00"],
          "thursday": ["09:00-17:00"],
          "friday": ["09:00-17:00"]
        }
      },
      "pricing": {
        "hourlyRate": 150,
        "currency": "USD",
        "minimumHours": 2
      },
      "aiEditingEnabled": true,
      "publishPermission": "internal",
      "averageRating": 4.8,
      "reviewCount": 24,
      "courseHistory": [
        {
          "courseId": "course_12345",
          "title": "JavaScript Fundamentals",
          "taughtAt": "2024-11-15",
          "studentCount": 15,
          "rating": 4.8,
          "skillCategories": ["JavaScript", "Programming Fundamentals"]
        }
      ],
      "teachingRequests": [
        {
          "id": "req_12345",
          "title": "Node.js Best Practices",
          "status": "approved",
          "requestedDate": "2024-12-20",
          "skillCategories": ["Node.js", "Backend Development"]
        }
      ],
      "verifiedTeachingSkills": ["JavaScript", "React", "Node.js"],
      "totalStudentsTaught": 45,
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-12-19T10:00:00Z"
    }
  ],
  "source": "live"
}
```

### Search Trainers
```http
GET /api/v1/trainers/search?skills=JavaScript,React&teachingMode=online
```

**Query Parameters:**
- `skills` (string): Comma-separated skills
- `teachingMode` (string): Comma-separated teaching modes
- `trainerType` (string): Trainer type filter
- `companyId` (string): Company filter

### Get Trainer Details
```http
GET /api/v1/trainers/{id}
```

### Get Trainer Availability
```http
GET /api/v1/trainers/{id}/availability
```

### Create Trainer
```http
POST /api/v1/trainers
Content-Type: application/json

{
  "employeeId": "emp_12347",
  "companyId": "company_12345",
  "trainerType": "internal",
  "teachingMode": ["online", "offline"],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issuedDate": "2023-06-15",
      "expiryDate": "2026-06-15",
      "credentialId": "AWS-CSA-12345"
    }
  ],
  "languages": ["English"],
  "pricing": {
    "hourlyRate": 150,
    "currency": "USD",
    "minimumHours": 2
  }
}
```

## 📋 Training Request Endpoints

### Get Training Requests
```http
GET /api/v1/training-requests
```

**Query Parameters:**
- `companyId` (string): Filter by company
- `status` (string): Filter by status (`pending`, `approved`, `rejected`, `assigned`, `in-progress`, `completed`, `cancelled`)
- `requesterId` (string): Filter by requester
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "req_12345",
      "companyId": "company_12345",
      "requesterId": "emp_12347",
      "employeeId": "emp_12347",
      "trainerId": "trainer_12345",
      "title": "JavaScript Advanced Training",
      "description": "Learn advanced JavaScript concepts and patterns",
      "type": "skill-driven",
      "skillCategories": ["JavaScript", "Programming"],
      "targetLevel": "intermediate",
      "preferredMode": "online",
      "startDate": "2024-12-20",
      "endDate": "2024-12-27",
      "estimatedDuration": 40,
      "budget": 1000,
      "status": "approved",
      "approverId": "emp_12345",
      "approvedAt": "2024-12-19T10:00:00Z",
      "rejectionReason": null,
      "createdAt": "2024-12-19T10:00:00Z",
      "updatedAt": "2024-12-19T10:00:00Z"
    }
  ],
  "source": "live"
}
```

### Get Training Request Details
```http
GET /api/v1/training-requests/{id}
```

### Create Training Request
```http
POST /api/v1/training-requests
Content-Type: application/json

{
  "companyId": "company_12345",
  "requesterId": "emp_12347",
  "title": "JavaScript Advanced Training",
  "description": "Learn advanced JavaScript concepts and patterns",
  "type": "skill-driven",
  "skillCategories": ["JavaScript", "Programming"],
  "targetLevel": "intermediate",
  "preferredMode": "online",
  "startDate": "2024-12-20",
  "endDate": "2024-12-27",
  "estimatedDuration": 40,
  "budget": 1000
}
```

### Approve Training Request
```http
POST /api/v1/training-requests/{id}/approve
Content-Type: application/json

{
  "approverId": "emp_12345",
  "comments": "Approved for Q1 budget"
}
```

### Reject Training Request
```http
POST /api/v1/training-requests/{id}/reject
Content-Type: application/json

{
  "approverId": "emp_12345",
  "reason": "Budget constraints for Q1"
}
```

### Assign Trainer
```http
POST /api/v1/training-requests/{id}/assign-trainer
Content-Type: application/json

{
  "trainerId": "trainer_12345"
}
```

## 🧪 Mock Endpoints (Development Only)

### Mock Enrichment
```http
POST /mock/enrichment/employees/{id}/enrich
Content-Type: application/json

{
  "sources": ["linkedin", "github", "credly", "gemini"]
}
```

### Mock Skills Update
```http
PATCH /mock/skills/employees/{id}/skills
Content-Type: application/json

{
  "skills": [
    {
      "name": "JavaScript",
      "level": "advanced",
      "verified": true,
      "yearsExperience": 3
    }
  ]
}
```

### Mock Relevance Score
```http
GET /mock/skills/employees/{id}/relevance
```

## 🏥 Health Check

### Health Status
```http
GET /health
```

**Response:**
```json
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
  },
  "source": "live",
  "message": "Service is healthy"
}
```

## 🔍 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | External service unavailable |

## 📊 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response**: 429 status code when limit exceeded

## 🔒 Security

### Headers Required
- `X-Company-ID`: Company identifier
- `X-User-ID`: User identifier
- `X-User-Role`: User role for authorization

### CORS
- **Allowed Origins**: Configured per environment
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Company-ID, X-User-ID, X-User-Role

## 📈 Performance

### Response Times
- **Health Check**: < 100ms
- **Simple Queries**: < 200ms
- **Complex Queries**: < 500ms
- **Enrichment**: < 5s

### Pagination
- **Default**: 20 items per page
- **Maximum**: 100 items per page
- **Metadata**: Total count, page info

## 🔄 Source Field Behavior

The `source` field indicates the data source:

- **`live`**: Data from real database and external APIs
- **`mock`**: Data from JSON mock files (fallback mode)

**Automatic Fallback**: When live services fail, the API automatically switches to mock data and returns `source: "mock"` while maintaining the same response structure.
