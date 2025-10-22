import { useState, useRef, useEffect } from 'react';
import { Highlighted } from '@/components/Highlighted';
import { formatRelativeDate } from '@/lib/date';
import type { NetKANEntry, GameConfig } from '@/types/netkan';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NetKANMobileCardProps {
  entry: NetKANEntry;
  game: GameConfig;
  filterId: string | null;
  isEven: boolean;
}

export function NetKANMobileCard({
  entry,
  game,
  filterId,
  isEven,
}: NetKANMobileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const hasError = !!entry.last_error;
  const hasWarning = !entry.last_error && !!entry.last_warnings;

  // Smoothly scroll expanded content into view
  useEffect(() => {
    if (isExpanded && detailsRef.current) {
      // Wait for animation to complete before scrolling
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }, 300); // Wait for animation to complete (250ms + buffer)
    }
  }, [isExpanded]);

  return (
    <div
      className={`mobile-card ${isEven ? 'bg-background' : 'bg-muted'} ${
        hasError ? 'border-l-4 border-l-red-600 dark:border-l-red-400' : ''
      } ${
        hasWarning ? 'border-l-4 border-l-yellow-600 dark:border-l-yellow-400' : ''
      } ${isExpanded ? 'relative z-10' : 'relative z-0'}`}
    >
      {/* Collapsed view - always visible */}
      <div
        className="mobile-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${entry.id}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="text-sm font-medium text-primary truncate"
              style={entry.frozen ? { textDecoration: 'line-through' } : undefined}
            >
              <Highlighted content={entry.id} search={filterId} />
            </h3>
            {isExpanded ? (
              <ChevronUp className="flex-shrink-0 h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="flex-shrink-0 h-5 w-5 text-muted-foreground" />
            )}
          </div>

          {/* Status line - visible only when collapsed */}
          {!isExpanded && (
            <div className="flex items-start gap-2 text-xs">
              <div className="flex-1 min-w-0">
                {hasError && (
                  <div className="error-icon error-text text-xs truncate">
                    <Highlighted content={entry.last_error} search={filterId} />
                  </div>
                )}
                {hasWarning && (
                  <div className="warning-icon warning-text text-xs truncate">
                    <Highlighted content={entry.last_warnings} search={filterId} />
                  </div>
                )}
                {!hasError && !hasWarning && (
                  <span className="text-muted-foreground text-xs">No errors</span>
                )}
              </div>
              <span className="text-muted-foreground text-xs whitespace-nowrap flex-shrink-0">
                {formatRelativeDate(entry.last_indexed)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded view - shows on tap */}
      {isExpanded && (
        <div ref={detailsRef} className="mobile-card-details">
          {/* Full error/warning message if truncated */}
          {(hasError || hasWarning) && (
            <div className="mb-3">
              {hasError && (
                <div className="error-icon error-text text-xs">
                  <Highlighted content={entry.last_error} search={filterId} />
                </div>
              )}
              {hasWarning && (
                <div className="warning-icon warning-text text-xs">
                  <Highlighted content={entry.last_warnings} search={filterId} />
                </div>
              )}
            </div>
          )}

          {/* Dates grid */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
            <div>
              <div className="text-muted-foreground text-[10px]">Last Inflated</div>
              <div className="text-xs font-medium" title={entry.last_inflated || ''}>
                {formatRelativeDate(entry.last_inflated)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px]">Last Downloaded</div>
              <div className="text-xs font-medium" title={entry.last_downloaded || ''}>
                {formatRelativeDate(entry.last_downloaded)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px]">Last Indexed</div>
              <div className="text-xs font-medium" title={entry.last_indexed || ''}>
                {formatRelativeDate(entry.last_indexed)}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href={game.netkan(entry.id, entry.frozen)}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-card-link"
              onClick={(e) => e.stopPropagation()}
            >
              netkan
            </a>
            <a
              href={game.history(entry.id, entry.frozen)}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-card-link"
              onClick={(e) => e.stopPropagation()}
            >
              history
            </a>
            <a
              href={game.metadata(entry.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-card-link"
              onClick={(e) => e.stopPropagation()}
            >
              metadata
            </a>
            {entry.resources &&
              Object.entries(entry.resources)
                .filter(([key]) => !key.startsWith('x_'))
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-card-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {key}
                  </a>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
