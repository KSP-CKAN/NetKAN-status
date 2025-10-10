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

  return (
    <>
      {/* Desktop table view - hidden on mobile */}
      <div className="hidden sm:block h-full border rounded-md overflow-auto">
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
            {data.map((row, index) => {
              const game = getGame(row.game_id);
              if (!game) return null;

              return (
                <TableRow 
                  key={`${row.game_id}-${row.id}`} 
                  className={`table-row ${index % 2 === 1 ? 'bg-muted/30' : ''}`}
                >
                  <TableCell>
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
                  <TableCell title={row.last_inflated || ''}>
                    {formatRelativeDate(row.last_inflated)}
                  </TableCell>
                  <TableCell title={row.last_downloaded || ''}>
                    {formatRelativeDate(row.last_downloaded)}
                  </TableCell>
                  <TableCell title={row.last_indexed || ''}>
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view - shown only on mobile */}
      <div className="sm:hidden h-full overflow-auto">
        <div className="mobile-card-summary">
          <span className="error-text font-medium">{errorCount} Errors</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="warning-text font-medium">{warnCount} Warnings</span>
        </div>
        <div className="space-y-2">
          {data.map((row, index) => {
            const game = getGame(row.game_id);
            if (!game) return null;

            return (
              <NetKANMobileCard
                key={`${row.game_id}-${row.id}`}
                entry={row}
                game={game}
                filterId={filterId}
                isEven={index % 2 === 1}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
