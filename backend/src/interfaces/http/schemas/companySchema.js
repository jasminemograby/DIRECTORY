import Joi from 'joi';

export const companySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  industry: Joi.string().max(50).optional(),
  size: Joi.string().valid('startup', 'small', 'medium', 'large', 'enterprise').optional(),
  website: Joi.string().uri().optional(),
  headquarters: Joi.string().max(100).optional(),
  foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active')
});

export const companyUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  industry: Joi.string().max(50).optional(),
  size: Joi.string().valid('startup', 'small', 'medium', 'large', 'enterprise').optional(),
  website: Joi.string().uri().optional(),
  headquarters: Joi.string().max(100).optional(),
  foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional()
});

export const companyFiltersSchema = Joi.object({
  search: Joi.string().max(100).optional(),
  industry: Joi.string().max(50).optional(),
  size: Joi.string().valid('startup', 'small', 'medium', 'large', 'enterprise').optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});
