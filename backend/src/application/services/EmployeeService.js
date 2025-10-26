import { Employee } from '../../domain/entities/Employee.js';
import { logger } from '../../config/logging.js';
import { config } from '../../config/environment.js';

export class EmployeeService {
  constructor(employeeRepository, mockEnrichmentAPI, mockSkillsAPI) {
    this.employeeRepository = employeeRepository;
    this.mockEnrichmentAPI = mockEnrichmentAPI;
    this.mockSkillsAPI = mockSkillsAPI;
    this.mockMode = config.MOCK_MODE;
  }

  async getEmployees(filters = {}) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const employees = await this.employeeRepository.findAll(filters);
          logger.debug('Employees retrieved from database', { count: employees.length });
          return { employees, source: 'live' };
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockEmployees = await this.mockEnrichmentAPI.getEmployees(filters);
      logger.debug('Employees retrieved from mock data', { count: mockEmployees.length });
      return { employees: mockEmployees, source: 'mock' };

    } catch (error) {
      logger.error('Employees retrieval failed', { error: error.message, filters });
      throw error;
    }
  }

  async getEmployeeProfile(employeeId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const employee = await this.employeeRepository.getProfileWithCompetences(employeeId);
          if (employee) {
            logger.debug('Employee profile retrieved from database', { employeeId });
            return { employee, source: 'live' };
          }
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockEmployee = await this.mockEnrichmentAPI.getEmployeeProfile(employeeId);
      if (!mockEmployee) {
        throw new Error('Employee not found');
      }
      
      logger.debug('Employee profile retrieved from mock data', { employeeId });
      return { employee: mockEmployee, source: 'mock' };

    } catch (error) {
      logger.error('Employee profile retrieval failed', { error: error.message, employeeId });
      throw error;
    }
  }

  async enrichEmployeeProfile(employeeId, sources = ['linkedin', 'github', 'credly', 'gemini']) {
    try {
      // Get employee data first
      const employeeResult = await this.getEmployeeProfile(employeeId);
      const employee = employeeResult.employee;

      // Try real enrichment first
      if (!this.mockMode) {
        try {
          // Call external APIs for enrichment
          const enrichmentData = await this.callExternalAPIs(employee, sources);
          
          // Normalize skills through Skills Engine
          const normalizedSkills = await this.normalizeSkills(enrichmentData.skills);
          
          // Update employee with enriched data
          const updatedEmployee = await this.employeeRepository.updateEnrichment(
            employeeId, 
            enrichmentData, 
            normalizedSkills
          );
          
          logger.info('Employee profile enriched using real APIs', { employeeId, sources });
          return {
            employee: updatedEmployee,
            enrichmentData,
            normalizedSkills,
            source: 'live'
          };
        } catch (error) {
          logger.warn('Real enrichment failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock enrichment
      const mockEnrichment = await this.mockEnrichmentAPI.enrichProfile(employeeId, sources);
      logger.info('Employee profile enriched using mock data', { employeeId, sources });
      return {
        employee: mockEnrichment.employee,
        enrichmentData: mockEnrichment.enrichmentData,
        normalizedSkills: mockEnrichment.normalizedSkills,
        source: 'mock'
      };

    } catch (error) {
      logger.error('Employee enrichment failed', { error: error.message, employeeId, sources });
      throw error;
    }
  }

  async updateEmployeeSkills(employeeId, skillsData) {
    try {
      // Validate skills data
      const employee = new Employee({ id: employeeId, skills: skillsData.skills });
      const validationErrors = employee.validateSkills();
      
      if (validationErrors.length > 0) {
        throw new Error(`Skills validation failed: ${validationErrors.join(', ')}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedEmployee = await this.employeeRepository.updateSkills(employeeId, skillsData.skills);
          logger.info('Employee skills updated in database', { employeeId });
          return { employee: updatedEmployee, source: 'live' };
        } catch (error) {
          logger.warn('Database update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockEmployee = await this.mockSkillsAPI.updateSkills(employeeId, skillsData);
      logger.info('Employee skills updated using mock data', { employeeId });
      return { employee: mockEmployee, source: 'mock' };

    } catch (error) {
      logger.error('Employee skills update failed', { error: error.message, employeeId, skillsData });
      throw error;
    }
  }

  async getSkillGap(employeeId, careerGoal = null) {
    try {
      // Get employee data first
      const employeeResult = await this.getEmployeeProfile(employeeId);
      const employee = employeeResult.employee;

      // Try real skill gap analysis first
      if (!this.mockMode) {
        try {
          const skillGap = await this.analyzeSkillGap(employee, careerGoal);
          logger.debug('Skill gap analyzed using real service', { employeeId, careerGoal });
          return { skillGap, source: 'live' };
        } catch (error) {
          logger.warn('Real skill gap analysis failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockSkillGap = await this.mockSkillsAPI.getSkillGap(employeeId, careerGoal);
      logger.debug('Skill gap analyzed using mock data', { employeeId, careerGoal });
      return { skillGap: mockSkillGap, source: 'mock' };

    } catch (error) {
      logger.error('Skill gap analysis failed', { error: error.message, employeeId, careerGoal });
      throw error;
    }
  }

  async getRelevanceScore(employeeId) {
    try {
      // Get employee data first
      const employeeResult = await this.getEmployeeProfile(employeeId);
      const employee = employeeResult.employee;

      // Calculate relevance score
      const relevanceScore = employee.calculateRelevanceScore();
      
      logger.debug('Relevance score calculated', { employeeId, score: relevanceScore });
      return { 
        relevanceScore,
        scoreBreakdown: employee.getRelevanceBreakdown(),
        factors: employee.getRelevanceFactors(),
        source: employeeResult.source
      };

    } catch (error) {
      logger.error('Relevance score calculation failed', { error: error.message, employeeId });
      throw error;
    }
  }

  async getEmployeeCompetences(employeeId) {
    try {
      // Get employee data first
      const employeeResult = await this.getEmployeeProfile(employeeId);
      const employee = employeeResult.employee;

      logger.debug('Employee competences retrieved', { employeeId });
      return { 
        competences: employee.competences,
        source: employeeResult.source
      };

    } catch (error) {
      logger.error('Employee competences retrieval failed', { error: error.message, employeeId });
      throw error;
    }
  }

  // Helper methods for real API calls
  async callExternalAPIs(employee, sources) {
    const enrichmentData = {
      skills: [],
      valueProposition: '',
      sources: []
    };

    for (const source of sources) {
      try {
        let sourceData = {};
        
        switch (source) {
          case 'linkedin':
            sourceData = await this.callLinkedInAPI(employee);
            break;
          case 'github':
            sourceData = await this.callGitHubAPI(employee);
            break;
          case 'credly':
            sourceData = await this.callCredlyAPI(employee);
            break;
          case 'gemini':
            sourceData = await this.callGeminiAPI(employee);
            break;
          case 'orcid':
            sourceData = await this.callORCIDAPI(employee);
            break;
        }

        enrichmentData.skills.push(...sourceData.skills || []);
        enrichmentData.sources.push(source);
        
        if (sourceData.valueProposition) {
          enrichmentData.valueProposition += `${sourceData.valueProposition} `;
        }
      } catch (error) {
        logger.warn(`Failed to enrich from ${source}`, { error: error.message });
      }
    }

    return enrichmentData;
  }

  async callLinkedInAPI(_employee) {
    // Mock implementation - replace with real LinkedIn API call
    return {
      skills: [
        { name: 'Leadership', level: 'intermediate', source: 'linkedin' },
        { name: 'Project Management', level: 'advanced', source: 'linkedin' }
      ],
      valueProposition: 'Experienced professional with strong leadership skills'
    };
  }

  async callGitHubAPI(_employee) {
    // Mock implementation - replace with real GitHub API call
    return {
      skills: [
        { name: 'JavaScript', level: 'advanced', source: 'github' },
        { name: 'React', level: 'intermediate', source: 'github' }
      ],
      valueProposition: 'Active developer with modern web technologies'
    };
  }

  async callCredlyAPI(_employee) {
    // Mock implementation - replace with real Credly API call
    return {
      skills: [
        { name: 'AWS Certified', level: 'expert', source: 'credly' },
        { name: 'Agile Methodology', level: 'intermediate', source: 'credly' }
      ],
      valueProposition: 'Certified professional with cloud expertise'
    };
  }

  async callGeminiAPI(_employee) {
    // Mock implementation - replace with real Gemini API call
    return {
      skills: [
        { name: 'AI/ML', level: 'beginner', source: 'gemini' },
        { name: 'Data Analysis', level: 'intermediate', source: 'gemini' }
      ],
      valueProposition: 'AI-powered skill analysis and recommendations'
    };
  }

  async callORCIDAPI(_employee) {
    // Mock implementation - replace with real ORCID API call
    return {
      skills: [
        { name: 'Research', level: 'advanced', source: 'orcid' },
        { name: 'Academic Writing', level: 'expert', source: 'orcid' }
      ],
      valueProposition: 'Research professional with academic credentials'
    };
  }

  async normalizeSkills(skills) {
    try {
      // Call Skills Engine to normalize skills
      // Mock implementation - replace with real Skills Engine call
      return skills.map(skill => ({
        ...skill,
        normalized: true,
        category: this.categorizeSkill(skill.name),
        lastNormalized: new Date().toISOString()
      }));
    } catch (error) {
      logger.warn('Skills normalization failed', { error: error.message });
      return skills; // Return original skills if normalization fails
    }
  }

  categorizeSkill(skillName) {
    const categories = {
      'JavaScript': 'Programming',
      'React': 'Frontend',
      'Node.js': 'Backend',
      'AWS': 'Cloud',
      'Leadership': 'Soft Skills',
      'Project Management': 'Management'
    };
    return categories[skillName] || 'Other';
  }

  async analyzeSkillGap(employee, careerGoal) {
    try {
      // Call Skills Engine for skill gap analysis
      // Mock implementation - replace with real Skills Engine call
      return {
        employeeId: employee.id,
        careerGoal: careerGoal || employee.careerGoal,
        skillGaps: [
          {
            skill: 'Advanced JavaScript',
            requiredLevel: 'advanced',
            currentLevel: 'intermediate',
            gap: 'medium',
            recommendedCourses: [
              {
                id: 'course_1',
                title: 'Advanced JavaScript Patterns',
                provider: 'TechAcademy',
                duration: '40 hours',
                level: 'advanced',
                rating: 4.8,
                url: 'https://marketplace.com/courses/advanced-js-patterns'
              }
            ]
          }
        ],
        overallGapScore: 65,
        prioritySkills: ['Advanced JavaScript', 'System Design']
      };
    } catch (error) {
      logger.warn('Skill gap analysis failed', { error: error.message });
      throw error;
    }
  }
}
