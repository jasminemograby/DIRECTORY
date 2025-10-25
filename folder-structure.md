# Directory Microservice - Folder Structure

## Complete Monorepo Structure

```
directory-microservice/
├── frontend/                          # React Frontend (Presentation Layer)
│   ├── src/
│   │   ├── components/                # Reusable UI Components
│   │   │   ├── common/               # Common components (Button, Input, Card)
│   │   │   ├── company/              # Company-specific components
│   │   │   ├── employee/             # Employee-specific components
│   │   │   ├── trainer/              # Trainer-specific components
│   │   │   └── training/             # Training request components
│   │   ├── pages/                    # Page Components
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── EmployeeProfile.jsx
│   │   │   ├── TrainerManagement.jsx
│   │   │   └── TrainingRequests.jsx
│   │   ├── hooks/                    # Custom React Hooks
│   │   ├── services/                 # API Service Layer
│   │   ├── utils/                    # Frontend Utilities
│   │   ├── styles/                   # Tailwind CSS Styles
│   │   │   ├── globals.css
│   │   │   └── components.css
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                          # Node.js Backend (All Layers)
│   ├── src/
│   │   ├── domain/                   # DOMAIN LAYER
│   │   │   ├── entities/             # Core Business Entities
│   │   │   │   ├── Company.js
│   │   │   │   ├── Employee.js
│   │   │   │   ├── Trainer.js
│   │   │   │   ├── Department.js
│   │   │   │   ├── Team.js
│   │   │   │   ├── TrainingRequest.js
│   │   │   │   └── Skills.js
│   │   │   ├── valueObjects/         # Value Objects
│   │   │   │   ├── Email.js
│   │   │   │   ├── PhoneNumber.js
│   │   │   │   ├── Address.js
│   │   │   │   └── UserRole.js
│   │   │   ├── services/             # Domain Services
│   │   │   │   ├── CompanyRegistrationService.js
│   │   │   │   ├── EmployeeEnrichmentService.js
│   │   │   │   └── MultiTenancyService.js
│   │   │   └── rules/                # Business Rules
│   │   │       ├── CompanyRules.js
│   │   │       ├── EmployeeRules.js
│   │   │       └── AccessControlRules.js
│   │   │
│   │   ├── application/              # APPLICATION LAYER
│   │   │   ├── useCases/             # Use Cases
│   │   │   │   ├── company/
│   │   │   │   │   ├── RegisterCompanyUseCase.js
│   │   │   │   │   ├── UpdateCompanyUseCase.js
│   │   │   │   │   └── GetCompanyUseCase.js
│   │   │   │   ├── employee/
│   │   │   │   │   ├── CreateEmployeeUseCase.js
│   │   │   │   │   ├── UpdateEmployeeUseCase.js
│   │   │   │   │   ├── EnrichEmployeeUseCase.js
│   │   │   │   │   └── GetEmployeeUseCase.js
│   │   │   │   ├── trainer/
│   │   │   │   │   ├── CreateTrainerUseCase.js
│   │   │   │   │   ├── UpdateTrainerUseCase.js
│   │   │   │   │   └── GetTrainerUseCase.js
│   │   │   │   └── training/
│   │   │   │       ├── CreateTrainingRequestUseCase.js
│   │   │   │       ├── ApproveTrainingRequestUseCase.js
│   │   │   │       └── GetTrainingRequestUseCase.js
│   │   │   ├── services/             # Application Services
│   │   │   │   ├── CompanyService.js
│   │   │   │   ├── EmployeeService.js
│   │   │   │   ├── TrainerService.js
│   │   │   │   └── TrainingService.js
│   │   │   └── workflows/            # Workflow Orchestration
│   │   │       ├── CompanyRegistrationWorkflow.js
│   │   │       ├── EmployeeEnrichmentWorkflow.js
│   │   │       └── TrainingApprovalWorkflow.js
│   │   │
│   │   ├── infrastructure/           # INFRASTRUCTURE LAYER
│   │   │   ├── database/             # Database Adapters
│   │   │   │   ├── repositories/     # Repository Pattern
│   │   │   │   │   ├── CompanyRepository.js
│   │   │   │   │   ├── EmployeeRepository.js
│   │   │   │   │   ├── TrainerRepository.js
│   │   │   │   │   └── TrainingRequestRepository.js
│   │   │   │   ├── migrations/       # Database Migrations
│   │   │   │   └── seeds/            # Database Seeds
│   │   │   ├── external/             # External API Clients
│   │   │   │   ├── linkedin/
│   │   │   │   │   ├── LinkedInClient.js
│   │   │   │   │   └── LinkedInMockClient.js
│   │   │   │   ├── github/
│   │   │   │   │   ├── GitHubClient.js
│   │   │   │   │   └── GitHubMockClient.js
│   │   │   │   ├── credly/
│   │   │   │   │   ├── CredlyClient.js
│   │   │   │   │   └── CredlyMockClient.js
│   │   │   │   ├── gemini/
│   │   │   │   │   ├── GeminiClient.js
│   │   │   │   │   └── GeminiMockClient.js
│   │   │   │   └── other/            # ORCID, Crossref, YouTube
│   │   │   ├── internal/             # Internal Service Clients
│   │   │   │   ├── auth/
│   │   │   │   │   ├── AuthServiceClient.js
│   │   │   │   │   └── AuthServiceMockClient.js
│   │   │   │   ├── skills/
│   │   │   │   │   ├── SkillsEngineClient.js
│   │   │   │   │   └── SkillsEngineMockClient.js
│   │   │   │   ├── marketplace/
│   │   │   │   │   ├── MarketplaceClient.js
│   │   │   │   │   └── MarketplaceMockClient.js
│   │   │   │   └── other/            # Content Studio, Course Builder, etc.
│   │   │   └── mock/                 # Mock Data System
│   │   │       ├── MockDataService.js
│   │   │       ├── MockResponseGenerator.js
│   │   │       └── MockDataValidator.js
│   │   │
│   │   ├── interfaces/               # PRESENTATION LAYER (API)
│   │   │   ├── controllers/          # Express Controllers
│   │   │   │   ├── CompanyController.js
│   │   │   │   ├── EmployeeController.js
│   │   │   │   ├── TrainerController.js
│   │   │   │   └── TrainingController.js
│   │   │   ├── routes/               # Express Routes
│   │   │   │   ├── companyRoutes.js
│   │   │   │   ├── employeeRoutes.js
│   │   │   │   ├── trainerRoutes.js
│   │   │   │   └── trainingRoutes.js
│   │   │   ├── middleware/           # Express Middleware
│   │   │   │   ├── authMiddleware.js
│   │   │   │   ├── validationMiddleware.js
│   │   │   │   ├── errorMiddleware.js
│   │   │   │   └── multiTenancyMiddleware.js
│   │   │   └── dto/                  # Data Transfer Objects
│   │   │       ├── CompanyDTO.js
│   │   │       ├── EmployeeDTO.js
│   │   │       ├── TrainerDTO.js
│   │   │       └── TrainingRequestDTO.js
│   │   │
│   │   ├── config/                   # Configuration
│   │   │   ├── database.js
│   │   │   ├── environment.js
│   │   │   ├── externalApis.js
│   │   │   └── internalServices.js
│   │   │
│   │   └── app.js                    # Express App Setup
│   │
│   ├── tests/                        # Test Files
│   │   ├── unit/                     # Unit Tests
│   │   ├── integration/              # Integration Tests
│   │   └── e2e/                      # End-to-End Tests
│   │
│   ├── package.json
│   └── server.js                     # Server Entry Point
│
├── database/                         # Database & Mock Data
│   ├── migrations/                   # Supabase Migrations
│   │   ├── 001_create_companies.sql
│   │   ├── 002_create_employees.sql
│   │   ├── 003_create_trainers.sql
│   │   └── 004_create_training_requests.sql
│   ├── seeds/                        # Database Seeds
│   │   ├── companies.sql
│   │   ├── employees.sql
│   │   └── trainers.sql
│   └── mocks/                        # Mock Data System
│       ├── mock-companies.json
│       ├── mock-employees.json
│       ├── mock-trainers.json
│       ├── mock-training-requests.json
│       ├── mock-linkedin-responses.json
│       ├── mock-github-responses.json
│       ├── mock-credly-responses.json
│       ├── mock-gemini-responses.json
│       └── mock-internal-services.json
│
├── shared/                           # Shared Utilities
│   ├── utils/                        # Common Utilities
│   │   ├── validation.js
│   │   ├── encryption.js
│   │   ├── logging.js
│   │   └── constants.js
│   ├── types/                        # Type Definitions (JSDoc)
│   │   ├── Company.js
│   │   ├── Employee.js
│   │   └── Trainer.js
│   └── schemas/                      # Validation Schemas
│       ├── companySchema.js
│       ├── employeeSchema.js
│       └── trainerSchema.js
│
├── docs/                             # Documentation
│   ├── architecture/
│   │   ├── onion-architecture.md
│   │   ├── database-schema.md
│   │   └── api-documentation.md
│   ├── deployment/
│   │   ├── vercel-deployment.md
│   │   ├── railway-deployment.md
│   │   └── supabase-setup.md
│   └── development/
│       ├── setup-guide.md
│       ├── testing-guide.md
│       └── contributing.md
│
├── .github/                          # GitHub Actions
│   └── workflows/
│       ├── deploy-frontend.yml
│       ├── deploy-backend.yml
│       └── migrate-database.yml
│
├── package.json                      # Root Package.json
├── README.md
└── .env.example                      # Environment Variables Example
```

## Key Architecture Principles

### 1. **Dependency Inversion**
- Domain layer has no dependencies on external layers
- Application layer depends only on domain layer
- Infrastructure layer implements domain interfaces
- Presentation layer depends on application layer

### 2. **Multi-Tenancy**
- All entities include `company_id` for data isolation
- Row-level security implemented at database level
- Middleware enforces company-based access control

### 3. **Mock Data System**
- Environment-based switching between real and mock APIs
- Comprehensive mock data in `/database/mocks/`
- Automatic fallback on API failures
- Realistic data relationships and scenarios

### 4. **Clean Separation**
- Clear boundaries between layers
- Single responsibility principle
- Interface-based design
- Testable and maintainable code
