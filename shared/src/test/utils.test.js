import { jest } from '@jest/globals';
import {
  generateId,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  truncateText,
  getInitials,
  isValidEmail,
  isValidUrl,
  sanitizeString,
  deepClone,
  isEmpty,
  sleep,
  retryWithBackoff,
  createResponse,
  createSuccessResponse,
  createErrorResponse,
  calculateRelevanceScore,
  getSkillLevelScore,
  generatePaginationMeta,
  filterAndSort,
  maskSensitiveData,
  getRandomColor
} from '../utils/index.js';

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format a date string', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      
      expect(formatted).toBe('2024-01-15');
    });

    it('should format a Date object', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      
      expect(formatted).toBe('2024-01-15');
    });

    it('should return null for invalid date', () => {
      const formatted = formatDate('invalid-date');
      
      expect(formatted).toBeNull();
    });

    it('should return null for null input', () => {
      const formatted = formatDate(null);
      
      expect(formatted).toBeNull();
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDateTime(date);
      
      expect(formatted).toBe('2024-01-15 10:30:00');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      const formatted = formatCurrency(1234.56);
      
      expect(formatted).toBe('$1,234.56');
    });

    it('should format currency with custom currency', () => {
      const formatted = formatCurrency(1234.56, 'EUR');
      
      expect(formatted).toContain('1,234.56');
    });

    it('should return N/A for non-number input', () => {
      const formatted = formatCurrency('invalid');
      
      expect(formatted).toBe('N/A');
    });
  });

  describe('formatNumber', () => {
    it('should format number with locale', () => {
      const formatted = formatNumber(1234567);
      
      expect(formatted).toBe('1,234,567');
    });

    it('should return N/A for non-number input', () => {
      const formatted = formatNumber('invalid');
      
      expect(formatted).toBe('N/A');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      const formatted = formatPercentage(87.5);
      
      expect(formatted).toBe('87.5%');
    });

    it('should format percentage with custom decimals', () => {
      const formatted = formatPercentage(87.567, 2);
      
      expect(formatted).toBe('87.57%');
    });

    it('should return N/A for non-number input', () => {
      const formatted = formatPercentage('invalid');
      
      expect(formatted).toBe('N/A');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const truncated = truncateText(text, 20);
      
      expect(truncated).toBe('This is a very long...');
    });

    it('should return original text if shorter than max length', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 20);
      
      expect(truncated).toBe('Short text');
    });

    it('should return empty string for null input', () => {
      const truncated = truncateText(null, 20);
      
      expect(truncated).toBe('');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      const initials = getInitials('John Doe');
      
      expect(initials).toBe('JD');
    });

    it('should get initials from single name', () => {
      const initials = getInitials('John');
      
      expect(initials).toBe('J');
    });

    it('should return ?? for null input', () => {
      const initials = getInitials(null);
      
      expect(initials).toBe('??');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      const isValid = isValidEmail('test@example.com');
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid email', () => {
      const isValid = isValidEmail('invalid-email');
      
      expect(isValid).toBe(false);
    });

    it('should return false for null input', () => {
      const isValid = isValidEmail(null);
      
      expect(isValid).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URL', () => {
      const isValid = isValidUrl('https://example.com');
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid URL', () => {
      const isValid = isValidUrl('not-a-url');
      
      expect(isValid).toBe(false);
    });

    it('should return false for null input', () => {
      const isValid = isValidUrl(null);
      
      expect(isValid).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize string input', () => {
      const sanitized = sanitizeString('  <script>alert("test")</script>  ');
      
      expect(sanitized).toBe('scriptalert("test")/script');
    });

    it('should return empty string for null input', () => {
      const sanitized = sanitizeString(null);
      
      expect(sanitized).toBe('');
    });
  });

  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should clone arrays', () => {
      const original = [1, 2, { a: 3 }];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('test')).toBe(false);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified milliseconds', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('retryWithBackoff', () => {
    it('should retry function on failure', async () => {
      let attempts = 0;
      const fn = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Test error');
        }
        return 'success';
      });

      const result = await retryWithBackoff(fn, 3, 10);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const fn = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('Test error');
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('createResponse', () => {
    it('should create success response', () => {
      const response = createResponse(true, { data: 'test' }, null, 'mock');
      
      expect(response).toEqual({
        success: true,
        data: { data: 'test' },
        error: null,
        source: 'mock',
        timestamp: expect.any(String)
      });
    });

    it('should create error response', () => {
      const response = createResponse(false, null, 'Test error', 'live');
      
      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Test error',
        source: 'live',
        timestamp: expect.any(String)
      });
    });
  });

  describe('createSuccessResponse', () => {
    it('should create success response', () => {
      const response = createSuccessResponse({ data: 'test' }, 'mock');
      
      expect(response).toEqual({
        success: true,
        data: { data: 'test' },
        error: null,
        source: 'mock',
        timestamp: expect.any(String)
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const response = createErrorResponse('Test error', 'live');
      
      expect(response).toEqual({
        success: false,
        data: null,
        error: 'Test error',
        source: 'live',
        timestamp: expect.any(String)
      });
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should calculate relevance score', () => {
      const requiredSkills = [
        { name: 'React', level: 'Advanced' },
        { name: 'JavaScript', level: 'Expert' }
      ];
      
      const employeeSkills = [
        { name: 'React', level: 'Expert' },
        { name: 'JavaScript', level: 'Advanced' }
      ];

      const score = calculateRelevanceScore(requiredSkills, employeeSkills);
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for no matching skills', () => {
      const requiredSkills = [{ name: 'React', level: 'Advanced' }];
      const employeeSkills = [{ name: 'Vue', level: 'Expert' }];

      const score = calculateRelevanceScore(requiredSkills, employeeSkills);
      
      expect(score).toBe(0);
    });
  });

  describe('getSkillLevelScore', () => {
    it('should return correct scores for skill levels', () => {
      expect(getSkillLevelScore('Beginner')).toBe(25);
      expect(getSkillLevelScore('Intermediate')).toBe(50);
      expect(getSkillLevelScore('Advanced')).toBe(75);
      expect(getSkillLevelScore('Expert')).toBe(100);
    });

    it('should return 0 for unknown level', () => {
      expect(getSkillLevelScore('Unknown')).toBe(0);
    });
  });

  describe('generatePaginationMeta', () => {
    it('should generate pagination metadata', () => {
      const meta = generatePaginationMeta(2, 20, 100);
      
      expect(meta).toEqual({
        page: 2,
        limit: 20,
        total: 100,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: true,
        nextPage: 3,
        prevPage: 1
      });
    });

    it('should handle first page', () => {
      const meta = generatePaginationMeta(1, 20, 100);
      
      expect(meta.hasPrevPage).toBe(false);
      expect(meta.prevPage).toBeNull();
    });

    it('should handle last page', () => {
      const meta = generatePaginationMeta(5, 20, 100);
      
      expect(meta.hasNextPage).toBe(false);
      expect(meta.nextPage).toBeNull();
    });
  });

  describe('filterAndSort', () => {
    const items = [
      { id: 1, name: 'Apple', category: 'fruit' },
      { id: 2, name: 'Banana', category: 'fruit' },
      { id: 3, name: 'Carrot', category: 'vegetable' }
    ];

    it('should filter items', () => {
      const filtered = filterAndSort(items, { category: 'fruit' });
      
      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('Apple');
      expect(filtered[1].name).toBe('Banana');
    });

    it('should sort items', () => {
      const sorted = filterAndSort(items, {}, 'name', 'desc');
      
      expect(sorted[0].name).toBe('Carrot');
      expect(sorted[1].name).toBe('Banana');
      expect(sorted[2].name).toBe('Apple');
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask sensitive data', () => {
      const masked = maskSensitiveData('1234567890', 4);
      
      expect(masked).toBe('******7890');
    });

    it('should handle short strings', () => {
      const masked = maskSensitiveData('123', 4);
      
      expect(masked).toBe('***');
    });
  });

  describe('getRandomColor', () => {
    it('should return a valid color class', () => {
      const color = getRandomColor();
      
      expect(color).toMatch(/^bg-\w+-\d+$/);
    });
  });
});
