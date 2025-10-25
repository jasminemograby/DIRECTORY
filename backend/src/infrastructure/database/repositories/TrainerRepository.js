import { logger } from '../../../config/logging.js';
import { MockDataService } from '../../mock/MockDataService.js';

export class TrainerRepository {
  constructor() {
    this.mockDataService = new MockDataService();
  }

  async findById(trainerId) {
    try {
      logger.debug('TrainerRepository.findById', { trainerId });
      return await this.mockDataService.getTrainer(trainerId);
    } catch (error) {
      logger.error('TrainerRepository.findById error', { error: error.message, trainerId });
      throw error;
    }
  }

  async findAll(filters = {}) {
    try {
      logger.debug('TrainerRepository.findAll', { filters });
      return await this.mockDataService.getTrainers(filters);
    } catch (error) {
      logger.error('TrainerRepository.findAll error', { error: error.message, filters });
      throw error;
    }
  }

  async search(searchParams) {
    try {
      logger.debug('TrainerRepository.search', { searchParams });
      return await this.mockDataService.searchTrainers(searchParams);
    } catch (error) {
      logger.error('TrainerRepository.search error', { error: error.message, searchParams });
      throw error;
    }
  }

  async getAvailability(trainerId) {
    try {
      logger.debug('TrainerRepository.getAvailability', { trainerId });
      return await this.mockDataService.getTrainerAvailability(trainerId);
    } catch (error) {
      logger.error('TrainerRepository.getAvailability error', { error: error.message, trainerId });
      throw error;
    }
  }

  async create(trainerData) {
    try {
      logger.debug('TrainerRepository.create', { trainerData });
      return await this.mockDataService.createTrainer(trainerData);
    } catch (error) {
      logger.error('TrainerRepository.create error', { error: error.message, trainerData });
      throw error;
    }
  }

  async update(trainerId, updateData) {
    try {
      logger.debug('TrainerRepository.update', { trainerId, updateData });
      return await this.mockDataService.updateTrainer(trainerId, updateData);
    } catch (error) {
      logger.error('TrainerRepository.update error', { error: error.message, trainerId, updateData });
      throw error;
    }
  }

  async delete(trainerId) {
    try {
      logger.debug('TrainerRepository.delete', { trainerId });
      return await this.mockDataService.deleteTrainer(trainerId);
    } catch (error) {
      logger.error('TrainerRepository.delete error', { error: error.message, trainerId });
      throw error;
    }
  }

  async updateCertifications(trainerId, certifications) {
    try {
      logger.debug('TrainerRepository.updateCertifications', { trainerId, certifications });
      return await this.mockDataService.updateTrainerCertifications(trainerId, certifications);
    } catch (error) {
      logger.error('TrainerRepository.updateCertifications error', { error: error.message, trainerId, certifications });
      throw error;
    }
  }

  async updateAvailability(trainerId, availability) {
    try {
      logger.debug('TrainerRepository.updateAvailability', { trainerId, availability });
      return await this.mockDataService.updateTrainerAvailability(trainerId, availability);
    } catch (error) {
      logger.error('TrainerRepository.updateAvailability error', { error: error.message, trainerId, availability });
      throw error;
    }
  }
}
