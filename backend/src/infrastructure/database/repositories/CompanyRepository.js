import { logger } from '../../../config/logging.js';
import { MockDataService } from '../../mock/MockDataService.js';

export class CompanyRepository {
  constructor() {
    this.mockDataService = new MockDataService();
  }

  async findById(companyId) {
    try {
      logger.debug('CompanyRepository.findById', { companyId });
      return await this.mockDataService.getCompany(companyId);
    } catch (error) {
      logger.error('CompanyRepository.findById error', { error: error.message, companyId });
      throw error;
    }
  }

  async findAll(filters = {}) {
    try {
      logger.debug('CompanyRepository.findAll', { filters });
      return await this.mockDataService.getCompanies(filters);
    } catch (error) {
      logger.error('CompanyRepository.findAll error', { error: error.message, filters });
      throw error;
    }
  }

  async create(companyData) {
    try {
      logger.debug('CompanyRepository.create', { companyData });
      return await this.mockDataService.createCompany(companyData);
    } catch (error) {
      logger.error('CompanyRepository.create error', { error: error.message, companyData });
      throw error;
    }
  }

  async update(companyId, updateData) {
    try {
      logger.debug('CompanyRepository.update', { companyId, updateData });
      return await this.mockDataService.updateCompany(companyId, updateData);
    } catch (error) {
      logger.error('CompanyRepository.update error', { error: error.message, companyId, updateData });
      throw error;
    }
  }

  async delete(companyId) {
    try {
      logger.debug('CompanyRepository.delete', { companyId });
      return await this.mockDataService.deleteCompany(companyId);
    } catch (error) {
      logger.error('CompanyRepository.delete error', { error: error.message, companyId });
      throw error;
    }
  }

  async getHierarchy(companyId) {
    try {
      logger.debug('CompanyRepository.getHierarchy', { companyId });
      return await this.mockDataService.getCompanyHierarchy(companyId);
    } catch (error) {
      logger.error('CompanyRepository.getHierarchy error', { error: error.message, companyId });
      throw error;
    }
  }
}
