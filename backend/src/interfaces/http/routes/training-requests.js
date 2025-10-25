import express from 'express';
import { TrainingRequestController } from '../controllers/TrainingRequestController.js';
import { TrainingRequestService } from '../../../application/services/TrainingRequestService.js';
import { TrainingRequestRepository } from '../../../infrastructure/database/repositories/TrainingRequestRepository.js';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';
import { validateRequest } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import { trainingRequestSchema, approvalSchema, rejectionSchema, assignmentSchema } from '../schemas/trainingRequestSchema.js';

const router = express.Router();

// Initialize services with rollback-to-mock capability
const trainingRequestRepository = new TrainingRequestRepository();
const mockDataService = new MockDataService();
const trainingRequestService = new TrainingRequestService(trainingRequestRepository, mockDataService);
const trainingRequestController = new TrainingRequestController(trainingRequestService);

// Apply authentication to all routes
router.use(authenticateToken);

// Training request routes
router.get('/', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainingRequestController.getTrainingRequests
);

router.get('/search', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainingRequestController.searchTrainingRequests
);

router.get('/statistics', 
  authorize(['hr_admin', 'manager']),
  trainingRequestController.getTrainingRequestStatistics
);

router.get('/:id', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainingRequestController.getTrainingRequest
);

router.get('/:id/history', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainingRequestController.getTrainingRequestHistory
);

router.post('/', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  validateRequest(trainingRequestSchema),
  trainingRequestController.createTrainingRequest
);

router.post('/:id/approve', 
  authorize(['hr_admin', 'manager']),
  validateRequest(approvalSchema),
  trainingRequestController.approveTrainingRequest
);

router.post('/:id/reject', 
  authorize(['hr_admin', 'manager']),
  validateRequest(rejectionSchema),
  trainingRequestController.rejectTrainingRequest
);

router.post('/:id/assign-trainer', 
  authorize(['hr_admin', 'manager']),
  validateRequest(assignmentSchema),
  trainingRequestController.assignTrainer
);

router.patch('/:id/status', 
  authorize(['hr_admin', 'manager']),
  trainingRequestController.updateTrainingRequestStatus
);

export default router;
