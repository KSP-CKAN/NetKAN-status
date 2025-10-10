import { describe, it, expect } from 'vitest';
import { formatRelativeDate } from '../date';

describe('formatRelativeDate', () => {
  it('should return "N/A" for null input', () => {
    expect(formatRelativeDate(null)).toBe('N/A');
  });

  it('should return "N/A" for undefined input', () => {
    expect(formatRelativeDate(undefined)).toBe('N/A');
  });

  it('should format a valid date string', () => {
    const result = formatRelativeDate(new Date().toISOString());
    expect(result).toContain('ago');
  });

  it('should format a Date object', () => {
    const date = new Date();
    date.setHours(date.getHours() - 2);
    const result = formatRelativeDate(date);
    expect(result).toContain('hour');
  });

  it('should return "Invalid date" for invalid date strings', () => {
    expect(formatRelativeDate('not-a-date')).toBe('Invalid date');
  });
});
