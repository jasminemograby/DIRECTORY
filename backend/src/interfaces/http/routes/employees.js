import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController.js';
import { EmployeeService } from '../../../application/services/EmployeeService.js';
import { EmployeeRepository } from '../../../infrastructure/database/repositories/EmployeeRepository.js';
import { validateRequest } from '../middleware/validation.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { skillsSchema } from '../schemas/employeeSchema.js';

const router = express.Router();

// Initialize services with rollback-to-mock capability
const employeeRepository = new EmployeeRepository();
const mockEnrichmentAPI = { enrich: () => ({}) };
const mockSkillsAPI = { getSkills: () => ({}) };
const employeeService = new EmployeeService(employeeRepository, mockEnrichmentAPI, mockSkillsAPI);
const employeeController = new EmployeeController(employeeService);

// Apply authentication to all routes
router.use(authenticateToken);

// Employee routes
router.get('/', 
  authorize(['hr_admin', 'manager', 'team_lead']),
  employeeController.getEmployees
);

router.get('/:id', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  employeeController.getEmployeeProfile
);

router.post('/:id/enrich', 
  authorize(['hr_admin', 'manager']),
  employeeController.enrichEmployeeProfile
);

router.patch('/:id/skills', 
  authorize(['hr_admin', 'manager']),
  validateRequest(skillsSchema),
  employeeController.updateEmployeeSkills
);

router.get('/:id/skill-gap', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  employeeController.getSkillGap
);

router.get('/:id/relevance', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  employeeController.getRelevanceScore
);

router.get('/:id/skills/competences', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  employeeController.getEmployeeCompetences
);

export default router;
