import { useState, useEffect, useCallback } from 'react';
import type { GameConfig, NetKANEntry } from '@/types/netkan';
import { fetchAllGamesData } from '@/lib/data-fetcher';

export function useNetKANData(games: GameConfig[], pollInterval: number) {
  const [data, setData] = useState<NetKANEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const netkanData = await fetchAllGamesData(games);
    setData(netkanData);
    setIsLoading(false);
  }, [games]);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadData, pollInterval]);

  return { data, isLoading };
}
