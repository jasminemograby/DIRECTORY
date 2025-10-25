import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { CompanyController } from '../../../interfaces/http/controllers/CompanyController.js';
import { CompanyService } from '../../../application/services/CompanyService.js';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';

// Mock dependencies
jest.mock('../../../infrastructure/mock/MockDataService.js');
jest.mock('../../../application/services/CompanyService.js');

describe('CompanyController Integration Tests', () => {
  let app;
  let mockDataService;
  let companyService;
  let companyController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockDataService = new MockDataService();
    companyService = new CompanyService(mockDataService);
    companyController = new CompanyController(companyService);

    // Setup routes
    app.get('/api/v1/companies', (req, res) => companyController.getAllCompanies(req, res));
    app.get('/api/v1/companies/:id', (req, res) => companyController.getCompanyById(req, res));
    app.post('/api/v1/companies', (req, res) => companyController.createCompany(req, res));
    app.put('/api/v1/companies/:id', (req, res) => companyController.updateCompany(req, res));
    app.delete('/api/v1/companies/:id', (req, res) => companyController.deleteCompany(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/companies', () => {
    it('should return all companies', async () => {
      const mockCompanies = [
        { id: 'comp_001', name: 'TechCorp Solutions' },
        { id: 'comp_002', name: 'Global Finance Inc' }
      ];

      companyService.getAllCompanies = jest.fn().mockResolvedValue({
        success: true,
        data: mockCompanies,
        error: null,
        source: 'mock'
      });

      const response = await request(app)
        .get('/api/v1/companies')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCompanies,
        error: null,
        source: 'mock'
      });
    });

    it('should handle service errors', async () => {
      companyService.getAllCompanies = jest.fn().mockResolvedValue({
        success: false,
        data: null,
        error: 'Database connection failed',
        source: 'mock'
      });

      const response = await request(app)
        .get('/api/v1/companies')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: 'Database connection failed',
        source: 'mock'
      });
    });
  });

  describe('GET /api/v1/companies/:id', () => {
    it('should return a specific company', async () => {
      const mockCompany = { id: 'comp_001', name: 'TechCorp Solutions' };

      companyService.getCompanyById = jest.fn().mockResolvedValue({
        success: true,
        data: mockCompany,
        error: null,
        source: 'mock'
      });

      const response = await request(app)
        .get('/api/v1/companies/comp_001')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCompany,
        error: null,
        source: 'mock'
      });
    });

    it('should return 404 for non-existent company', async () => {
      companyService.getCompanyById = jest.fn().mockResolvedValue({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });

      const response = await request(app)
        .get('/api/v1/companies/non-existent')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });

  describe('POST /api/v1/companies', () => {
    it('should create a new company', async () => {
      const companyData = {
        name: 'New Company',
        domain: 'newcompany.com',
        industry: 'Technology'
      };

      const createdCompany = { id: 'comp_003', ...companyData };

      companyService.createCompany = jest.fn().mockResolvedValue({
        success: true,
        data: createdCompany,
        error: null,
        source: 'mock'
      });

      const response = await request(app)
        .post('/api/v1/companies')
        .send(companyData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: createdCompany,
        error: null,
        source: 'mock'
      });
    });

    it('should validate request body', async () => {
      const invalidData = { name: 'Test Company' }; // Missing domain

      companyService.createCompany = jest.fn().mockResolvedValue({
        success: false,
        data: null,
        error: 'Validation error: domain is required',
        source: 'mock'
      });

      const response = await request(app)
        .post('/api/v1/companies')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: 'Validation error: domain is required',
        source: 'mock'
      });
    });
  });

  describe('PUT /api/v1/companies/:id', () => {
    it('should update an existing company', async () => {
      const updateData = { name: 'Updated Company Name' };
      const updatedCompany = { id: 'comp_001', name: 'Updated Company Name' };

      companyService.updateCompany = jest.fn().mockResolvedValue({
        success: true,
        data: updatedCompany,
        error: null,
        source: 'mock'
      });

      const response = await request(app)
        .put('/api/v1/companies/comp_001')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: updatedCompany,
        error: null,
        source: 'mock'
      });
    });

    it('should return 404 for non-existent company', async () => {
      companyService.updateCompany = jest.fn().mockResolvedValue({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });

      const response = await request(app)
        .put('/api/v1/companies/non-existent')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });

  describe('DELETE /api/v1/companies/:id', () => {
    it('should delete a company', async () => {
      companyService.deleteCompany = jest.fn().mockResolvedValue({
        success: true,
        data: { message: 'Company deleted successfully' },
        error: null,
        source: 'mock'
      });

      const response = await request(app)
        .delete('/api/v1/companies/comp_001')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: { message: 'Company deleted successfully' },
        error: null,
        source: 'mock'
      });
    });

    it('should return 404 for non-existent company', async () => {
      companyService.deleteCompany = jest.fn().mockResolvedValue({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });

      const response = await request(app)
        .delete('/api/v1/companies/non-existent')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: 'Company not found',
        source: 'mock'
      });
    });
  });
});
