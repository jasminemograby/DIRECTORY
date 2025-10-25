# 10 - Implementation & Code Generation Template

## Description
This template implements all Directory microservice features following TDD approach with Onion Architecture, generating minimal code to pass failing tests and building a complete, deployable system.

## What This Template Produces
- React frontend components
- Express.js backend routes
- Mock data system implementation
- Shared utility functions
- Build scripts and configuration

## Inputs Required
- TDD setup and test framework
- All previous design templates
- Architecture and feature specifications
- Mock data and integration requirements

## Implementation Questions (Ask One at a Time)

### Domain Layer Implementation
**Question 1:** How should the domain layer entities and business logic be implemented? Consider Company, Employee, Trainer entities with proper business rules and validation.

*Follow-up considerations:*
- Domain entity implementation with business rules
- Value objects and domain services
- Business logic validation and constraints
- Domain events and notifications
- Entity relationships and aggregations
- Domain-specific error handling

### Application Layer Implementation
**Question 2:** How should the application layer services and use cases be implemented? Consider workflow orchestration, service coordination, and business process management.

*Follow-up considerations:*
- Use case implementation and orchestration
- Application service coordination
- Workflow management and state handling
- Business process automation
- Integration service management
- Application-specific error handling

### Infrastructure Layer Implementation
**Question 3:** How should the infrastructure layer adapters and external integrations be implemented? Consider database adapters, API clients, and external service connections.

*Follow-up considerations:*
- Database adapter and ORM implementation
- External API client implementation
- Internal microservice integration
- Mock data and fallback mechanisms
- Configuration and environment management
- Infrastructure-specific error handling

### Presentation Layer Implementation
**Question 4:** How should the presentation layer components and API controllers be implemented? Consider React components, Express routes, and user interface implementation.

*Follow-up considerations:*
- React component implementation with Tailwind CSS
- Express route and controller implementation
- API endpoint and middleware setup
- User interface and interaction implementation
- Form handling and validation
- Presentation-specific error handling

### Company Management Implementation
**Question 5:** How should company registration and management features be implemented? Consider multi-step forms, validation, and hierarchy setup.

*Follow-up considerations:*
- Company registration workflow implementation
- Multi-step form handling and validation
- Company hierarchy and structure management
- Employee import and bulk operations
- Company profile and branding management
- Verification and approval processes

### Employee Profile Management Implementation
**Question 6:** How should employee profile creation and management be implemented? Consider profile creation, editing, enrichment, and role-based access.

*Follow-up considerations:*
- Employee profile creation and onboarding
- Profile editing and management interfaces
- External data enrichment integration
- Role-based access and permissions
- Profile validation and approval
- Bulk operations and data management

### Trainer Profile & Management Implementation
**Question 7:** How should trainer profiles and management features be implemented? Consider trainer registration, content permissions, and teaching assignments.

*Follow-up considerations:*
- Trainer profile creation and setup
- Content creation and management permissions
- Teaching assignment and scheduling
- Skill verification and certification
- Performance tracking and feedback
- Trainer-specific workflows and interfaces

### Training Request & Workflow Implementation
**Question 8:** How should training request workflows be implemented? Consider the three request types, approval processes, and progress tracking.

*Follow-up considerations:*
- Training request creation and management
- Approval workflow and escalation
- Progress tracking and status updates
- Request history and audit trail
- Integration with approval processes
- Workflow automation and notifications

### Integration & Mock Data Implementation
**Question 9:** How should internal and external integrations be implemented with mock data fallbacks? Consider service communication, error handling, and fallback mechanisms.

*Follow-up considerations:*
- Internal microservice integration implementation
- External API integration with fallbacks
- Mock data system and response generation
- Error handling and recovery mechanisms
- Service communication and coordination
- Integration testing and validation

### Build & Deployment Implementation
**Question 10:** How should build scripts and deployment configuration be implemented? Consider frontend builds, backend packaging, and deployment automation.

*Follow-up considerations:*
- Frontend build and optimization
- Backend packaging and deployment
- Database migration and seeding
- Environment configuration and management
- Deployment automation and scripts
- Build optimization and performance

## Confirmation & Summary

After gathering responses to all questions, provide a comprehensive summary including:

1. **Domain Layer Implementation:** Complete domain entities and business logic
2. **Application Layer Implementation:** Use cases and workflow orchestration
3. **Infrastructure Layer Implementation:** Database adapters and external integrations
4. **Presentation Layer Implementation:** React components and Express routes
5. **Feature Implementation:** All major features and workflows
6. **Integration Implementation:** Internal and external service connections
7. **Build & Deployment:** Complete build and deployment configuration

## Validation Prompt
**"Do you confirm this implementation is complete and ready for code review? (Yes/No)"**

If **No:** Refine implementation based on user feedback and repeat confirmation
If **Yes:** Mark implementation as complete and proceed to Code Review & Refactor

## Security & Privacy Considerations
- Implement proper authentication and authorization
- Include data encryption and protection
- Plan for audit logging and compliance
- Include input validation and sanitization
- Implement secure file upload and data handling

## Responsible AI Considerations
- Implement ethical AI integration and usage
- Include user control over AI features
- Plan for bias detection and mitigation
- Implement transparent AI data processing
- Include explainable AI response generation
