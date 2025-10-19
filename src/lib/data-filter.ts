import type { NetKANEntry, FilterState, FilterCounts } from '@/types/netkan';

export function filterNetKANs(
  data: NetKANEntry[],
  filters: FilterState
): NetKANEntry[] {
  let filtered = data;

  // Filter by text search
  if (filters.filterId) {
    const searchTerm = filters.filterId.toLowerCase();
    filtered = filtered.filter((row) => {
      return (
        row.id.toLowerCase().includes(searchTerm) ||
        (row.last_error && row.last_error.toLowerCase().includes(searchTerm)) ||
        (row.last_warnings && row.last_warnings.toLowerCase().includes(searchTerm))
      );
    });
  }

  filtered = filtered.filter((row) =>
    // Filter by game
    filters.showGames[row.game_id]
    // Filter by frozen/active
    && (row.frozen ? filters.showFrozen : filters.showActive)
    // Filter by meta/non-meta
    && (row.resources?.metanetkan ? filters.showMeta : filters.showNonmeta));

  return filtered;
}

export function sortNetKANs(
  data: NetKANEntry[],
  sortBy: string | null,
  sortDir: 'ASC' | 'DESC' | null
): NetKANEntry[] {
  if (!sortBy || !sortDir) {
    return data;
  }

  const sorted = [...data].sort((a, b) => {
    let aVal = '';
    let bVal = '';

    if (sortBy === 'last_error') {
      // Special handling for errors/warnings
      if (a.last_error) {
        if (b.last_error) {
          aVal = a.last_error;
          bVal = b.last_error;
        } else {
          return -1; // Errors sort to top
        }
      } else if (b.last_error) {
        return 1; // Errors sort to top
      } else if (a.last_warnings) {
        if (b.last_warnings) {
          aVal = a.last_warnings;
          bVal = b.last_warnings;
        } else {
          return -1; // Warnings sort above nothing
        }
      } else if (b.last_warnings) {
        return 1; // Warnings sort above nothing
      }
    } else {
      const aValue = a[sortBy as keyof NetKANEntry];
      const bValue = b[sortBy as keyof NetKANEntry];
      aVal = aValue && typeof aValue === 'string' ? aValue.toLowerCase() : '';
      bVal = bValue && typeof bValue === 'string' ? bValue.toLowerCase() : '';
    }

    let sortVal = 0;
    if (aVal > bVal) {
      sortVal = 1;
    } else if (aVal < bVal) {
      sortVal = -1;
    } else if (sortBy !== 'id') {
      // Secondary sort by id
      sortVal = a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
    }

    return sortDir === 'DESC' ? sortVal * -1 : sortVal;
  });

  return sorted;
}

export function calculateCounts(data: NetKANEntry[]): FilterCounts {
  const counts: FilterCounts = {
    activeCount: data.filter((row) => !row.frozen).length,
    frozenCount: data.filter((row) => row.frozen).length,
    metaCount: data.filter((row) => row.resources?.metanetkan).length,
    nonmetaCount: data.filter((row) => !row.resources?.metanetkan).length,
    gameCounts: {},
  };

  // Calculate game counts
  data.forEach((row) => {
    counts.gameCounts[row.game_id] = (counts.gameCounts[row.game_id] || 0) + 1;
  });

  return counts;
}
