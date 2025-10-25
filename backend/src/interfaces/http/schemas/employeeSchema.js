import Joi from 'joi';

export const employeeSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  jobTitle: Joi.string().max(100).required(),
  departmentId: Joi.string().required(),
  teamId: Joi.string().optional(),
  managerId: Joi.string().optional(),
  role: Joi.string().valid('employee', 'manager', 'team_lead', 'hr_admin').default('employee'),
  level: Joi.string().valid('junior', 'mid', 'senior', 'lead', 'principal').optional(),
  hireDate: Joi.date().iso().optional(),
  status: Joi.string().valid('active', 'inactive', 'terminated').default('active')
});

export const employeeUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  jobTitle: Joi.string().max(100).optional(),
  departmentId: Joi.string().optional(),
  teamId: Joi.string().optional(),
  managerId: Joi.string().optional(),
  role: Joi.string().valid('employee', 'manager', 'team_lead', 'hr_admin').optional(),
  level: Joi.string().valid('junior', 'mid', 'senior', 'lead', 'principal').optional(),
  hireDate: Joi.date().iso().optional(),
  status: Joi.string().valid('active', 'inactive', 'terminated').optional()
});

export const employeeFiltersSchema = Joi.object({
  search: Joi.string().max(100).optional(),
  departmentId: Joi.string().optional(),
  teamId: Joi.string().optional(),
  role: Joi.string().valid('employee', 'manager', 'team_lead', 'hr_admin').optional(),
  level: Joi.string().valid('junior', 'mid', 'senior', 'lead', 'principal').optional(),
  status: Joi.string().valid('active', 'inactive', 'terminated').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const enrichmentSchema = Joi.object({
  sources: Joi.array().items(Joi.string().valid('linkedin', 'github', 'credly', 'gemini', 'orcid')).default(['linkedin', 'github', 'credly', 'gemini'])
});

export const skillsSchema = Joi.object({
  skills: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    category: Joi.string().optional(),
    verified: Joi.boolean().default(false)
  })).optional(),
  competences: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    description: Joi.string().optional()
  })).optional()
});
