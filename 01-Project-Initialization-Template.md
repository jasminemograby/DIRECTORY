# 01 - Project Initialization & Discovery Template

## Description
This template conducts deep discovery to understand the user's product vision, goals, and constraints through plain-language, non-technical questions.

## What This Template Produces
- Project charter document
- Initial requirements summary  
- Technology stack confirmation
- Discovery session notes
- User persona and target audience definition

## Inputs Required
- None (this is the starting point)

## Discovery Questions (Ask One at a Time)

### Product Vision & Purpose
**Question 1:** What is the main purpose of your application? What problem does it solve for your users?

*Follow-up considerations:*
- If it's a business tool, ask about workflow efficiency
- If it's consumer-facing, ask about user experience goals
- If it's a marketplace, ask about transaction types
- If it's content-based, ask about content creation and consumption

### Target Audience
**Question 2:** Who are your primary users? Describe them in terms of their role, technical comfort level, and what they're trying to accomplish.

*Follow-up considerations:*
- Ask about user demographics and technical expertise
- Inquire about their current pain points or tools they use
- Understand their workflow and daily tasks
- Consider accessibility and internationalization needs

### Business Model & Monetization
**Question 3:** How do you plan to generate revenue or value from this application? Is this for personal use, a business, or a commercial product?

*Follow-up considerations:*
- If commercial, ask about pricing models and target market size
- If business tool, ask about ROI expectations and user adoption
- If personal project, understand the learning or portfolio goals
- Consider subscription, one-time purchase, or freemium models

### Content & Data Types
**Question 4:** What kind of data or content will your application handle? Think about the main entities, information types, and how users will interact with this data.

*Follow-up considerations:*
- Ask about data sensitivity and privacy requirements
- Understand data volume and growth expectations
- Consider data relationships and dependencies
- Plan for data import/export needs

### User Interactions & Workflows
**Question 5:** Walk me through a typical user session. What would someone do from the moment they arrive at your application until they complete their main task?

*Follow-up considerations:*
- Map out the primary user journey
- Identify key decision points and actions
- Understand error scenarios and edge cases
- Plan for user onboarding and help systems

### Integration & External Services
**Question 6:** Does your application need to connect with any external services, APIs, or third-party tools? Think about payment processing, email services, social media, or other platforms.

*Follow-up considerations:*
- Identify which integrations are essential vs. nice-to-have
- Understand data flow between systems
- Plan for API rate limits and error handling
- Consider mock vs. real integration decisions

### Performance & Scale Expectations
**Question 7:** How many users do you expect to have, and what kind of usage patterns do you anticipate? Think about concurrent users, data volume, and peak usage times.

*Follow-up considerations:*
- Ask about geographic distribution of users
- Understand peak usage scenarios
- Plan for data retention and archival
- Consider performance requirements and SLAs

### Compliance & Security Requirements
**Question 8:** Are there any specific compliance requirements, security standards, or regulatory considerations for your application? Think about data protection, industry standards, or legal requirements.

*Follow-up considerations:*
- Identify data protection and privacy requirements
- Understand industry-specific compliance needs
- Plan for audit trails and logging
- Consider international data transfer restrictions

### Timeline & Success Metrics
**Question 9:** What's your timeline for getting this application live, and how will you measure success? Think about launch goals, user adoption targets, and key performance indicators.

*Follow-up considerations:*
- Understand MVP vs. full feature set priorities
- Plan for iterative development and feedback
- Identify success metrics and monitoring needs
- Consider post-launch feature roadmap

### Technical Constraints & Preferences
**Question 10:** Are there any specific technical constraints, preferences, or requirements I should know about? Think about existing systems, team expertise, or platform requirements.

*Follow-up considerations:*
- Understand existing infrastructure or systems
- Consider team technical expertise and learning goals
- Plan for maintenance and support capabilities
- Identify any platform or technology preferences

## Confirmation & Summary

After gathering responses to all questions, provide a comprehensive summary including:

1. **Product Summary:** Clear description of what the application does and who it serves
2. **Key Features:** Main functionality and user workflows identified
3. **Technical Inferences:** Architecture decisions derived from requirements
4. **Mock vs. Real API Decisions:** Which features should use mock data initially
5. **Success Criteria:** How success will be measured
6. **Timeline Expectations:** Development and launch timeline

## Validation Prompt
**"Do you confirm this understanding before we proceed to detailed requirements gathering? (Yes/No)"**

If **No:** Refine understanding based on user feedback and repeat confirmation
If **Yes:** Mark discovery phase as complete and proceed to Requirements Gathering

## Security & Privacy Considerations
- Document any sensitive data handling requirements
- Plan for user privacy and data protection
- Consider authentication and authorization needs
- Identify compliance and regulatory requirements

## Responsible AI Considerations
- Ensure ethical data handling practices
- Plan for inclusive and accessible design
- Consider bias and fairness in any algorithmic components
- Plan for transparency and user control over data
