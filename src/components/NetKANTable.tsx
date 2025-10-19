import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Highlighted } from '@/components/Highlighted';
import { NetKANMobileCard } from '@/components/NetKANMobileCard';
import { formatRelativeDate } from '@/lib/date';
import type { NetKANEntry, GameConfig } from '@/types/netkan';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
  });

  // Mobile card virtualizer
  const mobileParentRef = useRef<HTMLDivElement>(null);
  const mobileVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  return (
    <>
      {/* Desktop table view - hidden on mobile */}
      <div ref={desktopParentRef} className="hidden sm:block h-full border rounded-md overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead
                className="cursor-pointer w-64"
                onClick={() => onSort('id')}
              >
                NetKAN {sortIcon('id')}
              </TableHead>
              <TableHead
                className="cursor-pointer w-32"
                onClick={() => onSort('last_inflated')}
              >
                Last Inflated {sortIcon('last_inflated')}
              </TableHead>
              <TableHead
                className="cursor-pointer w-32"
                onClick={() => onSort('last_downloaded')}
              >
                Last Downloaded {sortIcon('last_downloaded')}
              </TableHead>
              <TableHead
                className="cursor-pointer w-32"
                onClick={() => onSort('last_indexed')}
              >
                Last Indexed {sortIcon('last_indexed')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort('last_error')}
              >
                <span className="error-text">{errorCount} Errors</span> /{' '}
                <span className="warning-text">{warnCount} Warnings</span>{' '}
                {sortIcon('last_error')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr style={{ height: `${desktopVirtualizer.getTotalSize()}px` }}>
              <td style={{ position: 'relative', width: '100%' }}>
                {desktopVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = data[virtualRow.index];
                  const game = getGame(row.game_id);
                  if (!game) return null;

                  return (
                    <div
                      key={`${row.game_id}-${row.id}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <table style={{ width: '100%', tableLayout: 'fixed' }}>
                        <tbody>
                          <TableRow
                            className={`table-row ${virtualRow.index % 2 === 1 ? 'bg-muted/30' : ''}`}
                          >
                            <TableCell style={{ width: '16rem' }}>
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
                              <div className="module-menu text-xs text-muted-foreground mt-1">
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
                                      <span key={key}>
                                        {' | '}
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:underline"
                                        >
                                          {key}
                                        </a>
                                      </span>
                                    ))}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '8rem' }} title={row.last_inflated || ''}>
                              {formatRelativeDate(row.last_inflated)}
                            </TableCell>
                            <TableCell style={{ width: '8rem' }} title={row.last_downloaded || ''}>
                              {formatRelativeDate(row.last_downloaded)}
                            </TableCell>
                            <TableCell style={{ width: '8rem' }} title={row.last_indexed || ''}>
                              {formatRelativeDate(row.last_indexed)}
                            </TableCell>
                            <TableCell>
                              {row.last_error && (
                                <div className="error-icon error-text">
                                  <Highlighted
                                    content={row.last_error}
                                    search={filterId}
                                  />
                                </div>
                              )}
                              {!row.last_error && row.last_warnings && (
                                <div className="warning-icon warning-text">
                                  <Highlighted
                                    content={row.last_warnings}
                                    search={filterId}
                                  />
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </td>
            </tr>
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view - shown only on mobile */}
      <div ref={mobileParentRef} className="sm:hidden h-full overflow-auto">
        <div className="mobile-card-summary">
          <span className="error-text font-medium">{errorCount} Errors</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="warning-text font-medium">{warnCount} Warnings</span>
        </div>
        <div
          className="space-y-2 relative"
          style={{ height: `${mobileVirtualizer.getTotalSize()}px` }}
        >
          {mobileVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data[virtualRow.index];
            const game = getGame(row.game_id);
            if (!game) return null;

            return (
              <div
                key={`${row.game_id}-${row.id}`}
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
                  isEven={virtualRow.index % 2 === 1}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
