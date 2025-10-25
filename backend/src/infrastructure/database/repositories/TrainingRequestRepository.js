import { logger } from '../../../config/logging.js';
import { MockDataService } from '../../mock/MockDataService.js';

export class TrainingRequestRepository {
  constructor() {
    this.mockDataService = new MockDataService();
  }

  async findById(requestId) {
    try {
      logger.debug('TrainingRequestRepository.findById', { requestId });
      return await this.mockDataService.getTrainingRequest(requestId);
    } catch (error) {
      logger.error('TrainingRequestRepository.findById error', { error: error.message, requestId });
      throw error;
    }
  }

  async findAll(filters = {}) {
    try {
      logger.debug('TrainingRequestRepository.findAll', { filters });
      return await this.mockDataService.getTrainingRequests(filters);
    } catch (error) {
      logger.error('TrainingRequestRepository.findAll error', { error: error.message, filters });
      throw error;
    }
  }

  async search(searchParams) {
    try {
      logger.debug('TrainingRequestRepository.search', { searchParams });
      return await this.mockDataService.searchTrainingRequests(searchParams);
    } catch (error) {
      logger.error('TrainingRequestRepository.search error', { error: error.message, searchParams });
      throw error;
    }
  }

  async create(requestData) {
    try {
      logger.debug('TrainingRequestRepository.create', { requestData });
      return await this.mockDataService.createTrainingRequest(requestData);
    } catch (error) {
      logger.error('TrainingRequestRepository.create error', { error: error.message, requestData });
      throw error;
    }
  }

  async approve(requestId, approverData) {
    try {
      logger.debug('TrainingRequestRepository.approve', { requestId, approverData });
      return await this.mockDataService.approveTrainingRequest(requestId, approverData);
    } catch (error) {
      logger.error('TrainingRequestRepository.approve error', { error: error.message, requestId, approverData });
      throw error;
    }
  }

  async reject(requestId, rejectionData) {
    try {
      logger.debug('TrainingRequestRepository.reject', { requestId, rejectionData });
      return await this.mockDataService.rejectTrainingRequest(requestId, rejectionData);
    } catch (error) {
      logger.error('TrainingRequestRepository.reject error', { error: error.message, requestId, rejectionData });
      throw error;
    }
  }

  async assignTrainer(requestId, trainerData) {
    try {
      logger.debug('TrainingRequestRepository.assignTrainer', { requestId, trainerData });
      return await this.mockDataService.assignTrainer(requestId, trainerData);
    } catch (error) {
      logger.error('TrainingRequestRepository.assignTrainer error', { error: error.message, requestId, trainerData });
      throw error;
    }
  }

  async updateStatus(requestId, status, additionalData = {}) {
    try {
      logger.debug('TrainingRequestRepository.updateStatus', { requestId, status, additionalData });
      return await this.mockDataService.updateTrainingRequestStatus(requestId, status, additionalData);
    } catch (error) {
      logger.error('TrainingRequestRepository.updateStatus error', { error: error.message, requestId, status, additionalData });
      throw error;
    }
  }

  async getHistory(requestId) {
    try {
      logger.debug('TrainingRequestRepository.getHistory', { requestId });
      return await this.mockDataService.getTrainingRequestHistory(requestId);
    } catch (error) {
      logger.error('TrainingRequestRepository.getHistory error', { error: error.message, requestId });
      throw error;
    }
  }

  async getStatistics(filters = {}) {
    try {
      logger.debug('TrainingRequestRepository.getStatistics', { filters });
      return await this.mockDataService.getTrainingRequestStatistics(filters);
    } catch (error) {
      logger.error('TrainingRequestRepository.getStatistics error', { error: error.message, filters });
      throw error;
    }
  }
}
