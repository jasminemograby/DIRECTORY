import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid } from 'date-fns';

// Utility functions for the Directory Microservice

/**
 * Generate a unique ID
 * @returns {string} UUID v4
 */
export const generateId = () => uuidv4();

/**
 * Format a date string or Date object
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'yyyy-MM-dd')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    return format(dateObj, formatStr);
  } catch (error) {
    return null;
  }
};

/**
 * Format a date and time string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format number with locale-specific formatting
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage value
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 1000); // Limit length
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
};

/**
 * Check if object is empty
 * @param {any} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === maxRetries) break;
      
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * Create a standardized API response
 * @param {boolean} success - Success status
 * @param {any} data - Response data
 * @param {string} error - Error message
 * @param {string} source - Data source (live/mock)
 * @returns {object} Standardized response object
 */
export const createResponse = (success, data = null, error = null, source = 'live') => {
  return {
    success,
    data,
    error,
    source,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a success response
 * @param {any} data - Response data
 * @param {string} source - Data source
 * @returns {object} Success response
 */
export const createSuccessResponse = (data, source = 'live') => {
  return createResponse(true, data, null, source);
};

/**
 * Create an error response
 * @param {string} error - Error message
 * @param {string} source - Data source
 * @returns {object} Error response
 */
export const createErrorResponse = (error, source = 'live') => {
  return createResponse(false, null, error, source);
};

/**
 * Calculate skill relevance score
 * @param {Array} requiredSkills - Required skills
 * @param {Array} employeeSkills - Employee skills
 * @returns {number} Relevance score (0-100)
 */
export const calculateRelevanceScore = (requiredSkills, employeeSkills) => {
  if (!requiredSkills || !employeeSkills || requiredSkills.length === 0) {
    return 0;
  }
  
  const skillMap = new Map();
  employeeSkills.forEach(skill => {
    skillMap.set(skill.name.toLowerCase(), skill.level);
  });
  
  let matchedSkills = 0;
  let totalScore = 0;
  
  requiredSkills.forEach(requiredSkill => {
    const employeeSkill = skillMap.get(requiredSkill.name.toLowerCase());
    if (employeeSkill) {
      matchedSkills++;
      const levelScore = getSkillLevelScore(employeeSkill);
      totalScore += levelScore;
    }
  });
  
  if (matchedSkills === 0) return 0;
  
  const averageScore = totalScore / matchedSkills;
  const matchRatio = matchedSkills / requiredSkills.length;
  
  return Math.round(averageScore * matchRatio);
};

/**
 * Get numeric score for skill level
 * @param {string} level - Skill level
 * @returns {number} Numeric score (0-100)
 */
export const getSkillLevelScore = (level) => {
  const levelScores = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100
  };
  
  return levelScores[level] || 0;
};

/**
 * Generate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Pagination metadata
 */
export const generatePaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Filter and sort array of objects
 * @param {Array} items - Array to filter and sort
 * @param {object} filters - Filter criteria
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Filtered and sorted array
 */
export const filterAndSort = (items, filters = {}, sortBy = 'createdAt', sortOrder = 'desc') => {
  let filtered = [...items];
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filtered = filtered.filter(item => {
        const itemValue = item[key];
        if (typeof value === 'string') {
          return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    }
  });
  
  // Apply sorting
  filtered.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return filtered;
};

/**
 * Mask sensitive data
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of characters to keep visible
 * @returns {string} Masked data
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || typeof data !== 'string') return '';
  if (data.length <= visibleChars) return '*'.repeat(data.length);
  
  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + visible;
};

/**
 * Generate random color for UI
 * @returns {string} CSS color class
 */
export const getRandomColor = () => {
  const colors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
