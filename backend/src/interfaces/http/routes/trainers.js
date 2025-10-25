import express from 'express';
import { TrainerController } from '../controllers/TrainerController.js';
import { TrainerService } from '../../../application/services/TrainerService.js';
import { TrainerRepository } from '../../../infrastructure/database/repositories/TrainerRepository.js';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';
import { validateRequest } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import { trainerSchema, certificationsSchema, availabilitySchema } from '../schemas/trainerSchema.js';

const router = express.Router();

// Initialize services with rollback-to-mock capability
const trainerRepository = new TrainerRepository();
const mockDataService = new MockDataService();
const trainerService = new TrainerService(trainerRepository, mockDataService);
const trainerController = new TrainerController(trainerService);

// Apply authentication to all routes
router.use(authenticateToken);

// Trainer routes
router.get('/', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainerController.getTrainers
);

router.get('/search', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainerController.searchTrainers
);

router.get('/:id', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainerController.getTrainer
);

router.get('/:id/availability', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainerController.getTrainerAvailability
);

router.get('/:id/course-history', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  trainerController.getTrainerCourseHistory
);

router.post('/', 
  authorize(['hr_admin', 'manager']),
  validateRequest(trainerSchema),
  trainerController.createTrainer
);

router.put('/:id', 
  authorize(['hr_admin', 'manager']),
  validateRequest(trainerSchema),
  trainerController.updateTrainer
);

router.delete('/:id', 
  authorize(['hr_admin']),
  trainerController.deleteTrainer
);

router.patch('/:id/certifications', 
  authorize(['hr_admin', 'manager']),
  validateRequest(certificationsSchema),
  trainerController.updateTrainerCertifications
);

router.patch('/:id/availability', 
  authorize(['hr_admin', 'manager']),
  validateRequest(availabilitySchema),
  trainerController.updateTrainerAvailability
);

export default router;
