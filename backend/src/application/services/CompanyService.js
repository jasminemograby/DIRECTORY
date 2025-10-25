import { Company } from '../../domain/entities/Company.js';
import { logger } from '../../config/logging.js';
import { config } from '../../config/environment.js';

export class CompanyService {
  constructor(companyRepository, mockDataService) {
    this.companyRepository = companyRepository;
    this.mockDataService = mockDataService;
    this.mockMode = config.MOCK_MODE;
  }

  async createCompany(companyData) {
    try {
      // Validate company data
      const company = new Company(companyData);
      const validationErrors = company.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Try to create in database first
      if (!this.mockMode) {
        try {
          const createdCompany = await this.companyRepository.create(company);
          logger.info('Company created successfully', { companyId: createdCompany.id });
          return { company: createdCompany, source: 'live' };
        } catch (error) {
          logger.warn('Database creation failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockCompany = await this.mockDataService.createCompany(companyData);
      logger.info('Company created using mock data', { companyId: mockCompany.id });
      return { company: mockCompany, source: 'mock' };

    } catch (error) {
      logger.error('Company creation failed', { error: error.message, companyData });
      throw error;
    }
  }

  async getCompany(companyId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const company = await this.companyRepository.findById(companyId);
          if (company) {
            logger.debug('Company retrieved from database', { companyId });
            return { company, source: 'live' };
          }
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockCompany = await this.mockDataService.getCompany(companyId);
      if (!mockCompany) {
        throw new Error('Company not found');
      }
      
      logger.debug('Company retrieved from mock data', { companyId });
      return { company: mockCompany, source: 'mock' };

    } catch (error) {
      logger.error('Company retrieval failed', { error: error.message, companyId });
      throw error;
    }
  }

  async getCompanies(filters = {}) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const companies = await this.companyRepository.findAll(filters);
          logger.debug('Companies retrieved from database', { count: companies.length });
          return { companies, source: 'live' };
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockCompanies = await this.mockDataService.getCompanies(filters);
      logger.debug('Companies retrieved from mock data', { count: mockCompanies.length });
      return { companies: mockCompanies, source: 'mock' };

    } catch (error) {
      logger.error('Companies retrieval failed', { error: error.message, filters });
      throw error;
    }
  }

  async updateCompany(companyId, updateData) {
    try {
      // Validate update data
      const company = new Company({ id: companyId, ...updateData });
      const validationErrors = company.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedCompany = await this.companyRepository.update(companyId, updateData);
          logger.info('Company updated in database', { companyId });
          return { company: updatedCompany, source: 'live' };
        } catch (error) {
          logger.warn('Database update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockCompany = await this.mockDataService.updateCompany(companyId, updateData);
      logger.info('Company updated using mock data', { companyId });
      return { company: mockCompany, source: 'mock' };

    } catch (error) {
      logger.error('Company update failed', { error: error.message, companyId, updateData });
      throw error;
    }
  }

  async deleteCompany(companyId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          await this.companyRepository.softDelete(companyId);
          logger.info('Company deleted from database', { companyId });
          return { success: true, source: 'live' };
        } catch (error) {
          logger.warn('Database deletion failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      await this.mockDataService.deleteCompany(companyId);
      logger.info('Company deleted using mock data', { companyId });
      return { success: true, source: 'mock' };

    } catch (error) {
      logger.error('Company deletion failed', { error: error.message, companyId });
      throw error;
    }
  }

  async getCompanyHierarchy(companyId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const hierarchy = await this.companyRepository.getHierarchy(companyId);
          logger.debug('Company hierarchy retrieved from database', { companyId });
          return { hierarchy, source: 'live' };
        } catch (error) {
          logger.warn('Database hierarchy retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockHierarchy = await this.mockDataService.getCompanyHierarchy(companyId);
      logger.debug('Company hierarchy retrieved from mock data', { companyId });
      return { hierarchy: mockHierarchy, source: 'mock' };

    } catch (error) {
      logger.error('Company hierarchy retrieval failed', { error: error.message, companyId });
      throw error;
    }
  }
}
