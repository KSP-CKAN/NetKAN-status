import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FilterControls } from '@/components/FilterControls';
import { NetKANTable } from '@/components/NetKANTable';
import { useTheme } from '@/hooks/useTheme';
import { useNetKANData } from '@/hooks/useNetKANData';
import { useFilters } from '@/hooks/useFilters';
import { games } from '@/lib/game-config';
import { filterNetKANs, sortNetKANs, calculateCounts } from '@/lib/data-filter';

const POLL_INTERVAL = 300000; // 5 minutes

function App() {
  const { theme, toggleTheme } = useTheme();
  const { data, isLoading } = useNetKANData(games, POLL_INTERVAL);
  const {
    filters,
    handleToggleActive,
    handleToggleFrozen,
    handleToggleMeta,
    handleToggleNonmeta,
    handleToggleGame,
    handleFilterChange,
  } = useFilters(games);

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC' | null>(null);

  // Auto-sort on first data load
  useEffect(() => {
    if (data.length > 0 && sortBy === null) {
      const hasActiveErrors = data.some((row) => row.last_error && !row.frozen);
      if (hasActiveErrors) {
        setSortBy('last_error');
        setSortDir('ASC');
      } else {
        setSortBy('last_indexed');
        setSortDir('DESC');
      }
    }
  });

  const filteredData = filterNetKANs(data, filters);
  const sortedData = sortNetKANs(filteredData, sortBy, sortDir);
  const counts = calculateCounts(data);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortDir(column === 'id' || column === 'last_error' ? 'ASC' : 'DESC');
    }
  };

  return (
    <div className="h-screen flex flex-col p-3 sm:p-5 overflow-hidden">
      <div className="max-w-[2000px] mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="/favicon.ico" alt="" className="w-12 h-12 sm:w-16 sm:h-16" />
            <h1 className="text-xl sm:text-2xl font-semibold">NetKANs Indexed</h1>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="flex-shrink-0">
          <FilterControls
            games={games}
            counts={counts}
            showActive={filters.showActive}
            showFrozen={filters.showFrozen}
            showMeta={filters.showMeta}
            showNonmeta={filters.showNonmeta}
            showGames={filters.showGames}
            onFilterChange={handleFilterChange}
            onToggleActive={handleToggleActive}
            onToggleFrozen={handleToggleFrozen}
            onToggleMeta={handleToggleMeta}
            onToggleNonmeta={handleToggleNonmeta}
            onToggleGame={handleToggleGame}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground flex-1">
            Loading NetKAN data...
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <NetKANTable
              data={sortedData}
              games={games}
              filterId={filters.filterId}
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
