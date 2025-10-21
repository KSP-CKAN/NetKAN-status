import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Highlighted } from '@/components/Highlighted';
import { NetKANMobileCard } from '@/components/NetKANMobileCard';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatRelativeDate } from '@/lib/date';
import type { NetKANEntry, GameConfig } from '@/types/netkan';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface NetKANTableProps {
  data: NetKANEntry[];
  games: GameConfig[];
  filterId: string | null;
  sortBy: string | null;
  sortDir: 'ASC' | 'DESC' | null;
  onSort: (column: string) => void;
}

export function NetKANTable({
  data,
  games,
  filterId,
  sortBy,
  sortDir,
  onSort,
}: NetKANTableProps) {
  const getGame = (gameId: string) => games.find((g) => g.id === gameId);

  const sortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDir === 'DESC' ? (
      <ArrowDown className="inline h-3 w-3 ml-1" />
    ) : (
      <ArrowUp className="inline h-3 w-3 ml-1" />
    );
  };

  const errorCount = data.filter((r) => r.last_error).length;
  const warnCount = data.filter((r) => !r.last_error && r.last_warnings).length;

  // Desktop table virtualizer
  const desktopParentRef = useRef<HTMLDivElement>(null);
  const desktopVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => desktopParentRef.current,
    estimateSize: () => 80,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  // Mobile card virtualizer
  const mobileParentRef = useRef<HTMLDivElement>(null);
  const mobileVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  return (
    <>
      {/* Desktop table view - hidden on mobile */}
      <div ref={desktopParentRef} className="hidden sm:block h-full border rounded-md overflow-auto">
        <div className="w-full">
          {/* Header - sticky */}
          <div
            className="grid sticky top-0 z-10 bg-background border-b"
            style={{ gridTemplateColumns: '16rem 8rem 8rem 8rem 1fr' }}
          >
            <div
              className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer flex items-center"
              onClick={() => onSort('id')}
            >
              NetKAN {sortIcon('id')}
            </div>
            <div
              className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer flex items-center"
              onClick={() => onSort('last_inflated')}
            >
              Last Inflated {sortIcon('last_inflated')}
            </div>
            <div
              className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer flex items-center"
              onClick={() => onSort('last_downloaded')}
            >
              Last Downloaded {sortIcon('last_downloaded')}
            </div>
            <div
              className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer flex items-center"
              onClick={() => onSort('last_indexed')}
            >
              Last Indexed {sortIcon('last_indexed')}
            </div>
            <div
              className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer flex items-center"
              onClick={() => onSort('last_error')}
            >
              <span className="error-text">{errorCount} Errors</span> /{' '}
              <span className="warning-text">{warnCount} Warnings</span>{' '}
              {sortIcon('last_error')}
            </div>
          </div>

          {/* Virtualized rows container */}
          <div
            className="relative"
            style={{ height: `${desktopVirtualizer.getTotalSize()}px` }}
          >
            {desktopVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = data[virtualRow.index];
              const game = getGame(row.game_id);
              if (!game) return null;

              return (
                <div
                  key={`${row.game_id}-${row.id}`}
                  data-index={virtualRow.index}
                  ref={desktopVirtualizer.measureElement}
                  className={`grid table-row border-b min-h-[80px] transition-colors hover:bg-muted/50 ${
                    virtualRow.index % 2 === 1 ? 'bg-muted' : 'bg-background'
                  }`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    gridTemplateColumns: '16rem 8rem 8rem 8rem 1fr',
                  }}
                >
                  {/* NetKAN Column */}
                  <div className="p-4 align-middle break-words overflow-wrap-anywhere">
                    <a
                      href={game.netkan(row.id, row.frozen)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      style={
                        row.frozen ? { textDecoration: 'line-through' } : undefined
                      }
                    >
                      <Highlighted
                        content={row.id}
                        search={filterId}
                      />
                    </a>
                    <div className="module-menu text-xs text-muted-foreground mt-1 break-words">
                      <a
                        href={game.history(row.id, row.frozen)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        history
                      </a>
                      {' | '}
                      <a
                        href={game.metadata(row.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        metadata
                      </a>
                      {row.resources &&
                        Object.entries(row.resources)
                          .filter(([key]) => !key.startsWith('x_'))
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([key, url]) => (
                            <span key={key} className="break-words">
                              {' | '}
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline break-all"
                              >
                                {key}
                              </a>
                            </span>
                          ))}
                    </div>
                  </div>

                  {/* Last Inflated Column */}
                  <div className="p-4 align-middle" title={row.last_inflated || ''}>
                    {formatRelativeDate(row.last_inflated)}
                  </div>

                  {/* Last Downloaded Column */}
                  <div className="p-4 align-middle" title={row.last_downloaded || ''}>
                    {formatRelativeDate(row.last_downloaded)}
                  </div>

                  {/* Last Indexed Column */}
                  <div className="p-4 align-middle" title={row.last_indexed || ''}>
                    {formatRelativeDate(row.last_indexed)}
                  </div>

                  {/* Error/Warning Column */}
                  <div className="p-4 align-middle break-words">
                    {row.last_error && (
                      <div className="error-icon error-text whitespace-normal break-words">
                        <Highlighted
                          content={row.last_error}
                          search={filterId}
                        />
                      </div>
                    )}
                    {!row.last_error && row.last_warnings && (
                      <div className="warning-icon warning-text whitespace-normal break-words">
                        <Highlighted
                          content={row.last_warnings}
                          search={filterId}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile card view - shown only on mobile */}
      <div ref={mobileParentRef} className="sm:hidden h-full overflow-auto">
        {/* Mobile sort controls */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <Select
            value={sortBy || ''}
            onChange={(e) => onSort(e.target.value)}
            className="flex-1 h-9 text-sm"
          >
            <option value="" disabled>Sort by...</option>
            <option value="id">ID</option>
            <option value="last_inflated">Last Inflated</option>
            <option value="last_downloaded">Last Downloaded</option>
            <option value="last_indexed">Last Indexed</option>
            <option value="last_error">Errors/Warnings</option>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sortBy && onSort(sortBy)}
            className="h-9 w-9 p-0"
            disabled={!sortBy}
            title={!sortBy ? 'Select a column to sort' : sortDir === 'ASC' ? 'Sort descending' : 'Sort ascending'}
          >
            {!sortBy ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : sortDir === 'ASC' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mobile-card-summary">
          <span className="error-text font-medium">{errorCount} Errors</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="warning-text font-medium">{warnCount} Warnings</span>
        </div>
        <div
          className="relative"
          style={{ height: `${mobileVirtualizer.getTotalSize()}px` }}
        >
          {mobileVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data[virtualRow.index];
            const game = getGame(row.game_id);
            if (!game) return null;

            return (
              <div
                key={`${row.game_id}-${row.id}`}
                data-index={virtualRow.index}
                ref={mobileVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <NetKANMobileCard
                  entry={row}
                  game={game}
                  filterId={filterId}
                  isEven={virtualRow.index % 2 === 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
