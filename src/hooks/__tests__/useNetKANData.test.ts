import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNetKANData } from '../useNetKANData';
import * as dataFetcher from '@/lib/data-fetcher';
import type { GameConfig, NetKANEntry } from '@/types/netkan';

vi.mock('@/lib/data-fetcher');

const mockGames: GameConfig[] = [
  {
    id: 'ksp',
    name: 'KSP',
    status: '/status/netkan.json',
    netkan: () => '',
    history: () => '',
    metadata: () => '',
  },
];

const mockData: NetKANEntry[] = [
  {
    id: 'TestMod',
    game_id: 'ksp',
    frozen: false,
    last_indexed: '2024-01-01',
    resources: {},
  },
];

describe('useNetKANData', () => {
  beforeEach(() => {
    vi.spyOn(dataFetcher, 'fetchAllGamesData').mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with loading state', async () => {
    const { result, unmount } = renderHook(() => useNetKANData(mockGames, 1000));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for the hook to complete its async operations
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    unmount();
  });

  it('should load data and set loading to false', async () => {
    vi.spyOn(dataFetcher, 'fetchAllGamesData').mockResolvedValue(mockData);

    const { result, unmount } = renderHook(() => useNetKANData(mockGames, 1000));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.data).toEqual(mockData);
    unmount();
  });

  it('should call fetchAllGamesData with games', async () => {
    const fetchSpy = vi.spyOn(dataFetcher, 'fetchAllGamesData').mockResolvedValue(mockData);

    const { result, unmount } = renderHook(() => useNetKANData(mockGames, 1000));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(mockGames);
    }, { timeout: 3000 });

    // Wait for hook to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    unmount();
  });
});
