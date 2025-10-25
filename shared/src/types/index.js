// Type definitions and interfaces for the Directory Microservice

/**
 * Company entity structure
 */
export const CompanyType = {
  id: 'string (UUID)',
  name: 'string',
  domain: 'string',
  industry: 'string',
  size: 'string',
  location: 'string',
  founded: 'Date',
  description: 'string',
  website: 'string',
  logo_url: 'string',
  settings: 'object',
  subscription: 'object',
  createdAt: 'Date',
  updatedAt: 'Date',
  isActive: 'boolean',
  deletedAt: 'Date'
};

/**
 * Employee entity structure
 */
export const EmployeeType = {
  id: 'string (UUID)',
  companyId: 'string (UUID)',
  employeeId: 'string',
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  phone: 'string',
  position: 'string',
  department: 'string',
  team: 'string',
  managerId: 'string (UUID)',
  location: 'string',
  startDate: 'Date',
  employmentType: 'string',
  status: 'string',
  avatar_url: 'string',
  profile: 'object',
  trainingHistory: 'array',
  currentTrainings: 'array',
  skillGaps: 'array',
  relevanceScore: 'number',
  performance: 'object',
  createdAt: 'Date',
  updatedAt: 'Date',
  isActive: 'boolean',
  deletedAt: 'Date'
};

/**
 * Trainer entity structure
 */
export const TrainerType = {
  id: 'string (UUID)',
  name: 'string',
  title: 'string',
  email: 'string',
  phone: 'string',
  bio: 'string',
  avatar_url: 'string',
  trainerType: 'string',
  teachingMode: 'string',
  specializations: 'array',
  certifications: 'array',
  languages: 'array',
  availability: 'object',
  pricing: 'object',
  aiEditing: 'object',
  publishPermission: 'object',
  rating: 'object',
  courses: 'array',
  recentReviews: 'array',
  teachingExperience: 'string',
  createdAt: 'Date',
  updatedAt: 'Date',
  isActive: 'boolean',
  deletedAt: 'Date'
};

/**
 * Training Request entity structure
 */
export const TrainingRequestType = {
  id: 'string (UUID)',
  employeeId: 'string (UUID)',
  course: 'object',
  trainer: 'object',
  requestDetails: 'object',
  schedule: 'object',
  cost: 'object',
  approval: 'object',
  priority: 'string',
  department: 'string',
  tags: 'array',
  attachments: 'array',
  status: 'string',
  createdAt: 'Date',
  updatedAt: 'Date',
  deletedAt: 'Date'
};

/**
 * API Response structure
 */
export const ApiResponseType = {
  success: 'boolean',
  data: 'any',
  error: 'string',
  source: 'string',
  timestamp: 'string (ISO)'
};

/**
 * Pagination metadata structure
 */
export const PaginationMetaType = {
  page: 'number',
  limit: 'number',
  total: 'number',
  totalPages: 'number',
  hasNextPage: 'boolean',
  hasPrevPage: 'boolean',
  nextPage: 'number|null',
  prevPage: 'number|null'
};

/**
 * Skill structure
 */
export const SkillType = {
  name: 'string',
  level: 'string',
  yearsOfExperience: 'number',
  lastUsed: 'Date',
  certifications: 'array',
  projects: 'array'
};

/**
 * Competence category structure
 */
export const CompetenceCategoryType = {
  category: 'string',
  skills: 'array<SkillType>'
};

/**
 * Employee profile structure
 */
export const EmployeeProfileType = {
  overview: {
    bio: 'string',
    linkedin: 'string',
    github: 'string',
    website: 'string',
    timezone: 'string',
    preferredLanguage: 'string'
  },
  competences: {
    technical: 'array<CompetenceCategoryType>',
    soft: 'array<SoftSkillType>'
  },
  enrichment: {
    lastEnriched: 'Date',
    sources: 'array',
    valueProposition: 'string',
    recommendations: 'array'
  }
};

/**
 * Soft skill structure
 */
export const SoftSkillType = {
  name: 'string',
  level: 'string',
  description: 'string'
};

/**
 * Training history item structure
 */
export const TrainingHistoryType = {
  id: 'string',
  title: 'string',
  trainer: 'string',
  completedDate: 'Date',
  score: 'number',
  certificate: 'string',
  skills: 'array'
};

/**
 * Current training structure
 */
export const CurrentTrainingType = {
  id: 'string',
  title: 'string',
  trainer: 'string',
  startDate: 'Date',
  endDate: 'Date',
  progress: 'number',
  status: 'string'
};

/**
 * Skill gap structure
 */
export const SkillGapType = {
  skill: 'string',
  requiredLevel: 'string',
  currentLevel: 'string',
  priority: 'string',
  recommendedCourses: 'array'
};

/**
 * Performance structure
 */
export const PerformanceType = {
  overall: 'number',
  technical: 'number',
  communication: 'number',
  leadership: 'number',
  lastReview: 'Date'
};

/**
 * Trainer certification structure
 */
export const TrainerCertificationType = {
  name: 'string',
  issuer: 'string',
  date: 'Date',
  credentialId: 'string'
};

/**
 * Trainer availability structure
 */
export const TrainerAvailabilityType = {
  timezone: 'string',
  schedule: 'array<ScheduleDayType>'
};

/**
 * Schedule day structure
 */
export const ScheduleDayType = {
  day: 'string',
  hours: 'string'
};

/**
 * Trainer pricing structure
 */
export const TrainerPricingType = {
  hourlyRate: 'number',
  courseRate: 'number',
  currency: 'string'
};

/**
 * Trainer rating structure
 */
export const TrainerRatingType = {
  average: 'number',
  count: 'number',
  breakdown: 'object'
};

/**
 * Course structure
 */
export const CourseType = {
  id: 'string',
  title: 'string',
  description: 'string',
  duration: 'string',
  level: 'string',
  students: 'number',
  rating: 'number',
  price: 'number',
  status: 'string'
};

/**
 * Review structure
 */
export const ReviewType = {
  id: 'string',
  student: 'string',
  rating: 'number',
  comment: 'string',
  date: 'Date',
  course: 'string'
};

/**
 * Training request course structure
 */
export const TrainingRequestCourseType = {
  id: 'string',
  title: 'string',
  description: 'string',
  duration: 'string',
  level: 'string'
};

/**
 * Training request trainer structure
 */
export const TrainingRequestTrainerType = {
  id: 'string',
  name: 'string',
  email: 'string'
};

/**
 * Training request details structure
 */
export const TrainingRequestDetailsType = {
  justification: 'string',
  businessImpact: 'string',
  expectedOutcome: 'string',
  timeline: 'string'
};

/**
 * Training request schedule structure
 */
export const TrainingRequestScheduleType = {
  preferredStartDate: 'Date',
  preferredEndDate: 'Date',
  preferredTimeSlots: 'array',
  timezone: 'string',
  flexibility: 'string'
};

/**
 * Training request cost structure
 */
export const TrainingRequestCostType = {
  courseFee: 'number',
  materials: 'number',
  total: 'number',
  currency: 'string',
  budgetCode: 'string'
};

/**
 * Training request approval structure
 */
export const TrainingRequestApprovalType = {
  status: 'string',
  requestedDate: 'Date',
  approverId: 'string',
  approverName: 'string',
  approvedDate: 'Date',
  rejectionReason: 'string',
  comments: 'array'
};

/**
 * Approval comment structure
 */
export const ApprovalCommentType = {
  author: 'string',
  comment: 'string',
  date: 'Date'
};

/**
 * Mock data structure
 */
export const MockDataType = {
  companies: 'array<CompanyType>',
  employees: 'array<EmployeeType>',
  trainers: 'array<TrainerType>',
  trainingRequests: 'array<TrainingRequestType>'
};

/**
 * External API response structure
 */
export const ExternalApiResponseType = {
  success: 'boolean',
  data: 'any',
  error: 'string',
  source: 'string',
  timestamp: 'string (ISO)',
  apiName: 'string',
  endpoint: 'string'
};

/**
 * Enrichment request structure
 */
export const EnrichmentRequestType = {
  sources: 'array',
  forceRefresh: 'boolean'
};

/**
 * Enrichment response structure
 */
export const EnrichmentResponseType = {
  success: 'boolean',
  data: 'object',
  sources: 'array',
  lastEnriched: 'Date',
  valueProposition: 'string',
  recommendations: 'array',
  error: 'string'
};

/**
 * Skill gap analysis structure
 */
export const SkillGapAnalysisType = {
  skill: 'string',
  requiredLevel: 'string',
  currentLevel: 'string',
  priority: 'string',
  recommendedCourses: 'array',
  gapScore: 'number'
};

/**
 * Relevance score structure
 */
export const RelevanceScoreType = {
  score: 'number',
  factors: 'object',
  breakdown: 'object',
  recommendations: 'array'
};

/**
 * Database connection configuration
 */
export const DatabaseConfigType = {
  host: 'string',
  port: 'number',
  database: 'string',
  username: 'string',
  password: 'string',
  ssl: 'boolean',
  poolSize: 'number',
  timeout: 'number'
};

/**
 * Redis configuration
 */
export const RedisConfigType = {
  host: 'string',
  port: 'number',
  password: 'string',
  db: 'number',
  timeout: 'number'
};

/**
 * JWT payload structure
 */
export const JwtPayloadType = {
  userId: 'string',
  email: 'string',
  role: 'string',
  companyId: 'string',
  iat: 'number',
  exp: 'number'
};

/**
 * Log entry structure
 */
export const LogEntryType = {
  level: 'string',
  message: 'string',
  timestamp: 'string (ISO)',
  userId: 'string',
  companyId: 'string',
  requestId: 'string',
  metadata: 'object'
};

/**
 * Health check response structure
 */
export const HealthCheckType = {
  status: 'string',
  timestamp: 'string (ISO)',
  uptime: 'number',
  version: 'string',
  environment: 'string',
  services: 'object',
  memory: 'object',
  database: 'object',
  redis: 'object'
};
