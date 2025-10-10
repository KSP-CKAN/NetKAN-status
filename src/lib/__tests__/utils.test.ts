import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
  it('should merge single class', () => {
    const result = cn('text-red-500');
    expect(result).toBe('text-red-500');
  });

  it('should merge multiple classes', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-true', false && 'conditional-false');
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-true');
    expect(result).not.toContain('conditional-false');
  });

  it('should handle undefined and null', () => {
    const result = cn('text-red-500', undefined, null, 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should merge conflicting tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    // twMerge should keep only the last color
    expect(result).toBe('text-blue-500');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle array of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500']);
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle object notation', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'p-4': true,
    });
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('bg-blue-500');
    expect(result).toContain('p-4');
  });
});
