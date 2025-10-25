import { BaseController } from './BaseController.js';
import { logger } from '../../../config/logging.js';

export class CompanyController extends BaseController {
  constructor(companyService) {
    super();
    this.companyService = companyService;
  }

  async getCompanies(req, res) {
    return this.handleAsync(async (req, res) => {
      const { search, industry, size, page = 1, limit = 20 } = req.query;
      
      const filters = {
        search,
        industry,
        size,
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      };

      const result = await this.companyService.getCompanies(filters);
      
      const response = this.successResponse(
        result.companies,
        result.source,
        'Companies retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getCompany(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.companyService.getCompany(id);
      
      const response = this.successResponse(
        result.company,
        result.source,
        'Company retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async createCompany(req, res) {
    return this.handleAsync(async (req, res) => {
      const companyData = req.body;
      
      // Add company ID from request context
      companyData.companyId = req.companyId;
      
      const result = await this.companyService.createCompany(companyData);
      
      const response = this.successResponse(
        result.company,
        result.source,
        'Company created successfully'
      );
      
      return res.status(201).json(response);
    }, req, res);
  }

  async updateCompany(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await this.companyService.updateCompany(id, updateData);
      
      const response = this.successResponse(
        result.company,
        result.source,
        'Company updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async deleteCompany(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.companyService.deleteCompany(id);
      
      const response = this.successResponse(
        { success: result.success },
        result.source,
        'Company deleted successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getCompanyHierarchy(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.companyService.getCompanyHierarchy(id);
      
      const response = this.successResponse(
        result.hierarchy,
        result.source,
        'Company hierarchy retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }
}
