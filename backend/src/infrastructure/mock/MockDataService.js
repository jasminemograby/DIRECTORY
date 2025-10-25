import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../config/logging.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MockDataService {
  constructor() {
    this.mockDataPath = path.join(__dirname, '../../../database/mocks');
    this.cache = new Map();
  }

  // Company methods
  async getCompany(companyId) {
    try {
      const companies = await this.loadMockData('companies/mock-companies.json');
      return companies.companies.find(c => c.id === companyId) || null;
    } catch (error) {
      logger.error('Failed to load mock company data', { error: error.message, companyId });
      return null;
    }
  }

  async getCompanies(filters = {}) {
    try {
      const companies = await this.loadMockData('companies/mock-companies.json');
      let filteredCompanies = companies.companies;

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCompanies = filteredCompanies.filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.description?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.industry) {
        filteredCompanies = filteredCompanies.filter(c => c.industry === filters.industry);
      }

      if (filters.size) {
        filteredCompanies = filteredCompanies.filter(c => c.size === filters.size);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return filteredCompanies.slice(startIndex, endIndex);
    } catch (error) {
      logger.error('Failed to load mock companies data', { error: error.message, filters });
      return [];
    }
  }

  async createCompany(companyData) {
    // Mock company creation
    const newCompany = {
      id: `company_${Date.now()}`,
      ...companyData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };
    
    logger.info('Mock company created', { companyId: newCompany.id });
    return newCompany;
  }

  async updateCompany(companyId, updateData) {
    const company = await this.getCompany(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const updatedCompany = {
      ...company,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock company updated', { companyId });
    return updatedCompany;
  }

  async deleteCompany(companyId) {
    const company = await this.getCompany(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    logger.info('Mock company deleted', { companyId });
    return { success: true };
  }

  async getCompanyHierarchy(companyId) {
    try {
      const company = await this.getCompany(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Mock hierarchy data
      const hierarchy = {
        ...company,
        departments: [
          {
            id: 'dept_12345',
            name: 'Engineering',
            description: 'Software development and engineering',
            headId: 'emp_12345',
            budget: 1000000,
            kpis: {},
            teams: [
              {
                id: 'team_12345',
                name: 'Frontend Team',
                description: 'Frontend development team',
                leadId: 'emp_12345',
                maxMembers: 10,
                kpis: {},
                employeeCount: 5
              }
            ]
          }
        ]
      };

      return hierarchy;
    } catch (error) {
      logger.error('Failed to load mock company hierarchy', { error: error.message, companyId });
      throw error;
    }
  }

  // Employee methods
  async getEmployee(employeeId) {
    try {
      const employees = await this.loadMockData('employees/mock-employees.json');
      return employees.employees.find(e => e.id === employeeId) || null;
    } catch (error) {
      logger.error('Failed to load mock employee data', { error: error.message, employeeId });
      return null;
    }
  }

  async getEmployees(filters = {}) {
    try {
      const employees = await this.loadMockData('employees/mock-employees.json');
      let filteredEmployees = employees.employees;

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEmployees = filteredEmployees.filter(e => 
          e.firstName.toLowerCase().includes(searchTerm) ||
          e.lastName.toLowerCase().includes(searchTerm) ||
          e.jobTitle.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.departmentId) {
        filteredEmployees = filteredEmployees.filter(e => e.departmentId === filters.departmentId);
      }

      if (filters.teamId) {
        filteredEmployees = filteredEmployees.filter(e => e.teamId === filters.teamId);
      }

      if (filters.role) {
        filteredEmployees = filteredEmployees.filter(e => e.role === filters.role);
      }

      if (filters.level) {
        filteredEmployees = filteredEmployees.filter(e => e.level === filters.level);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return filteredEmployees.slice(startIndex, endIndex);
    } catch (error) {
      logger.error('Failed to load mock employees data', { error: error.message, filters });
      return [];
    }
  }

  async getEmployeeProfile(employeeId) {
    return await this.getEmployee(employeeId);
  }

  async enrichEmployeeProfile(employeeId, sources = ['linkedin', 'github', 'credly', 'gemini']) {
    const employee = await this.getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Mock enrichment data
    const enrichmentData = {
      skills: [
        { name: 'JavaScript', level: 'advanced', source: 'github', verified: true },
        { name: 'React', level: 'intermediate', source: 'github', verified: true },
        { name: 'Leadership', level: 'intermediate', source: 'linkedin', verified: true },
        { name: 'AWS Certified', level: 'expert', source: 'credly', verified: true }
      ],
      valueProposition: 'Experienced professional with strong technical and leadership skills',
      sources
    };

    const normalizedSkills = enrichmentData.skills.map(skill => ({
      ...skill,
      normalized: true,
      category: this.categorizeSkill(skill.name),
      lastNormalized: new Date().toISOString()
    }));

    const enrichedEmployee = {
      ...employee,
      skills: normalizedSkills,
      enrichmentStatus: {
        status: 'completed',
        lastEnriched: new Date().toISOString(),
        sources
      },
      relevanceScore: 85
    };

    return {
      employee: enrichedEmployee,
      enrichmentData,
      normalizedSkills
    };
  }

  // Trainer methods
  async getTrainer(trainerId) {
    try {
      const trainers = await this.loadMockData('trainers/mock-trainers.json');
      return trainers.trainers.find(t => t.id === trainerId) || null;
    } catch (error) {
      logger.error('Failed to load mock trainer data', { error: error.message, trainerId });
      return null;
    }
  }

  async getTrainers(filters = {}) {
    try {
      const trainers = await this.loadMockData('trainers/mock-trainers.json');
      let filteredTrainers = trainers.trainers;

      // Apply filters
      if (filters.companyId) {
        filteredTrainers = filteredTrainers.filter(t => t.companyId === filters.companyId);
      }

      if (filters.trainerType) {
        filteredTrainers = filteredTrainers.filter(t => t.trainerType === filters.trainerType);
      }

      if (filters.skills) {
        filteredTrainers = filteredTrainers.filter(t => 
          t.verifiedTeachingSkills.some(skill => filters.skills.includes(skill))
        );
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return filteredTrainers.slice(startIndex, endIndex);
    } catch (error) {
      logger.error('Failed to load mock trainers data', { error: error.message, filters });
      return [];
    }
  }

  async searchTrainers(searchParams) {
    const { skills, teachingMode, trainerType, companyId } = searchParams;
    
    let trainers = await this.getTrainers({ companyId, trainerType });

    if (skills && skills.length > 0) {
      trainers = trainers.filter(t => 
        t.verifiedTeachingSkills.some(skill => skills.includes(skill))
      );
    }

    if (teachingMode && teachingMode.length > 0) {
      trainers = trainers.filter(t => 
        teachingMode.some(mode => t.teachingMode.includes(mode))
      );
    }

    return trainers;
  }

  async getTrainerAvailability(trainerId) {
    const trainer = await this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    return {
      timezone: trainer.availability.timezone,
      schedule: trainer.availability.schedule,
      nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isAvailable: true,
      lastChecked: new Date().toISOString()
    };
  }

  async createTrainer(trainerData) {
    const newTrainer = {
      id: `trainer_${Date.now()}`,
      ...trainerData,
      status: 'active',
      averageRating: 0.0,
      reviewCount: 0,
      totalStudentsTaught: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    logger.info('Mock trainer created', { trainerId: newTrainer.id });
    return newTrainer;
  }

  async updateTrainer(trainerId, updateData) {
    const trainer = await this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const updatedTrainer = {
      ...trainer,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock trainer updated', { trainerId });
    return updatedTrainer;
  }

  async deleteTrainer(trainerId) {
    const trainer = await this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    logger.info('Mock trainer deleted', { trainerId });
    return { success: true };
  }

  async updateTrainerCertifications(trainerId, certifications) {
    const trainer = await this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const updatedTrainer = {
      ...trainer,
      certifications,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock trainer certifications updated', { trainerId });
    return updatedTrainer;
  }

  async updateTrainerAvailability(trainerId, availability) {
    const trainer = await this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const updatedTrainer = {
      ...trainer,
      availability,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock trainer availability updated', { trainerId });
    return updatedTrainer;
  }

  // Training Request methods
  async getTrainingRequest(requestId) {
    try {
      const requests = await this.loadMockData('training-requests/mock-training-requests.json');
      return requests.requests.find(r => r.id === requestId) || null;
    } catch (error) {
      logger.error('Failed to load mock training request data', { error: error.message, requestId });
      return null;
    }
  }

  async getTrainingRequests(filters = {}) {
    try {
      const requests = await this.loadMockData('training-requests/mock-training-requests.json');
      let filteredRequests = requests.requests;

      // Apply filters
      if (filters.companyId) {
        filteredRequests = filteredRequests.filter(r => r.companyId === filters.companyId);
      }

      if (filters.status) {
        filteredRequests = filteredRequests.filter(r => r.status === filters.status);
      }

      if (filters.requesterId) {
        filteredRequests = filteredRequests.filter(r => r.requesterId === filters.requesterId);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return filteredRequests.slice(startIndex, endIndex);
    } catch (error) {
      logger.error('Failed to load mock training requests data', { error: error.message, filters });
      return [];
    }
  }

  async createTrainingRequest(requestData) {
    const newRequest = {
      id: `req_${Date.now()}`,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    logger.info('Mock training request created', { requestId: newRequest.id });
    return newRequest;
  }

  async approveTrainingRequest(requestId, approverData) {
    const request = await this.getTrainingRequest(requestId);
    if (!request) {
      throw new Error('Training request not found');
    }

    const updatedRequest = {
      ...request,
      status: 'approved',
      approverId: approverData.approverId,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock training request approved', { requestId, approverId: approverData.approverId });
    return updatedRequest;
  }

  async rejectTrainingRequest(requestId, rejectionData) {
    const request = await this.getTrainingRequest(requestId);
    if (!request) {
      throw new Error('Training request not found');
    }

    const updatedRequest = {
      ...request,
      status: 'rejected',
      approverId: rejectionData.approverId,
      rejectionReason: rejectionData.reason,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock training request rejected', { requestId, approverId: rejectionData.approverId });
    return updatedRequest;
  }

  async assignTrainer(requestId, trainerData) {
    const request = await this.getTrainingRequest(requestId);
    if (!request) {
      throw new Error('Training request not found');
    }

    const updatedRequest = {
      ...request,
      trainerId: trainerData.trainerId,
      status: 'assigned',
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock trainer assigned to training request', { requestId, trainerId: trainerData.trainerId });
    return updatedRequest;
  }

  async updateTrainingRequestStatus(requestId, status, additionalData = {}) {
    const request = await this.getTrainingRequest(requestId);
    if (!request) {
      throw new Error('Training request not found');
    }

    const updatedRequest = {
      ...request,
      status,
      ...additionalData,
      updatedAt: new Date().toISOString()
    };

    logger.info('Mock training request status updated', { requestId, status });
    return updatedRequest;
  }

  async getTrainingRequestHistory(requestId) {
    const request = await this.getTrainingRequest(requestId);
    if (!request) {
      throw new Error('Training request not found');
    }

    return [
      {
        action: 'created',
        timestamp: request.createdAt,
        userId: request.requesterId,
        details: 'Training request created'
      },
      {
        action: 'status_changed',
        timestamp: request.updatedAt,
        userId: request.approverId,
        details: `Status changed to ${request.status}`
      }
    ];
  }

  async getTrainingRequestStatistics(filters = {}) {
    const requests = await this.getTrainingRequests(filters);
    
    const statistics = {
      total: requests.length,
      byStatus: {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        assigned: requests.filter(r => r.status === 'assigned').length,
        inProgress: requests.filter(r => r.status === 'in-progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        cancelled: requests.filter(r => r.status === 'cancelled').length
      },
      byType: {
        'career-path': requests.filter(r => r.type === 'career-path').length,
        'skill-driven': requests.filter(r => r.type === 'skill-driven').length,
        'instructor-led': requests.filter(r => r.type === 'instructor-led').length
      },
      averageBudget: requests.reduce((sum, r) => sum + (r.budget || 0), 0) / requests.length || 0
    };

    return statistics;
  }

  async searchTrainingRequests(searchParams) {
    const { status, type, skillCategories, requesterId, companyId } = searchParams;
    
    let requests = await this.getTrainingRequests({ companyId });

    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    if (type) {
      requests = requests.filter(r => r.type === type);
    }

    if (skillCategories && skillCategories.length > 0) {
      requests = requests.filter(r => 
        r.skillCategories.some(category => skillCategories.includes(category))
      );
    }

    if (requesterId) {
      requests = requests.filter(r => r.requesterId === requesterId);
    }

    return requests;
  }

  // Helper methods
  async loadMockData(filePath) {
    const cacheKey = filePath;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const fullPath = path.join(this.mockDataPath, filePath);
      const data = await fs.readFile(fullPath, 'utf8');
      const parsedData = JSON.parse(data);
      
      this.cache.set(cacheKey, parsedData);
      return parsedData;
    } catch (error) {
      logger.error('Failed to load mock data file', { error: error.message, filePath });
      throw error;
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

  // Additional methods for mock routes
  async getEmployeeEnrichment(employeeId) {
    const employee = await this.getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      employeeId,
      enrichmentData: {
        skills: [
          { name: 'JavaScript', level: 'advanced', source: 'github', verified: true },
          { name: 'React', level: 'intermediate', source: 'github', verified: true },
          { name: 'Leadership', level: 'intermediate', source: 'linkedin', verified: true },
          { name: 'AWS Certified', level: 'expert', source: 'credly', verified: true }
        ],
        valueProposition: 'Experienced professional with strong technical and leadership skills',
        sources: ['linkedin', 'github', 'credly', 'gemini']
      },
      normalizedSkills: [
        { name: 'JavaScript', level: 'advanced', source: 'github', verified: true, normalized: true, category: 'Programming' },
        { name: 'React', level: 'intermediate', source: 'github', verified: true, normalized: true, category: 'Frontend' },
        { name: 'Leadership', level: 'intermediate', source: 'linkedin', verified: true, normalized: true, category: 'Soft Skills' },
        { name: 'AWS Certified', level: 'expert', source: 'credly', verified: true, normalized: true, category: 'Cloud' }
      ],
      lastEnriched: new Date().toISOString()
    };
  }

  async getEmployeeSkills(employeeId) {
    const employee = await this.getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      employeeId,
      skills: [
        { name: 'JavaScript', level: 'advanced', category: 'Programming', verified: true },
        { name: 'React', level: 'intermediate', category: 'Frontend', verified: true },
        { name: 'Leadership', level: 'intermediate', category: 'Soft Skills', verified: true },
        { name: 'AWS Certified', level: 'expert', category: 'Cloud', verified: true }
      ],
      competences: [
        {
          name: 'Frontend Development',
          skills: ['JavaScript', 'React'],
          level: 'intermediate',
          description: 'Frontend web development skills'
        },
        {
          name: 'Cloud Computing',
          skills: ['AWS Certified'],
          level: 'expert',
          description: 'Cloud infrastructure and services'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  async getEmployeeSkillGap(employeeId) {
    const employee = await this.getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      employeeId,
      skillGaps: [
        {
          skill: 'TypeScript',
          requiredLevel: 'intermediate',
          currentLevel: 'beginner',
          gap: 'intermediate',
          recommendedCourses: [
            { id: 'ts-101', name: 'TypeScript Fundamentals', provider: 'Pluralsight' },
            { id: 'ts-201', name: 'Advanced TypeScript', provider: 'Udemy' }
          ]
        },
        {
          skill: 'Docker',
          requiredLevel: 'intermediate',
          currentLevel: 'beginner',
          gap: 'intermediate',
          recommendedCourses: [
            { id: 'docker-101', name: 'Docker Basics', provider: 'Coursera' },
            { id: 'docker-201', name: 'Docker Orchestration', provider: 'Linux Academy' }
          ]
        }
      ],
      lastAnalyzed: new Date().toISOString()
    };
  }

  async getEmployeeRelevance(employeeId) {
    const employee = await this.getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      employeeId,
      relevanceScore: 85,
      breakdown: {
        skillsMatch: 90,
        experience: 80,
        enrichmentCompleteness: 85
      },
      factors: [
        { factor: 'Skills Match', score: 90, weight: 0.4 },
        { factor: 'Experience Level', score: 80, weight: 0.3 },
        { factor: 'Enrichment Completeness', score: 85, weight: 0.3 }
      ],
      lastCalculated: new Date().toISOString()
    };
  }

  // Clear cache method for testing
  clearCache() {
    this.cache.clear();
  }
}
