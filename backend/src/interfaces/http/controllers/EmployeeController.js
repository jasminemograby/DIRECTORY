import { BaseController } from './BaseController.js';
// eslint-disable-next-line no-unused-vars
import { EmployeeService } from '../../../application/services/EmployeeService.js';

export class EmployeeController extends BaseController {
  constructor(employeeService) {
    super();
    this.employeeService = employeeService;
  }

  async getEmployees(req, res) {
    return this.handleAsync(async (req, res) => {
      const { 
        search, 
        departmentId, 
        teamId, 
        role, 
        level, 
        page = 1, 
        limit = 20 
      } = req.query;
      
      const filters = {
        search,
        departmentId,
        teamId,
        role,
        level,
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      };

      const result = await this.employeeService.getEmployees(filters);
      
      const response = this.successResponse(
        result.employees,
        result.source,
        'Employees retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getEmployeeProfile(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.employeeService.getEmployeeProfile(id);
      
      const response = this.successResponse(
        result.employee,
        result.source,
        'Employee profile retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async enrichEmployeeProfile(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const { sources = ['linkedin', 'github', 'credly', 'gemini'] } = req.body;
      
      const result = await this.employeeService.enrichEmployeeProfile(id, sources);
      
      const response = this.successResponse(
        {
          id: result.employee.id,
          enrichmentStatus: 'completed',
          valueProposition: result.enrichmentData.valueProposition,
          normalizedSkills: result.normalizedSkills,
          relevanceScore: result.employee.relevanceScore,
          enrichmentData: {
            sources: result.enrichmentData.sources,
            skillsFound: result.normalizedSkills.length,
            lastEnriched: new Date().toISOString()
          }
        },
        result.source,
        'Employee profile enriched successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async updateEmployeeSkills(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const skillsData = req.body;
      
      const result = await this.employeeService.updateEmployeeSkills(id, skillsData);
      
      const response = this.successResponse(
        result.employee,
        result.source,
        'Employee skills updated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getSkillGap(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      const { careerGoal } = req.query;
      
      const result = await this.employeeService.getSkillGap(id, careerGoal);
      
      const response = this.successResponse(
        result.skillGap,
        result.source,
        'Skill gap analysis completed successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getRelevanceScore(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.employeeService.getRelevanceScore(id);
      
      const response = this.successResponse(
        {
          employeeId: id,
          relevanceScore: result.relevanceScore,
          scoreBreakdown: result.scoreBreakdown,
          factors: result.factors,
          lastCalculated: new Date().toISOString()
        },
        result.source,
        'Relevance score calculated successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }

  async getEmployeeCompetences(req, res) {
    return this.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const result = await this.employeeService.getEmployeeCompetences(id);
      
      const response = this.successResponse(
        result.competences,
        result.source,
        'Employee competences retrieved successfully'
      );
      
      return res.status(200).json(response);
    }, req, res);
  }
}
