# Directory Microservice - Onion Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Tailwind CSS)  │  Express API Controllers │
│  - CompanyDashboard             │  - CompanyController      │
│  - EmployeeProfile              │  - EmployeeController     │
│  - TrainerManagement            │  - TrainerController      │
│  - TrainingRequest              │  - TrainingController     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Use Cases & Application Services                           │
│  - CompanyRegistrationUseCase                               │
│  - EmployeeManagementUseCase                                │
│  - TrainerManagementUseCase                                 │
│  - TrainingRequestUseCase                                   │
│  - CompanyService, EmployeeService, TrainerService         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Core Business Logic & Entities                             │
│  - Company, Employee, Trainer, Department, Team            │
│  - TrainingRequest, Skills, CareerPath                     │
│  - Domain Services & Business Rules                        │
│  - Multi-tenancy & Role-based Access Rules                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  External Concerns & Data Access                           │
│  - PostgreSQL Repositories (Supabase)                      │
│  - External API Clients (LinkedIn, GitHub, Credly, etc.)  │
│  - Internal Service Clients (Auth, Skills Engine, etc.)   │
│  - Mock Data System (/database/mocks/)                     │
└─────────────────────────────────────────────────────────────┘
```

## Multi-Tenancy Architecture

```
Company A (tenant_1)          Company B (tenant_2)
├── Department 1              ├── Department 1
│   ├── Team 1                │   ├── Team 1
│   │   ├── Employee 1        │   │   ├── Employee 1
│   │   └── Employee 2        │   │   └── Employee 2
│   └── Team 2                │   └── Team 2
└── Department 2              └── Department 2
    └── Team 3                    └── Team 3
```

## Integration Architecture

### Internal Microservices (Mock Mode)
- Auth Service → User verification and roles
- Skills Engine → Skill normalization and verification
- Marketplace → Trainer matching and course discovery
- Content Studio → Content creation and management
- Course Builder → Learning feedback and progress
- DevLab → Exercise provisioning and tracking
- Learning Analytics → Reporting and insights
- Contextual Corporate Assistant → RAG data provision
- Assessment → Test results and verification
- SendPulse → In-app notifications
- SendGrid → Email notifications

### External APIs (Mock Mode)
- LinkedIn → Professional profiles and connections
- GitHub → Technical skills and contributions
- Credly → Certifications and achievements
- YouTube → Content creation and expertise
- ORCID → Academic credentials and publications
- Crossref → Research and academic work
- Gemini API → AI-generated bios and value propositions

## Mock Data Fallback System

```
Real API Call → Success → Return Real Data
     ↓
   Failure/Timeout
     ↓
Mock Data System → Return Mock JSON from /database/mocks/
```

## Environment-Based Switching

```javascript
// Environment-based API switching
const useMockData = process.env.NODE_ENV === 'development' || 
                   process.env.USE_MOCK_DATA === 'true';

if (useMockData) {
  return await mockDataService.getMockResponse(endpoint);
} else {
  return await realApiClient.call(endpoint);
}
```
