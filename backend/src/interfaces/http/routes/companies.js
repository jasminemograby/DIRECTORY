import express from 'express';
import { CompanyController } from '../controllers/CompanyController.js';
import { CompanyService } from '../../../application/services/CompanyService.js';
import { CompanyRepository } from '../../../infrastructure/database/repositories/CompanyRepository.js';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';
import { validateRequest } from '../middleware/validation.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { companySchema } from '../schemas/companySchema.js';

const router = express.Router();

// Initialize services with rollback-to-mock capability
const companyRepository = new CompanyRepository();
const mockDataService = new MockDataService();
const companyService = new CompanyService(companyRepository, mockDataService);
const companyController = new CompanyController(companyService);

// Apply authentication to all routes
router.use(authenticateToken);

// Company routes
router.get('/', 
  authorize(['hr_admin', 'manager']),
  companyController.getCompanies
);

router.get('/:id', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  companyController.getCompany
);

router.post('/', 
  authorize(['hr_admin']),
  validateRequest(companySchema),
  companyController.createCompany
);

router.put('/:id', 
  authorize(['hr_admin']),
  validateRequest(companySchema),
  companyController.updateCompany
);

router.delete('/:id', 
  authorize(['hr_admin']),
  companyController.deleteCompany
);

router.get('/:id/hierarchy', 
  authorize(['hr_admin', 'manager', 'team_lead', 'employee']),
  companyController.getCompanyHierarchy
);

export default router;
