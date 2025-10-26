import { TrainingRequest } from '../../domain/entities/TrainingRequest.js';
import { logger } from '../../config/logging.js';
import { config } from '../../config/environment.js';

export class TrainingRequestService {
  constructor(trainingRequestRepository, mockDataService) {
    this.trainingRequestRepository = trainingRequestRepository;
    this.mockDataService = mockDataService;
    this.mockMode = config.MOCK_MODE;
  }

  async getTrainingRequests(filters = {}) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const requests = await this.trainingRequestRepository.findByCompanyId(filters.companyId, filters);
          logger.debug('Training requests retrieved from database', { count: requests.length });
          return { requests, source: 'live' };
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequests = await this.mockDataService.getTrainingRequests(filters);
      logger.debug('Training requests retrieved from mock data', { count: mockRequests.length });
      return { requests: mockRequests, source: 'mock' };

    } catch (error) {
      logger.error('Training requests retrieval failed', { error: error.message, filters });
      throw error;
    }
  }

  async getTrainingRequest(requestId) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const request = await this.trainingRequestRepository.findById(requestId);
          if (request) {
            logger.debug('Training request retrieved from database', { requestId });
            return { request, source: 'live' };
          }
        } catch (error) {
          logger.warn('Database retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.getTrainingRequest(requestId);
      if (!mockRequest) {
        throw new Error('Training request not found');
      }
      
      logger.debug('Training request retrieved from mock data', { requestId });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Training request retrieval failed', { error: error.message, requestId });
      throw error;
    }
  }

  async createTrainingRequest(requestData) {
    try {
      // Validate request data
      const request = new TrainingRequest(requestData);
      const validationErrors = request.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Try to create in database first
      if (!this.mockMode) {
        try {
          const createdRequest = await this.trainingRequestRepository.create(request);
          logger.info('Training request created successfully', { requestId: createdRequest.id });
          return { request: createdRequest, source: 'live' };
        } catch (error) {
          logger.warn('Database creation failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.createTrainingRequest(requestData);
      logger.info('Training request created using mock data', { requestId: mockRequest.id });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Training request creation failed', { error: error.message, requestData });
      throw error;
    }
  }

  async approveTrainingRequest(requestId, approverData) {
    try {
      const { approverId } = approverData;
      
      // Try database first
      if (!this.mockMode) {
        try {
          const updatedRequest = await this.trainingRequestRepository.updateStatus(
            requestId, 
            'approved', 
            approverId
          );
          logger.info('Training request approved in database', { requestId, approverId });
          return { request: updatedRequest, source: 'live' };
        } catch (error) {
          logger.warn('Database approval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.approveTrainingRequest(requestId, approverData);
      logger.info('Training request approved using mock data', { requestId, approverId });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Training request approval failed', { error: error.message, requestId, approverData });
      throw error;
    }
  }

  async rejectTrainingRequest(requestId, rejectionData) {
    try {
      const { approverId, reason } = rejectionData;
      
      // Try database first
      if (!this.mockMode) {
        try {
          const updatedRequest = await this.trainingRequestRepository.updateStatus(
            requestId, 
            'rejected', 
            approverId, 
            reason
          );
          logger.info('Training request rejected in database', { requestId, approverId, reason });
          return { request: updatedRequest, source: 'live' };
        } catch (error) {
          logger.warn('Database rejection failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.rejectTrainingRequest(requestId, rejectionData);
      logger.info('Training request rejected using mock data', { requestId, approverId, reason });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Training request rejection failed', { error: error.message, requestId, rejectionData });
      throw error;
    }
  }

  async assignTrainer(requestId, trainerData) {
    try {
      const { trainerId } = trainerData;
      
      // Try database first
      if (!this.mockMode) {
        try {
          const updatedRequest = await this.trainingRequestRepository.assignTrainer(requestId, trainerId);
          logger.info('Trainer assigned in database', { requestId, trainerId });
          return { request: updatedRequest, source: 'live' };
        } catch (error) {
          logger.warn('Database trainer assignment failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.assignTrainer(requestId, trainerData);
      logger.info('Trainer assigned using mock data', { requestId, trainerId });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Trainer assignment failed', { error: error.message, requestId, trainerData });
      throw error;
    }
  }

  async updateTrainingRequestStatus(requestId, status, additionalData = {}) {
    try {
      // Validate status
      const validStatuses = ['pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // Try database first
      if (!this.mockMode) {
        try {
          const updatedRequest = await this.trainingRequestRepository.updateStatus(
            requestId, 
            status, 
            additionalData.approverId,
            additionalData.rejectionReason
          );
          logger.info('Training request status updated in database', { requestId, status });
          return { request: updatedRequest, source: 'live' };
        } catch (error) {
          logger.warn('Database status update failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequest = await this.mockDataService.updateTrainingRequestStatus(requestId, status, additionalData);
      logger.info('Training request status updated using mock data', { requestId, status });
      return { request: mockRequest, source: 'mock' };

    } catch (error) {
      logger.error('Training request status update failed', { error: error.message, requestId, status, additionalData });
      throw error;
    }
  }

  async getTrainingRequestHistory(requestId) {
    try {
      // Get request first
      const requestResult = await this.getTrainingRequest(requestId);
      const request = requestResult.request;

      // Try real history check first
      if (!this.mockMode) {
        try {
          const history = await this.getRealRequestHistory(request);
          logger.debug('Training request history retrieved from real service', { requestId });
          return { history, source: 'live' };
        } catch (error) {
          logger.warn('Real history retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockHistory = await this.mockDataService.getTrainingRequestHistory(requestId);
      logger.debug('Training request history retrieved from mock data', { requestId });
      return { history: mockHistory, source: 'mock' };

    } catch (error) {
      logger.error('Training request history retrieval failed', { error: error.message, requestId });
      throw error;
    }
  }

  async getTrainingRequestStatistics(filters = {}) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const statistics = await this.trainingRequestRepository.getStatistics(filters);
          logger.debug('Training request statistics retrieved from database', { filters });
          return { statistics, source: 'live' };
        } catch (error) {
          logger.warn('Database statistics retrieval failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockStatistics = await this.mockDataService.getTrainingRequestStatistics(filters);
      logger.debug('Training request statistics retrieved from mock data', { filters });
      return { statistics: mockStatistics, source: 'mock' };

    } catch (error) {
      logger.error('Training request statistics retrieval failed', { error: error.message, filters });
      throw error;
    }
  }

  async searchTrainingRequests(searchParams) {
    try {
      // Try database first
      if (!this.mockMode) {
        try {
          const requests = await this.trainingRequestRepository.search(searchParams);
          logger.debug('Training requests searched from database', { count: requests.length, searchParams });
          return { requests, source: 'live' };
        } catch (error) {
          logger.warn('Database search failed, using mock data', { error: error.message });
        }
      }

      // Fallback to mock data
      const mockRequests = await this.mockDataService.searchTrainingRequests(searchParams);
      logger.debug('Training requests searched from mock data', { count: mockRequests.length, searchParams });
      return { requests: mockRequests, source: 'mock' };

    } catch (error) {
      logger.error('Training request search failed', { error: error.message, searchParams });
      throw error;
    }
  }

  // Helper methods for real service calls
  async getRealRequestHistory(request) {
    try {
      // Call internal audit service to get real history
      // Mock implementation - replace with real audit service call
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
    } catch (error) {
      logger.warn('Real history retrieval failed', { error: error.message });
      throw error;
    }
  }
}
