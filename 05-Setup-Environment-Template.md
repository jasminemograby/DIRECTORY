# 05 - Environment Setup & Repository Structure Template

## Description
This template initializes the monorepo structure, Git configuration, and development environment setup for the Directory microservice with proper secrets management and code quality tools.

## What This Template Produces
- Monorepo folder structure
- Git configuration and branch strategy
- Development environment setup guide
- Secrets management documentation
- Code quality configuration files

## Inputs Required
- Architecture design decisions
- UI/UX design system
- Technology stack specifications
- Security and compliance requirements

## Environment Setup Questions (Ask One at a Time)

### Monorepo Structure & Organization
**Question 1:** How should the monorepo be structured to support the Directory microservice with frontend, backend, database, shared, and docs folders? Consider development workflow and deployment requirements.

*Follow-up considerations:*
- Frontend folder structure (React components, pages, assets)
- Backend folder structure (Express routes, services, middleware)
- Database folder structure (migrations, seeds, mock data)
- Shared folder structure (utilities, constants, validation)
- Docs folder structure (architecture, API, deployment guides)
- Root configuration files and scripts

### Git Configuration & Branch Strategy
**Question 2:** How should Git be configured for the Directory microservice development? Consider branch strategy, commit conventions, and collaboration workflow.

*Follow-up considerations:*
- Branch naming conventions and strategy
- Commit message conventions and standards
- Pull request and code review process
- Release and versioning strategy
- Git hooks for code quality and testing
- Collaboration and team workflow

### Development Environment Configuration
**Question 3:** How should the development environment be configured for efficient development? Consider Node.js setup, package management, and development tools.

*Follow-up considerations:*
- Node.js version and package manager setup
- Development dependencies and tools
- Environment variable configuration
- Local development server setup
- Hot reloading and development workflow
- Debugging and development tools

### Secrets Management & Environment Variables
**Question 4:** How should secrets and environment variables be managed across different environments? Consider security, deployment, and development workflow.

*Follow-up considerations:*
- Environment variable naming conventions
- Secrets management strategy
- Development vs production configuration
- Platform-specific secrets (Vercel, Railway, Supabase)
- Security best practices and guidelines
- Documentation for manual secret entry

### Code Quality & Linting Configuration
**Question 5:** How should code quality tools be configured for the Directory microservice? Consider ESLint, Prettier, and other quality assurance tools.

*Follow-up considerations:*
- ESLint configuration for JavaScript ES6
- Prettier configuration for code formatting
- Pre-commit hooks for code quality
- Code style guidelines and standards
- Automated code quality checks
- Integration with CI/CD pipeline

### Testing Environment Setup
**Question 6:** How should the testing environment be configured for the Directory microservice? Consider Jest setup, test utilities, and testing workflow.

*Follow-up considerations:*
- Jest configuration for unit and integration tests
- Test utilities and helper functions
- Mock data and test fixtures
- Testing workflow and best practices
- Coverage reporting and thresholds
- Integration with CI/CD pipeline

### Build & Deployment Configuration
**Question 7:** How should build and deployment configurations be set up for the Directory microservice? Consider build scripts, deployment targets, and CI/CD integration.

*Follow-up considerations:*
- Frontend build configuration (Vite/Next.js)
- Backend build and packaging
- Database migration and seeding scripts
- Deployment scripts and automation
- Environment-specific configurations
- CI/CD pipeline integration

### Documentation & Project Setup
**Question 8:** How should project documentation and setup guides be structured? Consider README files, setup instructions, and development guides.

*Follow-up considerations:*
- Root README with project overview
- Setup and installation instructions
- Development workflow documentation
- API documentation structure
- Deployment and maintenance guides
- Contributing guidelines and standards

### Security Configuration & Best Practices
**Question 9:** How should security configurations be implemented for the Directory microservice? Consider security headers, CORS, and other security measures.

*Follow-up considerations:*
- Security headers and CORS configuration
- Input validation and sanitization
- Rate limiting and security middleware
- Security scanning and vulnerability assessment
- Security best practices documentation
- Compliance and audit requirements

### Monitoring & Development Tools
**Question 10:** How should monitoring and development tools be configured for the Directory microservice? Consider logging, debugging, and performance monitoring.

*Follow-up considerations:*
- Logging configuration and structured logging
- Development debugging tools
- Performance monitoring and profiling
- Error tracking and reporting
- Health checks and system monitoring
- Development workflow optimization

## Confirmation & Summary

After gathering responses to all questions, provide a comprehensive summary including:

1. **Monorepo Structure:** Complete folder structure with all necessary directories and files
2. **Git Configuration:** Branch strategy, commit conventions, and collaboration workflow
3. **Development Environment:** Complete development setup with all necessary tools and configurations
4. **Secrets Management:** Comprehensive secrets management strategy and documentation
5. **Code Quality Setup:** ESLint, Prettier, and other quality assurance tools configuration
6. **Testing Environment:** Jest and testing utilities setup with best practices
7. **Build Configuration:** Build scripts and deployment configuration for all platforms
8. **Documentation Structure:** Complete documentation setup and guidelines

## Validation Prompt
**"Do you confirm this environment setup is complete and ready for development? (Yes/No)"**

If **No:** Refine setup based on user feedback and repeat confirmation
If **Yes:** Mark environment setup as complete and proceed to Feature Design

## Security & Privacy Considerations
- Implement proper secrets management and never store secrets in code
- Configure security headers and CORS properly
- Set up input validation and sanitization
- Plan for security scanning and vulnerability assessment
- Document security best practices and compliance requirements

## Responsible AI Considerations
- Plan for ethical development practices and code review
- Include accessibility and inclusive design in development workflow
- Plan for bias testing and mitigation in development process
- Include ethical AI usage guidelines in development documentation
- Plan for transparent and explainable AI feature development
