import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { debounce } from '@/lib/debounce';
import type { GameConfig, FilterCounts } from '@/types/netkan';

interface FilterControlsProps {
  games: GameConfig[];
  counts: FilterCounts;
  showActive: boolean;
  showFrozen: boolean;
  showMeta: boolean;
  showNonmeta: boolean;
  showGames: Record<string, boolean>;
  onFilterChange: (value: string) => void;
  onToggleActive: () => void;
  onToggleFrozen: () => void;
  onToggleMeta: () => void;
  onToggleNonmeta: () => void;
  onToggleGame: (gameId: string) => void;
}

export function FilterControls({
  games,
  counts,
  showActive,
  showFrozen,
  showMeta,
  showNonmeta,
  showGames,
  onFilterChange,
  onToggleActive,
  onToggleFrozen,
  onToggleMeta,
  onToggleNonmeta,
  onToggleGame,
}: FilterControlsProps) {
  const [hasSearchText, setHasSearchText] = useState(false);

  const debouncedFilter = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      e.target.value === '' || e.target.value.length > 3,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasSearchText(e.target.value.length > 0);
      onFilterChange(e.target.value);
    }
  );

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4 sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {games
          .slice()
          .map((game) => (
            <div key={game.id} className="flex items-center space-x-2">
              <Checkbox
                id={`game-${game.id}`}
                checked={showGames[game.id]}
                onCheckedChange={() => onToggleGame(game.id)}
              />
              <Label htmlFor={`game-${game.id}`} className="text-sm cursor-pointer">
                {counts.gameCounts[game.id] || 0} {game.name}
              </Label>
            </div>
          ))}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="toggle-meta"
            checked={showMeta}
            onCheckedChange={onToggleMeta}
          />
          <Label htmlFor="toggle-meta" className="text-sm cursor-pointer">
            {counts.metaCount} meta
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="toggle-nonmeta"
            checked={showNonmeta}
            onCheckedChange={onToggleNonmeta}
          />
          <Label htmlFor="toggle-nonmeta" className="text-sm cursor-pointer">
            {counts.nonmetaCount} non-meta
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="toggle-active"
            checked={showActive}
            onCheckedChange={onToggleActive}
          />
          <Label htmlFor="toggle-active" className="text-sm cursor-pointer">
            {counts.activeCount} active
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="toggle-frozen"
            checked={showFrozen}
            onCheckedChange={onToggleFrozen}
          />
          <Label htmlFor="toggle-frozen" className="text-sm cursor-pointer">
            {counts.frozenCount} frozen
          </Label>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Input
          type="text"
          placeholder="filter..."
          className="w-full pr-8"
          autoFocus
          onChange={debouncedFilter}
        />
        {hasSearchText && (
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.focus();
                input.value = '';
                setHasSearchText(false);
                onFilterChange('');
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
