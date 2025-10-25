import Joi from 'joi';

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  url: Joi.string().uri().optional(),
  date: Joi.date().iso().optional(),
  boolean: Joi.boolean().optional(),
  string: Joi.string().optional(),
  number: Joi.number().optional(),
  array: Joi.array().optional(),
  object: Joi.object().optional()
};

// Company validation schemas
export const companySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    domain: Joi.string().domain().required(),
    industry: Joi.string().max(100).optional(),
    size: Joi.string().max(50).optional(),
    location: Joi.string().max(255).optional(),
    founded: Joi.date().iso().optional(),
    description: Joi.string().max(1000).optional(),
    website: Joi.string().uri().optional(),
    logo_url: Joi.string().uri().optional(),
    settings: Joi.object().optional(),
    subscription: Joi.object().optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    domain: Joi.string().domain().optional(),
    industry: Joi.string().max(100).optional(),
    size: Joi.string().max(50).optional(),
    location: Joi.string().max(255).optional(),
    founded: Joi.date().iso().optional(),
    description: Joi.string().max(1000).optional(),
    website: Joi.string().uri().optional(),
    logo_url: Joi.string().uri().optional(),
    settings: Joi.object().optional(),
    subscription: Joi.object().optional()
  })
};

// Employee validation schemas
export const employeeSchemas = {
  create: Joi.object({
    companyId: Joi.string().uuid().required(),
    employeeId: Joi.string().max(50).required(),
    firstName: Joi.string().min(1).max(100).required(),
    lastName: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    position: Joi.string().max(100).optional(),
    department: Joi.string().max(100).optional(),
    team: Joi.string().max(100).optional(),
    managerId: Joi.string().uuid().optional(),
    location: Joi.string().max(255).optional(),
    startDate: Joi.date().iso().optional(),
    employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'intern', 'freelance').optional(),
    status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').optional(),
    avatar_url: Joi.string().uri().optional(),
    profile: Joi.object().optional()
  }),

  update: Joi.object({
    firstName: Joi.string().min(1).max(100).optional(),
    lastName: Joi.string().min(1).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    position: Joi.string().max(100).optional(),
    department: Joi.string().max(100).optional(),
    team: Joi.string().max(100).optional(),
    managerId: Joi.string().uuid().optional(),
    location: Joi.string().max(255).optional(),
    startDate: Joi.date().iso().optional(),
    employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'intern', 'freelance').optional(),
    status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').optional(),
    avatar_url: Joi.string().uri().optional(),
    profile: Joi.object().optional()
  }),

  skills: Joi.object({
    skills: Joi.array().items(
      Joi.object({
        category: Joi.string().required(),
        skills: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
            yearsOfExperience: Joi.number().min(0).optional(),
            lastUsed: Joi.date().iso().optional(),
            certifications: Joi.array().items(Joi.string()).optional(),
            projects: Joi.array().items(Joi.string()).optional()
          })
        ).required()
      })
    ).required()
  }),

  enrichment: Joi.object({
    sources: Joi.array().items(Joi.string()).optional(),
    forceRefresh: Joi.boolean().optional()
  })
};

// Trainer validation schemas
export const trainerSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    title: Joi.string().max(255).optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    bio: Joi.string().max(2000).optional(),
    avatar_url: Joi.string().uri().optional(),
    trainerType: Joi.string().valid('internal', 'external', 'freelance').optional(),
    teachingMode: Joi.string().valid('online', 'offline', 'hybrid').optional(),
    specializations: Joi.array().items(Joi.string()).optional(),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        issuer: Joi.string().required(),
        date: Joi.date().iso().required(),
        credentialId: Joi.string().optional()
      })
    ).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    availability: Joi.object().optional(),
    pricing: Joi.object().optional(),
    teachingExperience: Joi.string().max(100).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    title: Joi.string().max(255).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    bio: Joi.string().max(2000).optional(),
    avatar_url: Joi.string().uri().optional(),
    trainerType: Joi.string().valid('internal', 'external', 'freelance').optional(),
    teachingMode: Joi.string().valid('online', 'offline', 'hybrid').optional(),
    specializations: Joi.array().items(Joi.string()).optional(),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        issuer: Joi.string().required(),
        date: Joi.date().iso().required(),
        credentialId: Joi.string().optional()
      })
    ).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    availability: Joi.object().optional(),
    pricing: Joi.object().optional(),
    teachingExperience: Joi.string().max(100).optional()
  })
};

// Training Request validation schemas
export const trainingRequestSchemas = {
  create: Joi.object({
    employeeId: Joi.string().uuid().required(),
    course: Joi.object({
      id: Joi.string().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      duration: Joi.string().optional(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional()
    }).required(),
    trainer: Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().optional(),
      email: Joi.string().email().optional()
    }).optional(),
    requestDetails: Joi.object({
      justification: Joi.string().required(),
      businessImpact: Joi.string().optional(),
      expectedOutcome: Joi.string().optional(),
      timeline: Joi.string().optional()
    }).required(),
    schedule: Joi.object({
      preferredStartDate: Joi.date().iso().optional(),
      preferredEndDate: Joi.date().iso().optional(),
      preferredTimeSlots: Joi.array().items(Joi.string()).optional(),
      timezone: Joi.string().optional(),
      flexibility: Joi.string().valid('low', 'moderate', 'high').optional()
    }).optional(),
    cost: Joi.object({
      courseFee: Joi.number().min(0).optional(),
      materials: Joi.number().min(0).optional(),
      total: Joi.number().min(0).optional(),
      currency: Joi.string().length(3).optional(),
      budgetCode: Joi.string().optional()
    }).optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    department: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    course: Joi.object({
      id: Joi.string().optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      duration: Joi.string().optional(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional()
    }).optional(),
    trainer: Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().optional(),
      email: Joi.string().email().optional()
    }).optional(),
    requestDetails: Joi.object({
      justification: Joi.string().optional(),
      businessImpact: Joi.string().optional(),
      expectedOutcome: Joi.string().optional(),
      timeline: Joi.string().optional()
    }).optional(),
    schedule: Joi.object({
      preferredStartDate: Joi.date().iso().optional(),
      preferredEndDate: Joi.date().iso().optional(),
      preferredTimeSlots: Joi.array().items(Joi.string()).optional(),
      timezone: Joi.string().optional(),
      flexibility: Joi.string().valid('low', 'moderate', 'high').optional()
    }).optional(),
    cost: Joi.object({
      courseFee: Joi.number().min(0).optional(),
      materials: Joi.number().min(0).optional(),
      total: Joi.number().min(0).optional(),
      currency: Joi.string().length(3).optional(),
      budgetCode: Joi.string().optional()
    }).optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    department: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  approve: Joi.object({
    approverId: Joi.string().uuid().required(),
    comments: Joi.string().max(1000).optional()
  }),

  reject: Joi.object({
    approverId: Joi.string().uuid().required(),
    rejectionReason: Joi.string().max(1000).required(),
    comments: Joi.string().max(1000).optional()
  })
};

// Query parameter validation schemas
export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('asc')
  }),

  search: Joi.object({
    q: Joi.string().max(255).optional(),
    department: Joi.string().max(100).optional(),
    status: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional()
  })
};

// Validation helper functions
export const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
    throw new Error(`Validation error: ${JSON.stringify(errors)}`);
  }
  return value;
};

export const validateQuery = (schema, query) => {
  return validateRequest(schema, query);
};

export const validateBody = (schema, body) => {
  return validateRequest(schema, body);
};

export const validateParams = (schema, params) => {
  return validateRequest(schema, params);
};
