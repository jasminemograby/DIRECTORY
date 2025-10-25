# 07 - Data Model & Database Design Template

## Description
This template designs the PostgreSQL database schema for Supabase, creates migration files, and defines comprehensive mock data structures for the Directory microservice with multi-tenancy support.

## What This Template Produces
- Database schema design
- Supabase migration files
- Mock data JSON files (`mock-[feature].json`)
- Seed data scripts
- Database documentation

## Inputs Required
- Feature design specifications
- Architecture design decisions
- Mock data requirements
- Multi-tenancy requirements

## Data Model Design Questions (Ask One at a Time)

### Core Entity Design & Relationships
**Question 1:** How should the core entities (Company, Employee, Trainer, Department, Team) be designed with proper relationships and constraints? Consider multi-tenancy and data integrity.

*Follow-up considerations:*
- Company entity with tenant isolation
- Employee entity with company relationship
- Trainer entity with specialized fields
- Department and Team hierarchy
- Entity relationships and foreign keys
- Data validation and constraints

### Multi-Tenancy & Data Isolation Design
**Question 2:** How should multi-tenancy be implemented in the database schema? Consider company-based data isolation, security, and performance optimization.

*Follow-up considerations:*
- Company-based data partitioning
- Row-level security implementation
- Data isolation and access control
- Performance optimization for multi-tenancy
- Backup and recovery strategies
- Compliance and audit requirements

### Employee Profile & Skills Data Model
**Question 3:** How should employee profiles and skills data be modeled? Consider personal information, professional details, skills, and career development data.

*Follow-up considerations:*
- Employee profile fields and structure
- Skills and competencies modeling
- Career path and development tracking
- Learning history and progress
- External data enrichment storage
- Data validation and integrity

### Trainer Profile & Content Data Model
**Question 4:** How should trainer profiles and content-related data be modeled? Consider trainer types, permissions, teaching history, and content management.

*Follow-up considerations:*
- Trainer profile specialized fields
- Content creation and management permissions
- Teaching history and course tracking
- Skill verification and certification
- Performance metrics and feedback
- Trainer-specific data relationships

### Training Request & Workflow Data Model
**Question 5:** How should training requests and approval workflows be modeled? Consider different request types, approval processes, and status tracking.

*Follow-up considerations:*
- Training request entity design
- Request type classification (career-path, skill-driven, instructor-led)
- Approval workflow and status tracking
- Request history and audit trail
- Progress tracking and completion
- Integration with other microservices

### External API Integration Data Model
**Question 6:** How should external API integration data be modeled? Consider LinkedIn, GitHub, Credly, and other external data sources with proper storage and relationships.

*Follow-up considerations:*
- External API data storage structure
- Data enrichment and validation
- API response caching and management
- Data freshness and update tracking
- Error handling and fallback data
- Privacy and compliance considerations

### Audit Logging & Compliance Data Model
**Question 7:** How should audit logging and compliance data be modeled? Consider GDPR compliance, data retention, and audit trail requirements.

*Follow-up considerations:*
- Audit log entity design
- Compliance tracking and reporting
- Data retention and deletion policies
- Privacy consent and management
- Security event logging
- Regulatory compliance requirements

### Mock Data Structure & Generation
**Question 8:** How should mock data be structured and generated for all entities and integrations? Consider realistic data, relationships, and testing scenarios.

*Follow-up considerations:*
- Mock data file structure and naming
- Realistic data generation and relationships
- Test scenario data and edge cases
- Data validation and consistency
- Performance testing data
- Integration testing mockups

### Database Performance & Optimization
**Question 9:** How should the database be optimized for performance and scalability? Consider indexing, query optimization, and resource management.

*Follow-up considerations:*
- Database indexing strategy
- Query optimization and performance
- Connection pooling and resource management
- Data archiving and cleanup
- Backup and recovery optimization
- Monitoring and performance tracking

### Migration & Versioning Strategy
**Question 10:** How should database migrations and versioning be managed? Consider schema evolution, data migration, and rollback strategies.

*Follow-up considerations:*
- Migration file structure and naming
- Schema versioning and evolution
- Data migration and transformation
- Rollback and recovery procedures
- Environment-specific migrations
- Migration testing and validation

## Confirmation & Summary

After gathering responses to all questions, provide a comprehensive summary including:

1. **Database Schema Design:** Complete PostgreSQL schema with all entities and relationships
2. **Multi-Tenancy Implementation:** Company-based data isolation and security
3. **Migration Files:** Supabase migration files for schema creation and updates
4. **Mock Data Structure:** Comprehensive mock data files for all entities and integrations
5. **Seed Data Scripts:** Database seeding scripts for development and testing
6. **Performance Optimization:** Indexing strategy and query optimization
7. **Compliance & Audit:** GDPR compliance and audit logging implementation

## Validation Prompt
**"Do you confirm this data model and database design is complete and ready for implementation? (Yes/No)"**

If **No:** Refine data model based on user feedback and repeat confirmation
If **Yes:** Mark data model design as complete and proceed to Endpoints & Integrations

## Security & Privacy Considerations
- Implement proper data encryption and protection
- Design secure multi-tenancy with data isolation
- Plan for GDPR compliance and data protection
- Include comprehensive audit logging
- Design secure data migration and backup procedures

## Responsible AI Considerations
- Plan for ethical data handling in AI integration
- Design transparent AI data storage and processing
- Ensure user control over AI-generated data
- Plan for bias detection and mitigation in data models
- Design explainable AI data structures and relationships
