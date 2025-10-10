import { describe, it, expect } from 'vitest';
import {
  createInitialFilters,
  toggleActive,
  toggleFrozen,
  toggleMeta,
  toggleNonmeta,
  toggleGame,
  setFilterId,
} from '../useFilters';
import type { FilterState, GameConfig } from '@/types/netkan';

const mockGames: GameConfig[] = [
  {
    id: 'ksp',
    name: 'KSP',
    status: '/status/netkan.json',
    netkan: () => '',
    history: () => '',
    metadata: () => '',
  },
  {
    id: 'ksp2',
    name: 'KSP2',
    status: '/status/netkan-ksp2.json',
    netkan: () => '',
    history: () => '',
    metadata: () => '',
  },
];

describe('createInitialFilters', () => {
  it('should create initial filter state with all games enabled', () => {
    const filters = createInitialFilters(mockGames);

    expect(filters.filterId).toBeNull();
    expect(filters.showActive).toBe(true);
    expect(filters.showFrozen).toBe(false);
    expect(filters.showMeta).toBe(true);
    expect(filters.showNonmeta).toBe(true);
    expect(filters.showGames).toEqual({ ksp: true, ksp2: true });
  });

  it('should handle empty game list', () => {
    const filters = createInitialFilters([]);
    expect(filters.showGames).toEqual({});
  });
});

describe('toggleActive', () => {
  it('should toggle showActive when both are true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleActive(filters);
    expect(result.showActive).toBe(false);
    expect(result.showFrozen).toBe(true);
  });

  it('should toggle frozen to true when active is only option and being turned off', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: false,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleActive(filters);
    expect(result.showActive).toBe(false);
    expect(result.showFrozen).toBe(true);
  });

  it('should toggle showActive back to true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: false,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleActive(filters);
    expect(result.showActive).toBe(true);
    expect(result.showFrozen).toBe(true);
  });
});

describe('toggleFrozen', () => {
  it('should toggle showFrozen when both are true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleFrozen(filters);
    expect(result.showActive).toBe(true);
    expect(result.showFrozen).toBe(false);
  });

  it('should toggle active to true when frozen is only option and being turned off', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: false,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleFrozen(filters);
    expect(result.showActive).toBe(true);
    expect(result.showFrozen).toBe(false);
  });

  it('should toggle showFrozen back to true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: false,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleFrozen(filters);
    expect(result.showActive).toBe(true);
    expect(result.showFrozen).toBe(true);
  });
});

describe('toggleMeta', () => {
  it('should toggle showMeta when both are true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleMeta(filters);
    expect(result.showMeta).toBe(false);
    expect(result.showNonmeta).toBe(true);
  });

  it('should toggle nonmeta to true when meta is only option and being turned off', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: false,
      showGames: {},
    };

    const result = toggleMeta(filters);
    expect(result.showMeta).toBe(false);
    expect(result.showNonmeta).toBe(true);
  });

  it('should toggle showMeta back to true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: false,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleMeta(filters);
    expect(result.showMeta).toBe(true);
    expect(result.showNonmeta).toBe(true);
  });
});

describe('toggleNonmeta', () => {
  it('should toggle showNonmeta when both are true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleNonmeta(filters);
    expect(result.showMeta).toBe(true);
    expect(result.showNonmeta).toBe(false);
  });

  it('should toggle meta to true when nonmeta is only option and being turned off', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: false,
      showNonmeta: true,
      showGames: {},
    };

    const result = toggleNonmeta(filters);
    expect(result.showMeta).toBe(true);
    expect(result.showNonmeta).toBe(false);
  });

  it('should toggle showNonmeta back to true', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: false,
      showGames: {},
    };

    const result = toggleNonmeta(filters);
    expect(result.showMeta).toBe(true);
    expect(result.showNonmeta).toBe(true);
  });
});

describe('toggleGame', () => {
  it('should toggle game on/off normally', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: { ksp: true, ksp2: true },
    };

    const result = toggleGame(filters, 'ksp');
    expect(result.showGames.ksp).toBe(false);
    expect(result.showGames.ksp2).toBe(true);
  });

  it('should prevent all games from being unchecked', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: { ksp: false, ksp2: true },
    };

    // Try to turn off the last game
    const result = toggleGame(filters, 'ksp2');

    // Should check all except the one being turned off
    expect(result.showGames.ksp).toBe(true);
    expect(result.showGames.ksp2).toBe(false);
  });

  it('should toggle game back on', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: { ksp: false, ksp2: true },
    };

    const result = toggleGame(filters, 'ksp');
    expect(result.showGames.ksp).toBe(true);
    expect(result.showGames.ksp2).toBe(true);
  });
});

describe('setFilterId', () => {
  it('should set filter id', () => {
    const filters: FilterState = {
      filterId: null,
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = setFilterId(filters, 'test');
    expect(result.filterId).toBe('test');
  });

  it('should clear filter id', () => {
    const filters: FilterState = {
      filterId: 'test',
      showActive: true,
      showFrozen: true,
      showMeta: true,
      showNonmeta: true,
      showGames: {},
    };

    const result = setFilterId(filters, null);
    expect(result.filterId).toBeNull();
  });
});
