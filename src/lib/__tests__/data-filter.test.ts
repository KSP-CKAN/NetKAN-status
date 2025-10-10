import { describe, it, expect } from 'vitest';
import { filterNetKANs, sortNetKANs, calculateCounts } from '../data-filter';
import type { NetKANEntry, FilterState } from '@/types/netkan';

const mockData: NetKANEntry[] = [
  {
    id: 'TestMod1',
    game_id: 'ksp',
    frozen: false,
    last_indexed: '2024-01-01',
    last_error: 'Error message',
    resources: { metanetkan: 'url' },
  },
  {
    id: 'TestMod2',
    game_id: 'ksp2',
    frozen: true,
    last_indexed: '2024-01-02',
    resources: {},
  },
  {
    id: 'AnotherMod',
    game_id: 'ksp',
    frozen: false,
    last_indexed: '2024-01-03',
    last_warnings: 'Warning message',
    resources: {},
  },
];

describe('filterNetKANs', () => {
  const defaultFilters: FilterState = {
    filterId: null,
    showActive: true,
    showFrozen: true,
    showMeta: true,
    showNonmeta: true,
    showGames: { ksp: true, ksp2: true },
  };

  it('should return all data with default filters', () => {
    const result = filterNetKANs(mockData, defaultFilters);
    expect(result).toHaveLength(3);
  });

  it('should filter by text search', () => {
    const filters = { ...defaultFilters, filterId: 'Another' };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('AnotherMod');
  });

  it('should filter by game', () => {
    const filters = { ...defaultFilters, showGames: { ksp: true, ksp2: false } };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.game_id === 'ksp')).toBe(true);
  });

  it('should filter frozen mods', () => {
    const filters = { ...defaultFilters, showFrozen: false };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(2);
    expect(result.every((r) => !r.frozen)).toBe(true);
  });

  it('should filter active mods', () => {
    const filters = { ...defaultFilters, showActive: false };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(1);
    expect(result[0].frozen).toBe(true);
  });

  it('should filter meta/non-meta', () => {
    const filters = { ...defaultFilters, showNonmeta: false };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(1);
    expect(result[0].resources.metanetkan).toBeDefined();
  });

  it('should filter by error text', () => {
    const filters = { ...defaultFilters, filterId: 'Error message' };
    const result = filterNetKANs(mockData, filters);
    expect(result).toHaveLength(1);
    expect(result[0].last_error).toContain('Error');
  });
});

describe('sortNetKANs', () => {
  it('should sort by id ascending', () => {
    const result = sortNetKANs(mockData, 'id', 'ASC');
    expect(result[0].id).toBe('AnotherMod');
    expect(result[2].id).toBe('TestMod2');
  });

  it('should sort by id descending', () => {
    const result = sortNetKANs(mockData, 'id', 'DESC');
    expect(result[0].id).toBe('TestMod2');
    expect(result[2].id).toBe('AnotherMod');
  });

  it('should prioritize errors in error column sort', () => {
    const result = sortNetKANs(mockData, 'last_error', 'ASC');
    expect(result[0].last_error).toBeDefined();
    expect(result[1].last_warnings).toBeDefined();
  });

  it('should return original data when sortBy is null', () => {
    const result = sortNetKANs(mockData, null, 'ASC');
    expect(result).toEqual(mockData);
  });
});

describe('calculateCounts', () => {
  it('should calculate counts correctly', () => {
    const counts = calculateCounts(mockData);
    expect(counts.activeCount).toBe(2);
    expect(counts.frozenCount).toBe(1);
    expect(counts.metaCount).toBe(1);
    expect(counts.nonmetaCount).toBe(2);
    expect(counts.gameCounts.ksp).toBe(2);
    expect(counts.gameCounts.ksp2).toBe(1);
  });

  it('should handle empty data', () => {
    const counts = calculateCounts([]);
    expect(counts.activeCount).toBe(0);
    expect(counts.frozenCount).toBe(0);
    expect(counts.metaCount).toBe(0);
    expect(counts.nonmetaCount).toBe(0);
  });
});
