import type { GameConfig, NetKANEntry } from '@/types/netkan';

export async function fetchGameStatus(
  url: string
): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return {};
  }
}

export async function fetchAllGamesData(
  games: GameConfig[]
): Promise<NetKANEntry[]> {
  const allData = await Promise.all(
    games.map(async (game) => ({
      game_id: game.id,
      data: await fetchGameStatus(game.status),
    }))
  );

  const netkanEntries: NetKANEntry[] = allData.flatMap(({ game_id, data }) =>
    Object.entries(data).map(([key, val]) => ({
      game_id,
      id: key,
      resources: {},
      ...(val && typeof val === 'object' ? (val as Partial<NetKANEntry>) : {}),
    }))
  );

  return netkanEntries;
}
