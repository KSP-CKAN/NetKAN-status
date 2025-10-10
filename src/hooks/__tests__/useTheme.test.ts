import { describe, it, expect } from 'vitest';
import { getNextTheme } from '../useTheme';
import type { Theme } from '../useTheme';

describe('getNextTheme', () => {
  it('should toggle from light to dark', () => {
    const result = getNextTheme('light');
    expect(result).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    const result = getNextTheme('dark');
    expect(result).toBe('light');
  });

  it('should handle multiple toggles', () => {
    let theme: Theme = 'light';
    theme = getNextTheme(theme);
    expect(theme).toBe('dark');
    theme = getNextTheme(theme);
    expect(theme).toBe('light');
    theme = getNextTheme(theme);
    expect(theme).toBe('dark');
  });
});
