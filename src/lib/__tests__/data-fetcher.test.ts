import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGameStatus, fetchAllGamesData } from '../data-fetcher';
import type { GameConfig } from '@/types/netkan';

describe('fetchGameStatus', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should fetch and parse JSON successfully', async () => {
    const mockData = { TestMod: { last_indexed: '2024-01-01' } };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const result = await fetchGameStatus('/status/test.json');

    expect(fetch).toHaveBeenCalledWith('/status/test.json');
    expect(result).toEqual(mockData);
  });

  it('should return empty object on fetch error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await fetchGameStatus('/status/test.json');

    expect(result).toEqual({});
    expect(console.error).toHaveBeenCalled();
  });

  it('should return empty object on non-ok response', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const result = await fetchGameStatus('/status/test.json');

    expect(result).toEqual({});
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle JSON parse errors', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const result = await fetchGameStatus('/status/test.json');

    expect(result).toEqual({});
    expect(console.error).toHaveBeenCalled();
  });
});

describe('fetchAllGamesData', () => {
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

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should fetch and combine data from multiple games', async () => {
    const kspData = {
      ModA: { frozen: false, last_indexed: '2024-01-01' },
      ModB: { frozen: true, last_indexed: '2024-01-02' },
    };
    const ksp2Data = {
      ModC: { frozen: false, last_indexed: '2024-01-03' },
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(kspData),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(ksp2Data),
      } as any);

    const result = await fetchAllGamesData(mockGames);

    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject({
      id: 'ModA',
      game_id: 'ksp',
      frozen: false,
      last_indexed: '2024-01-01',
      resources: {},
    });

    expect(result[1]).toMatchObject({
      id: 'ModB',
      game_id: 'ksp',
      frozen: true,
      last_indexed: '2024-01-02',
      resources: {},
    });

    expect(result[2]).toMatchObject({
      id: 'ModC',
      game_id: 'ksp2',
      frozen: false,
      last_indexed: '2024-01-03',
      resources: {},
    });
  });

  it('should handle empty game data', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as any);

    const result = await fetchAllGamesData(mockGames);

    expect(result).toEqual([]);
  });

  it('should handle fetch failures gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await fetchAllGamesData(mockGames);

    expect(result).toEqual([]);
  });

  it('should handle non-object values in game data', async () => {
    const gameData = {
      ModA: { frozen: false },
      ModB: null,
      ModC: 'string',
      ModD: { frozen: true },
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(gameData),
    } as any);

    const result = await fetchAllGamesData([mockGames[0]]);

    expect(result).toHaveLength(4);
    expect(result[0]).toMatchObject({ id: 'ModA', frozen: false });
    expect(result[1]).toMatchObject({ id: 'ModB', game_id: 'ksp' });
    expect(result[2]).toMatchObject({ id: 'ModC', game_id: 'ksp' });
    expect(result[3]).toMatchObject({ id: 'ModD', frozen: true });
  });

  it('should preserve all NetKAN entry fields', async () => {
    const gameData = {
      ModA: {
        frozen: true,
        last_inflated: '2024-01-01',
        last_downloaded: '2024-01-02',
        last_indexed: '2024-01-03',
        last_error: 'Some error',
        last_warnings: 'Some warning',
        resources: { metanetkan: 'http://example.com' },
      },
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(gameData),
    } as any);

    const result = await fetchAllGamesData([mockGames[0]]);

    expect(result[0]).toMatchObject({
      id: 'ModA',
      game_id: 'ksp',
      frozen: true,
      last_inflated: '2024-01-01',
      last_downloaded: '2024-01-02',
      last_indexed: '2024-01-03',
      last_error: 'Some error',
      last_warnings: 'Some warning',
      resources: { metanetkan: 'http://example.com' },
    });
  });
});
