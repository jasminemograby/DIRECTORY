import Joi from 'joi';

export const trainingRequestSchema = Joi.object({
  requesterId: Joi.string().required(),
  companyId: Joi.string().required(),
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').required(),
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().max(1000).required(),
  skillCategories: Joi.array().items(Joi.string()).required(),
  targetAudience: Joi.string().max(200).optional(),
  expectedOutcomes: Joi.array().items(Joi.string()).optional(),
  budget: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).default('USD'),
  preferredStartDate: Joi.date().iso().optional(),
  preferredEndDate: Joi.date().iso().optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  location: Joi.string().max(200).optional(),
  deliveryMode: Joi.string().valid('in-person', 'virtual', 'hybrid').optional(),
  urgency: Joi.string().valid('low', 'medium', 'high').default('medium'),
  businessJustification: Joi.string().max(1000).optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled').default('pending')
});

export const trainingRequestUpdateSchema = Joi.object({
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').optional(),
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  skillCategories: Joi.array().items(Joi.string()).optional(),
  targetAudience: Joi.string().max(200).optional(),
  expectedOutcomes: Joi.array().items(Joi.string()).optional(),
  budget: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  preferredStartDate: Joi.date().iso().optional(),
  preferredEndDate: Joi.date().iso().optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  location: Joi.string().max(200).optional(),
  deliveryMode: Joi.string().valid('in-person', 'virtual', 'hybrid').optional(),
  urgency: Joi.string().valid('low', 'medium', 'high').optional(),
  businessJustification: Joi.string().max(1000).optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled').optional()
});

export const trainingRequestFiltersSchema = Joi.object({
  companyId: Joi.string().optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled').optional(),
  requesterId: Joi.string().optional(),
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').optional(),
  urgency: Joi.string().valid('low', 'medium', 'high').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const trainingRequestSearchSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'assigned', 'in-progress', 'completed', 'cancelled').optional(),
  type: Joi.string().valid('career-path', 'skill-driven', 'instructor-led').optional(),
  skillCategories: Joi.array().items(Joi.string()).optional(),
  requesterId: Joi.string().optional(),
  companyId: Joi.string().optional()
});

export const approvalSchema = Joi.object({
  approverId: Joi.string().required(),
  comments: Joi.string().max(500).optional()
});

export const rejectionSchema = Joi.object({
  approverId: Joi.string().required(),
  reason: Joi.string().max(500).required(),
  comments: Joi.string().max(500).optional()
});

export const trainerAssignmentSchema = Joi.object({
  trainerId: Joi.string().required(),
  assignedBy: Joi.string().required(),
  comments: Joi.string().max(500).optional()
});

export const assignmentSchema = trainerAssignmentSchema;
