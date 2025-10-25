import Joi from 'joi';

export const trainerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  companyId: Joi.string().required(),
  trainerType: Joi.string().valid('internal', 'external', 'freelance').required(),
  teachingMode: Joi.array().items(Joi.string().valid('in-person', 'virtual', 'hybrid')).required(),
  verifiedTeachingSkills: Joi.array().items(Joi.string()).required(),
  certifications: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    issuer: Joi.string().required(),
    issueDate: Joi.date().iso().required(),
    expiryDate: Joi.date().iso().optional(),
    credentialId: Joi.string().optional()
  })).optional(),
  languages: Joi.array().items(Joi.string()).default(['English']),
  availability: Joi.object({
    timezone: Joi.string().required(),
    schedule: Joi.object().pattern(Joi.string(), Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required(),
      available: Joi.boolean().default(true)
    })).required()
  }).required(),
  pricing: Joi.object({
    hourlyRate: Joi.number().min(0).optional(),
    dailyRate: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).default('USD')
  }).optional(),
  aiEditingEnabled: Joi.boolean().default(false),
  publishPermission: Joi.boolean().default(false),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active')
});

export const trainerUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  companyId: Joi.string().optional(),
  trainerType: Joi.string().valid('internal', 'external', 'freelance').optional(),
  teachingMode: Joi.array().items(Joi.string().valid('in-person', 'virtual', 'hybrid')).optional(),
  verifiedTeachingSkills: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    issuer: Joi.string().required(),
    issueDate: Joi.date().iso().required(),
    expiryDate: Joi.date().iso().optional(),
    credentialId: Joi.string().optional()
  })).optional(),
  languages: Joi.array().items(Joi.string()).optional(),
  availability: Joi.object({
    timezone: Joi.string().required(),
    schedule: Joi.object().pattern(Joi.string(), Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required(),
      available: Joi.boolean().default(true)
    })).required()
  }).optional(),
  pricing: Joi.object({
    hourlyRate: Joi.number().min(0).optional(),
    dailyRate: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).default('USD')
  }).optional(),
  aiEditingEnabled: Joi.boolean().optional(),
  publishPermission: Joi.boolean().optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional()
});

export const trainerFiltersSchema = Joi.object({
  companyId: Joi.string().optional(),
  trainerType: Joi.string().valid('internal', 'external', 'freelance').optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  teachingMode: Joi.array().items(Joi.string().valid('in-person', 'virtual', 'hybrid')).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const trainerSearchSchema = Joi.object({
  skills: Joi.array().items(Joi.string()).optional(),
  teachingMode: Joi.array().items(Joi.string().valid('in-person', 'virtual', 'hybrid')).optional(),
  trainerType: Joi.string().valid('internal', 'external', 'freelance').optional(),
  companyId: Joi.string().optional()
});

export const certificationsSchema = Joi.object({
  certifications: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    issuer: Joi.string().required(),
    issueDate: Joi.date().iso().required(),
    expiryDate: Joi.date().iso().optional(),
    credentialId: Joi.string().optional()
  })).required()
});

export const availabilitySchema = Joi.object({
  availability: Joi.object({
    timezone: Joi.string().required(),
    schedule: Joi.object().pattern(Joi.string(), Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required(),
      available: Joi.boolean().default(true)
    })).required()
  }).required()
});
