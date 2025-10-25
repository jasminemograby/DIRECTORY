import { Trainer } from '../../domain/entities/Trainer.js';
import { logger } from '../../config/logging.js';
import { config } from '../../config/environment.js';

export class TrainerService {
  constructor(trainerRepository, mockDataService) {
    this.trainerRepository = trainerRepository;
    this.mockDataService = mockDataService;
    this.mockMode = config.MOCK_MODE;
  }

  async getTrainers(filters = {}) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const trainers = await this.trainerRepository.findByCompanyId(filters.companyId, filters);
          logger.debug('Trainers retrieved from database', { count: trainers.length });
          return { trainers, source: 'live' };
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainers = await this.mockDataService.getTrainers(filters);
      logger.debug('Trainers retrieved from mock data', { count: mockTrainers.length });
      return { trainers: mockTrainers, source: 'mock' };

    } catch (error) {
      logger.error('Trainers retrieval failed', { error: error.message, filters });
      throw error;
    }
  }

  async getTrainer(trainerId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const trainer = await this.trainerRepository.findById(trainerId);
          if (trainer) {
            logger.debug('Trainer retrieved from database', { trainerId });
            return { trainer, source: 'live' };
          }
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainer = await this.mockDataService.getTrainer(trainerId);
      if (!mockTrainer) {
        throw new Error('Trainer not found');
      }
      
      logger.debug('Trainer retrieved from mock data', { trainerId });
      return { trainer: mockTrainer, source: 'mock' };

    } catch (error) {
      logger.error('Trainer retrieval failed', { error: error.message, trainerId });
      throw error;
    }
  }

  async searchTrainers(searchParams) {
    try {
      const { skills, teachingMode, trainerType, companyId } = searchParams;
      
      // Try database first
      if (!this.mockMode) {
        try {
          const trainers = await this.trainerRepository.searchBySkills(companyId, skills, searchParams);
          logger.debug('Trainers searched from database', { count: trainers.length, skills });
          return { trainers, source: 'live' };
        } catch (error) {
          logger.warn('Database search failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainers = await this.mockDataService.searchTrainers(searchParams);
      logger.debug('Trainers searched from mock data', { count: mockTrainers.length, skills });
      return { trainers: mockTrainers, source: 'mock' };

    } catch (error) {
      logger.error('Trainer search failed', { error: error.message, searchParams });
      throw error;
    }
  }

  async getTrainerAvailability(trainerId) {
    try {
      // Get trainer first
      const trainerResult = await this.getTrainer(trainerId);
      const trainer = trainerResult.trainer;

      // Try real availability check first
      if (!this.mockMode) {
        try {
          const availability = await this.checkRealAvailability(trainer);
          logger.debug('Trainer availability checked from real service', { trainerId });
          return { availability, source: 'live' };
        } catch (error) {
          logger.warn('Real availability check failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockAvailability = await this.mockDataService.getTrainerAvailability(trainerId);
      logger.debug('Trainer availability checked from mock data', { trainerId });
      return { availability: mockAvailability, source: 'mock' };

    } catch (error) {
      logger.error('Trainer availability check failed', { error: error.message, trainerId });
      throw error;
    }
  }

  async createTrainer(trainerData) {
    try {
      // Validate trainer data
      const trainer = new Trainer(trainerData);
      const validationErrors = trainer.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Try to create in database first
      if (!this.mockMode) {
        try {
          const createdTrainer = await this.trainerRepository.create(trainer);
          logger.info('Trainer created successfully', { trainerId: createdTrainer.id });
          return { trainer: createdTrainer, source: 'live' };
        } catch (error) {
          logger.warn('Database creation failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainer = await this.mockDataService.createTrainer(trainerData);
      logger.info('Trainer created using mock data', { trainerId: mockTrainer.id });
      return { trainer: mockTrainer, source: 'mock' };

    } catch (error) {
      logger.error('Trainer creation failed', { error: error.message, trainerData });
      throw error;
    }
  }

  async updateTrainer(trainerId, updateData) {
    try {
      // Validate update data
      const trainer = new Trainer({ id: trainerId, ...updateData });
      const validationErrors = trainer.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedTrainer = await this.trainerRepository.update(trainerId, updateData);
          logger.info('Trainer updated in database', { trainerId });
          return { trainer: updatedTrainer, source: 'live' };
        } catch (error) {
          logger.warn('Database update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainer = await this.mockDataService.updateTrainer(trainerId, updateData);
      logger.info('Trainer updated using mock data', { trainerId });
      return { trainer: mockTrainer, source: 'mock' };

    } catch (error) {
      logger.error('Trainer update failed', { error: error.message, trainerId, updateData });
      throw error;
    }
  }

  async deleteTrainer(trainerId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          await this.trainerRepository.softDelete(trainerId);
          logger.info('Trainer deleted from database', { trainerId });
          return { success: true, source: 'live' };
        } catch (error) {
          logger.warn('Database deletion failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      await this.mockDataService.deleteTrainer(trainerId);
      logger.info('Trainer deleted using mock data', { trainerId });
      return { success: true, source: 'mock' };

    } catch (error) {
      logger.error('Trainer deletion failed', { error: error.message, trainerId });
      throw error;
    }
  }

  async updateTrainerCertifications(trainerId, certifications) {
    try {
      // Validate certifications
      const trainer = new Trainer({ id: trainerId, certifications });
      const validationErrors = trainer.validateCertifications();
      
      if (validationErrors.length > 0) {
        throw new Error(`Certification validation failed: ${validationErrors.join(', ')}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedTrainer = await this.trainerRepository.updateCertifications(trainerId, certifications);
          logger.info('Trainer certifications updated in database', { trainerId });
          return { trainer: updatedTrainer, source: 'live' };
        } catch (error) {
          logger.warn('Database certification update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainer = await this.mockDataService.updateTrainerCertifications(trainerId, certifications);
      logger.info('Trainer certifications updated using mock data', { trainerId });
      return { trainer: mockTrainer, source: 'mock' };

    } catch (error) {
      logger.error('Trainer certification update failed', { error: error.message, trainerId, certifications });
      throw error;
    }
  }

  async updateTrainerAvailability(trainerId, availability) {
    try {
      // Validate availability
      const trainer = new Trainer({ id: trainerId, availability });
      const validationErrors = trainer.validateAvailability();
      
      if (validationErrors.length > 0) {
        throw new Error(`Availability validation failed: ${validationErrors.join(', ')}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedTrainer = await this.trainerRepository.updateAvailability(trainerId, availability);
          logger.info('Trainer availability updated in database', { trainerId });
          return { trainer: updatedTrainer, source: 'live' };
        } catch (error) {
          logger.warn('Database availability update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockTrainer = await this.mockDataService.updateTrainerAvailability(trainerId, availability);
      logger.info('Trainer availability updated using mock data', { trainerId });
      return { trainer: mockTrainer, source: 'mock' };

    } catch (error) {
      logger.error('Trainer availability update failed', { error: error.message, trainerId, availability });
      throw error;
    }
  }

  async getTrainerCourseHistory(trainerId) {
    try {
      // Get trainer first
      const trainerResult = await this.getTrainer(trainerId);
      const trainer = trainerResult.trainer;

      logger.debug('Trainer course history retrieved', { trainerId });
      return { 
        courseHistory: trainer.courseHistory,
        totalStudentsTaught: trainer.totalStudentsTaught,
        averageRating: trainer.averageRating,
        source: trainerResult.source
      };

    } catch (error) {
      logger.error('Trainer course history retrieval failed', { error: error.message, trainerId });
      throw error;
    }
  }

  // Helper methods for real service calls
  async checkRealAvailability(trainer) {
    try {
      // Call internal calendar service to check real availability
      // Mock implementation - replace with real calendar service call
      return {
        timezone: trainer.availability.timezone,
        schedule: trainer.availability.schedule,
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isAvailable: true,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.warn('Real availability check failed', { error: error.message });
      throw error;
    }
  }
}
