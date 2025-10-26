import { BaseController } from './BaseController.js';
// eslint-disable-next-line no-unused-vars
import { TrainerService } from '../../../application/services/TrainerService.js';

export class TrainerController extends BaseController {
  constructor(trainerService) {
    super();
    this.trainerService = trainerService;
  }

  async getTrainers(req, res) {
    return this.handleAsync(async (req, res) => {
      const { 
        companyId, 
        trainerType, 
        skills, 
        page = 1, 
        limit = 20 
      } = req.query;
      
      const filters = {
        companyId: companyId || req.companyId,
        trainerType,
        skills: skills ? skills.split(',') : undefined,
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      };

      const result = await this.trainerService.getTrainers(filters);
      
      const response = this.successResponse(
        result.trainers,
        result.source,
        'Trainers retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainer(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainerService.getTrainer(id);
      
      const response = this.successResponse(
        result.trainer,
        result.source,
        'Trainer retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async searchTrainers(req, res) {
    return this.handleAsync(async (req, res) => {
      const { 
        skills, 
        teachingMode, 
        trainerType, 
        companyId 
      } = req.query;
      
      const searchParams = {
        skills: skills ? skills.split(',') : undefined,
        teachingMode: teachingMode ? teachingMode.split(',') : undefined,
        trainerType,
        companyId: companyId || req.companyId
      };

      const result = await this.trainerService.searchTrainers(searchParams);
      
      const response = this.successResponse(
        result.trainers,
        result.source,
        'Trainer search completed successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainerAvailability(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainerService.getTrainerAvailability(id);
      
      const response = this.successResponse(
        result.availability,
        result.source,
        'Trainer availability retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async createTrainer(req, res) {
    return this.handleAsync(async (req, res) => {
      const trainerData = req.body;
      
      // Add company ID from request context
      trainerData.companyId = req.companyId;
      
      const result = await this.trainerService.createTrainer(trainerData);
      
      const response = this.successResponse(
        result.trainer,
        result.source,
        'Trainer created successfully'
      );
      
      return res.status(201).json(response);
    }, req, res);
  }

  async updateTrainer(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await this.trainerService.updateTrainer(id, updateData);
      
      const response = this.successResponse(
        result.trainer,
        result.source,
        'Trainer updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async deleteTrainer(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainerService.deleteTrainer(id);
      
      const response = this.successResponse(
        { success: result.success },
        result.source,
        'Trainer deleted successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async updateTrainerCertifications(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const { certifications } = req.body;
      
      const result = await this.trainerService.updateTrainerCertifications(id, certifications);
      
      const response = this.successResponse(
        result.trainer,
        result.source,
        'Trainer certifications updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async updateTrainerAvailability(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const { availability } = req.body;
      
      const result = await this.trainerService.updateTrainerAvailability(id, availability);
      
      const response = this.successResponse(
        result.trainer,
        result.source,
        'Trainer availability updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getTrainerCourseHistory(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.trainerService.getTrainerCourseHistory(id);
      
      const response = this.successResponse(
        {
          courseHistory: result.courseHistory,
          totalStudentsTaught: result.totalStudentsTaught,
          averageRating: result.averageRating,
          lastUpdated: new Date().toISOString()
        },
        result.source,
        'Trainer course history retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }
}
