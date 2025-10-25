# 13 - Security & Cybersecurity Implementation Template

## Description
This template implements comprehensive security measures, GDPR compliance, and data protection for the Directory microservice, ensuring enterprise-grade security and regulatory compliance.

## What This Template Produces
- Security threat model
- Security implementation guide
- Secrets management documentation
- Privacy policy and compliance plan
- Security monitoring setup

## Inputs Required
- Integration and E2E testing results
- Code review and security audit findings
- Compliance and regulatory requirements
- Architecture and design specifications

## Security Implementation Questions (Ask One at a Time)

### Security Threat Modeling & Risk Assessment
**Question 1:** How should security threats and risks be modeled for the Directory microservice? Consider data breaches, unauthorized access, and system vulnerabilities.

*Follow-up considerations:*
- Threat identification and classification
- Risk assessment and prioritization
- Vulnerability analysis and mitigation
- Attack vector identification
- Security control implementation
- Risk monitoring and management

### Authentication & Authorization Security
**Question 2:** How should authentication and authorization be implemented securely? Consider multi-factor authentication, role-based access, and session management.

*Follow-up considerations:*
- Multi-factor authentication implementation
- Role-based access control security
- Session management and security
- Password policies and security
- Token-based authentication
- Authorization and permission enforcement

### Data Encryption & Protection
**Question 3:** How should data encryption and protection be implemented? Consider data at rest, data in transit, and sensitive data handling.

*Follow-up considerations:*
- Data encryption at rest and in transit
- Sensitive data protection and masking
- Key management and rotation
- Database encryption and security
- API data protection
- File and document encryption

### GDPR Compliance & Data Protection
**Question 4:** How should GDPR compliance and data protection be implemented? Consider data minimization, consent management, and user rights.

*Follow-up considerations:*
- Data minimization and purpose limitation
- User consent management and tracking
- Data subject rights implementation
- Data retention and deletion policies
- Privacy by design implementation
- Data protection impact assessment

### Input Validation & Sanitization
**Question 5:** How should input validation and sanitization be implemented? Consider SQL injection, XSS prevention, and data validation.

*Follow-up considerations:*
- SQL injection prevention
- Cross-site scripting (XSS) prevention
- Input validation and sanitization
- Data type and format validation
- File upload security
- API input validation

### API Security & Rate Limiting
**Question 6:** How should API security and rate limiting be implemented? Consider API authentication, rate limiting, and abuse prevention.

*Follow-up considerations:*
- API authentication and authorization
- Rate limiting and abuse prevention
- API key management and rotation
- Request validation and filtering
- API monitoring and logging
- Security headers and CORS

### Audit Logging & Compliance Monitoring
**Question 7:** How should audit logging and compliance monitoring be implemented? Consider security event logging, compliance tracking, and monitoring.

*Follow-up considerations:*
- Security event logging and monitoring
- Compliance tracking and reporting
- Audit trail and forensic analysis
- Log integrity and protection
- Monitoring and alerting
- Compliance reporting and documentation

### Security Headers & CORS Configuration
**Question 8:** How should security headers and CORS be configured? Consider security headers, cross-origin requests, and browser security.

*Follow-up considerations:*
- Security headers implementation
- CORS configuration and security
- Content Security Policy (CSP)
- HTTPS enforcement and security
- Browser security features
- Security header monitoring

### Vulnerability Management & Patching
**Question 9:** How should vulnerability management and patching be implemented? Consider vulnerability scanning, patch management, and security updates.

*Follow-up considerations:*
- Vulnerability scanning and assessment
- Patch management and updates
- Security dependency management
- Vulnerability monitoring and alerting
- Security update procedures
- Risk assessment and mitigation

### Security Monitoring & Incident Response
**Question 10:** How should security monitoring and incident response be implemented? Consider security monitoring, incident detection, and response procedures.

*Follow-up considerations:*
- Security monitoring and detection
- Incident response procedures
- Security alerting and notification
- Forensic analysis and investigation
- Recovery and remediation procedures
- Security training and awareness

## Confirmation & Summary

After gathering responses to all questions, provide a comprehensive summary including:

1. **Security Threat Model:** Complete threat modeling and risk assessment
2. **Authentication & Authorization:** Secure authentication and authorization implementation
3. **Data Protection:** Comprehensive data encryption and protection
4. **GDPR Compliance:** Complete GDPR compliance and data protection implementation
5. **Input Validation:** Comprehensive input validation and sanitization
6. **API Security:** Secure API implementation with rate limiting
7. **Audit Logging:** Complete audit logging and compliance monitoring
8. **Security Monitoring:** Comprehensive security monitoring and incident response

## Validation Prompt
**"Do you confirm this security implementation is complete and ready for deployment setup? (Yes/No)"**

If **No:** Refine security implementation based on user feedback and repeat confirmation
If **Yes:** Mark security implementation as complete and proceed to Deployment & CI/CD

## Security & Privacy Considerations
- Comprehensive security threat modeling and risk assessment
- Multi-layered security implementation with defense in depth
- GDPR compliance and data protection by design
- Continuous security monitoring and incident response
- Regular security testing and vulnerability assessment

## Responsible AI Considerations
- Ethical AI security and privacy protection
- AI data processing security and encryption
- User consent and control over AI features
- Transparent AI security and privacy practices
- Bias detection and mitigation in AI security
