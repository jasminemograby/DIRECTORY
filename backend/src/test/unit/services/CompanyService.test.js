import { jest } from '@jest/globals';
import { CompanyService } from '../../../application/services/CompanyService.js';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';

// Mock dependencies
jest.mock('../../../infrastructure/mock/MockDataService.js');

describe('CompanyService', () => {
  let companyService;
  let mockDataService;

  beforeEach(() => {
    mockDataService = new MockDataService();
    companyService = new CompanyService(mockDataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCompanies', () => {
    it('should return all companies from mock data', async () => {
      const mockCompanies = [
        { id: 'comp_001', name: 'TechCorp Solutions' },
        { id: 'comp_002', name: 'Global Finance Inc' }
      ];

      mockDataService.getCompanies.mockResolvedValue(mockCompanies);

      const result = await companyService.getAllCompanies();

      expect(result).toEqual({
        success: true,
        data: mockCompanies,
        error: null,
        source: 'mock'
      });
      expect(mockDataService.getCompanies).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockDataService.getCompanies.mockRejectedValue(error);

      const result = await companyService.getAllCompanies();

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Database connection failed',
        source: 'mock'
      });
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by ID', async () => {
      const mockCompany = { id: 'comp_001', name: 'TechCorp Solutions' };
      mockDataService.getCompanyById.mockResolvedValue(mockCompany);

      const result = await companyService.getCompanyById('comp_001');

      expect(result).toEqual({
        success: true,
        data: mockCompany,
        error: null,
        source: 'mock'
      });
      expect(mockDataService.getCompanyById).toHaveBeenCalledWith('comp_001');
    });

    it('should return error for non-existent company', async () => {
      mockDataService.getCompanyById.mockResolvedValue(null);

      const result = await companyService.getCompanyById('non-existent');

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });

  describe('createCompany', () => {
    it('should create a new company', async () => {
      const companyData = {
        name: 'New Company',
        domain: 'newcompany.com',
        industry: 'Technology'
      };

      const createdCompany = { id: 'comp_003', ...companyData };
      mockDataService.createCompany.mockResolvedValue(createdCompany);

      const result = await companyService.createCompany(companyData);

      expect(result).toEqual({
        success: true,
        data: createdCompany,
        error: null,
        source: 'mock'
      });
      expect(mockDataService.createCompany).toHaveBeenCalledWith(companyData);
    });

    it('should validate required fields', async () => {
      const invalidData = { name: 'Test Company' }; // Missing domain

      const result = await companyService.createCompany(invalidData);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Validation error: domain is required',
        source: 'mock'
      });
    });
  });

  describe('updateCompany', () => {
    it('should update an existing company', async () => {
      const updateData = { name: 'Updated Company Name' };
      const updatedCompany = { id: 'comp_001', name: 'Updated Company Name' };

      mockDataService.updateCompany.mockResolvedValue(updatedCompany);

      const result = await companyService.updateCompany('comp_001', updateData);

      expect(result).toEqual({
        success: true,
        data: updatedCompany,
        error: null,
        source: 'mock'
      });
      expect(mockDataService.updateCompany).toHaveBeenCalledWith('comp_001', updateData);
    });

    it('should return error for non-existent company', async () => {
      mockDataService.updateCompany.mockResolvedValue(null);

      const result = await companyService.updateCompany('non-existent', { name: 'Test' });

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company', async () => {
      mockDataService.deleteCompany.mockResolvedValue(true);

      const result = await companyService.deleteCompany('comp_001');

      expect(result).toEqual({
        success: true,
        data: { message: 'Company deleted successfully' },
        error: null,
        source: 'mock'
      });
      expect(mockDataService.deleteCompany).toHaveBeenCalledWith('comp_001');
    });

    it('should return error for non-existent company', async () => {
      mockDataService.deleteCompany.mockResolvedValue(false);

      const result = await companyService.deleteCompany('non-existent');

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });
});
