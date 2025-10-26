import { BaseController } from './BaseController.js';
// eslint-disable-next-line no-unused-vars
import { TrainingRequestService } from '../../../application/services/TrainingRequestService.js';

export class TrainingRequestController extends BaseController {
  constructor(trainingRequestService) {
    super();
    this.trainingRequestService = trainingRequestService;
  }

  async getTrainingRequests(req, res) {
    return this.handleAsync(async (req, res) => {
      const { 
        companyId, 
        status, 
        requesterId, 
        page = 1, 
        limit = 20 
      } = req.query;
      
      const filters = {
        companyId: companyId || req.companyId,
        status,
        requesterId,
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      };

      const result = await this.trainingRequestService.getTrainingRequests(filters);
      
      const response = this.successResponse(
        result.requests,
        result.source,
        'Training requests retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainingRequest(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainingRequestService.getTrainingRequest(id);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Training request retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async createTrainingRequest(req, res) {
    return this.handleAsync(async (req, res) => {
      const requestData = req.body;
      
      // Add company ID from request context
      requestData.companyId = req.companyId;
      requestData.requesterId = req.user.id;
      
      const result = await this.trainingRequestService.createTrainingRequest(requestData);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Training request created successfully'
      );
      
      return res.status(201).json(response);
    }, req, res);
  }

  async approveTrainingRequest(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const approverData = {
        approverId: req.user.id,
        comments: req.body.comments
      };
      
      const result = await this.trainingRequestService.approveTrainingRequest(id, approverData);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Training request approved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async rejectTrainingRequest(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const rejectionData = {
        approverId: req.user.id,
        reason: req.body.reason
      };
      
      const result = await this.trainingRequestService.rejectTrainingRequest(id, rejectionData);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Training request rejected successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async assignTrainer(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const trainerData = req.body;
      
      const result = await this.trainingRequestService.assignTrainer(id, trainerData);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Trainer assigned successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async updateTrainingRequestStatus(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;
      
      const additionalData = {
        approverId: req.user.id,
        rejectionReason
      };
      
      const result = await this.trainingRequestService.updateTrainingRequestStatus(id, status, additionalData);
      
      const response = this.successResponse(
        result.request,
        result.source,
        'Training request status updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainingRequestHistory(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainingRequestService.getTrainingRequestHistory(id);
      
      const response = this.successResponse(
        result.history,
        result.source,
        'Training request history retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainingRequestStatistics(req, res) {
    return this.handleAsync(async (req, res) => {
      const { companyId, startDate, endDate } = req.query;
      
      const filters = {
        companyId: companyId || req.companyId,
        startDate,
        endDate
      };

      const result = await this.trainingRequestService.getTrainingRequestStatistics(filters);
      
      const response = this.successResponse(
        result.statistics,
        result.source,
        'Training request statistics retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async searchTrainingRequests(req, res) {
    return this.handleAsync(async (req, res) => {
      const { 
        status, 
        type, 
        skillCategories, 
        requesterId, 
        companyId 
      } = req.query;
      
      const searchParams = {
        status,
        type,
        skillCategories: skillCategories ? skillCategories.split(',') : undefined,
        requesterId,
        companyId: companyId || req.companyId
      };

      const result = await this.trainingRequestService.searchTrainingRequests(searchParams);
      
      const response = this.successResponse(
        result.requests,
        result.source,
        'Training request search completed successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }
}
