import { useState } from 'react';
import type { FilterState, GameConfig } from '@/types/netkan';

export function createInitialFilters(games: GameConfig[]): FilterState {
  return {
    filterId: null,
    showActive: true,
    showFrozen: false,
    showMeta: true,
    showNonmeta: true,
    showGames: Object.fromEntries(games.map((game) => [game.id, true])),
  };
}

export function toggleActive(filters: FilterState): FilterState {
  if (!filters.showFrozen && filters.showActive) {
    return { ...filters, showActive: false, showFrozen: true };
  }
  return { ...filters, showActive: !filters.showActive };
}

export function toggleFrozen(filters: FilterState): FilterState {
  if (!filters.showActive && filters.showFrozen) {
    return { ...filters, showFrozen: false, showActive: true };
  }
  return { ...filters, showFrozen: !filters.showFrozen };
}

export function toggleMeta(filters: FilterState): FilterState {
  if (!filters.showNonmeta && filters.showMeta) {
    return { ...filters, showMeta: false, showNonmeta: true };
  }
  return { ...filters, showMeta: !filters.showMeta };
}

export function toggleNonmeta(filters: FilterState): FilterState {
  if (!filters.showMeta && filters.showNonmeta) {
    return { ...filters, showNonmeta: false, showMeta: true };
  }
  return { ...filters, showNonmeta: !filters.showNonmeta };
}

export function toggleGame(filters: FilterState, gameId: string): FilterState {
  const newShowGames = { ...filters.showGames };
  newShowGames[gameId] = !newShowGames[gameId];

  // If all games are unchecked, check all except the one that was just unchecked
  if (Object.values(newShowGames).every((v) => !v)) {
    Object.keys(newShowGames).forEach((id) => {
      newShowGames[id] = id !== gameId;
    });
  }

  return { ...filters, showGames: newShowGames };
}

export function setFilterId(filters: FilterState, filterId: string | null): FilterState {
  return { ...filters, filterId };
}

export function useFilters(games: GameConfig[]) {
  const [filters, setFilters] = useState<FilterState>(() =>
    createInitialFilters(games)
  );

  const handleToggleActive = () => setFilters(toggleActive);
  const handleToggleFrozen = () => setFilters(toggleFrozen);
  const handleToggleMeta = () => setFilters(toggleMeta);
  const handleToggleNonmeta = () => setFilters(toggleNonmeta);
  const handleToggleGame = (gameId: string) => setFilters((f) => toggleGame(f, gameId));
  const handleFilterChange = (value: string) =>
    setFilters((f) => setFilterId(f, value || null));

  return {
    filters,
    handleToggleActive,
    handleToggleFrozen,
    handleToggleMeta,
    handleToggleNonmeta,
    handleToggleGame,
    handleFilterChange,
  };
}
