import { logger } from '../../../config/logging.js';
import { MockDataService } from '../../mock/MockDataService.js';

export class EmployeeRepository {
  constructor() {
    this.mockDataService = new MockDataService();
  }

  async findById(employeeId) {
    try {
      logger.debug('EmployeeRepository.findById', { employeeId });
      return await this.mockDataService.getEmployee(employeeId);
    } catch (error) {
      logger.error('EmployeeRepository.findById error', { error: error.message, employeeId });
      throw error;
    }
  }

  async findAll(filters = {}) {
    try {
      logger.debug('EmployeeRepository.findAll', { filters });
      return await this.mockDataService.getEmployees(filters);
    } catch (error) {
      logger.error('EmployeeRepository.findAll error', { error: error.message, filters });
      throw error;
    }
  }

  async getProfile(employeeId) {
    try {
      logger.debug('EmployeeRepository.getProfile', { employeeId });
      return await this.mockDataService.getEmployeeProfile(employeeId);
    } catch (error) {
      logger.error('EmployeeRepository.getProfile error', { error: error.message, employeeId });
      throw error;
    }
  }

  async enrichProfile(employeeId, sources = []) {
    try {
      logger.debug('EmployeeRepository.enrichProfile', { employeeId, sources });
      return await this.mockDataService.enrichEmployeeProfile(employeeId, sources);
    } catch (error) {
      logger.error('EmployeeRepository.enrichProfile error', { error: error.message, employeeId, sources });
      throw error;
    }
  }

  async getSkills(employeeId) {
    try {
      logger.debug('EmployeeRepository.getSkills', { employeeId });
      return await this.mockDataService.getEmployeeSkills(employeeId);
    } catch (error) {
      logger.error('EmployeeRepository.getSkills error', { error: error.message, employeeId });
      throw error;
    }
  }

  async getSkillGap(employeeId) {
    try {
      logger.debug('EmployeeRepository.getSkillGap', { employeeId });
      return await this.mockDataService.getEmployeeSkillGap(employeeId);
    } catch (error) {
      logger.error('EmployeeRepository.getSkillGap error', { error: error.message, employeeId });
      throw error;
    }
  }

  async getRelevance(employeeId) {
    try {
      logger.debug('EmployeeRepository.getRelevance', { employeeId });
      return await this.mockDataService.getEmployeeRelevance(employeeId);
    } catch (error) {
      logger.error('EmployeeRepository.getRelevance error', { error: error.message, employeeId });
      throw error;
    }
  }
}
