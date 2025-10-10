export interface NetKANEntry {
  id: string;
  game_id: string;
  frozen?: boolean;
  last_inflated?: string;
  last_downloaded?: string;
  last_indexed?: string;
  last_error?: string;
  last_warnings?: string;
  resources: {
    metanetkan?: string;
    [key: string]: string | undefined;
  };
}

export interface GameConfig {
  id: string;
  name: string;
  status: string;
  netkan: (ident: string, frozen?: boolean) => string;
  history: (ident: string, frozen?: boolean) => string;
  metadata: (ident: string) => string;
}

export interface FilterState {
  filterId: string | null;
  showActive: boolean;
  showFrozen: boolean;
  showMeta: boolean;
  showNonmeta: boolean;
  showGames: Record<string, boolean>;
}

export interface SortState {
  sortBy: string | null;
  sortDir: 'ASC' | 'DESC' | null;
}

export interface FilterCounts {
  activeCount: number;
  frozenCount: number;
  metaCount: number;
  nonmetaCount: number;
  gameCounts: Record<string, number>;
}
