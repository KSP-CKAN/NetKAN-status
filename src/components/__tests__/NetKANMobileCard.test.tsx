import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NetKANMobileCard } from '../NetKANMobileCard';
import type { NetKANEntry, GameConfig } from '@/types/netkan';

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: mockScrollIntoView,
});

const mockGame: GameConfig = {
  id: 'ksp',
  name: 'KSP',
  status: '/status/netkan.json',
  netkan: (id: string) => `https://github.com/KSP-CKAN/NetKAN/blob/master/NetKAN/${id}.netkan`,
  history: (id: string) => `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${id}.netkan`,
  metadata: (id: string) => `https://github.com/KSP-CKAN/CKAN-meta/tree/master/${id}`,
};

const mockEntry: NetKANEntry = {
  id: 'ModuleManager',
  game_id: 'ksp',
  last_inflated: '2023-10-20T10:00:00Z',
  last_downloaded: '2023-10-20T09:30:00Z',
  last_indexed: '2023-10-20T10:30:00Z',
  resources: {
    homepage: 'https://example.com',
    repository: 'https://github.com/example/repo',
  },
};

const defaultProps = {
  entry: mockEntry,
  game: mockGame,
  filterId: null,
  isEven: true,
};

describe('NetKANMobileCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Font Size Improvements', () => {
    it('should render title with small font size', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const title = screen.getByText('ModuleManager');
      expect(title.closest('h3')).toHaveClass('text-sm', 'font-medium');
    });

    it('should render collapsed status with extra small font', () => {
      const entryWithError = {
        ...mockEntry,
        last_error: 'Build failed',
      };

      render(<NetKANMobileCard {...defaultProps} entry={entryWithError} />);

      const statusContainer = document.querySelector('.flex.items-start.gap-2.text-xs');
      expect(statusContainer).toBeInTheDocument();
    });

    it('should render expanded details with smaller fonts', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      // Expand the card
      const header = screen.getByRole('button');
      fireEvent.click(header);

      // Check date grid container uses text-xs
      const dateGrid = document.querySelector('.grid.grid-cols-2.gap-3.mb-3.text-xs');
      expect(dateGrid).toBeInTheDocument();

      // Check labels use text-[10px]
      const labels = document.querySelectorAll('.text-muted-foreground.text-\\[10px\\]');
      expect(labels.length).toBeGreaterThan(0);

      // Check values use text-xs font-medium
      const values = document.querySelectorAll('.text-xs.font-medium');
      expect(values.length).toBeGreaterThan(0);

      // Check links container uses text-xs
      const linksContainer = document.querySelector('.flex.flex-wrap.gap-2.text-xs');
      expect(linksContainer).toBeInTheDocument();
    });

    it('should render error messages with small font in expanded view', () => {
      const entryWithError = {
        ...mockEntry,
        last_error: 'Build failed: compilation error',
      };

      render(<NetKANMobileCard {...defaultProps} entry={entryWithError} />);

      // Expand the card
      const header = screen.getByRole('button');
      fireEvent.click(header);

      // Check expanded error message uses text-xs
      const errorMessage = document.querySelector('.error-icon.error-text.text-xs');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should render warning messages with small font in expanded view', () => {
      const entryWithWarning = {
        ...mockEntry,
        last_warnings: 'Deprecated API usage detected',
      };

      render(<NetKANMobileCard {...defaultProps} entry={entryWithWarning} />);

      // Expand the card
      const header = screen.getByRole('button');
      fireEvent.click(header);

      // Check expanded warning message uses text-xs
      const warningMessage = document.querySelector('.warning-icon.warning-text.text-xs');
      expect(warningMessage).toBeInTheDocument();
    });
  });

  describe('Expansion Behavior', () => {
    it('should start in collapsed state', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      // Check for collapsed state by looking for the button with proper aria-expanded
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Last Inflated')).not.toBeInTheDocument();
    });

    it('should expand when clicked', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const header = screen.getByRole('button');
      fireEvent.click(header);

      // Check for expanded state
      expect(header).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Last Inflated')).toBeInTheDocument();
    });

    it('should scroll expanded content into view', async () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const header = screen.getByRole('button');
      fireEvent.click(header);

      // Wait for the scroll effect to trigger
      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }, { timeout: 400 });
    });

    it('should collapse when clicked again', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const header = screen.getByRole('button');

      // Expand
      fireEvent.click(header);
      expect(screen.getByText('Last Inflated')).toBeInTheDocument();

      // Collapse
      fireEvent.click(header);
      expect(screen.queryByText('Last Inflated')).not.toBeInTheDocument();
    });

    it('should not scroll when collapsing', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const header = screen.getByRole('button');

      // Expand
      fireEvent.click(header);
      vi.clearAllMocks();

      // Collapse
      fireEvent.click(header);

      // Should not call scrollIntoView again
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('Card Styling', () => {
    it('should apply correct background for even rows', () => {
      const { container } = render(<NetKANMobileCard {...defaultProps} isEven={true} />);

      const card = container.querySelector('.mobile-card');
      expect(card).toHaveClass('bg-background');
    });

    it('should apply correct background for odd rows', () => {
      const { container } = render(<NetKANMobileCard {...defaultProps} isEven={false} />);

      const card = container.querySelector('.mobile-card');
      expect(card).toHaveClass('bg-muted');
    });

    it('should apply error border for entries with errors', () => {
      const entryWithError = {
        ...mockEntry,
        last_error: 'Build failed',
      };

      const { container } = render(<NetKANMobileCard {...defaultProps} entry={entryWithError} />);

      const card = container.querySelector('.mobile-card');
      expect(card).toHaveClass('border-l-4', 'border-l-red-600', 'dark:border-l-red-400');
    });

    it('should apply warning border for entries with warnings', () => {
      const entryWithWarning = {
        ...mockEntry,
        last_warnings: 'Deprecated API',
      };

      const { container } = render(<NetKANMobileCard {...defaultProps} entry={entryWithWarning} />);

      const card = container.querySelector('.mobile-card');
      expect(card).toHaveClass('border-l-4', 'border-l-yellow-600', 'dark:border-l-yellow-400');
    });
  });

  describe('Link Functionality', () => {
    it('should render resource links with primary styling', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      // Expand to see links
      const header = screen.getByRole('button');
      fireEvent.click(header);

      const links = document.querySelectorAll('.mobile-card-link');
      expect(links.length).toBeGreaterThan(0);

      // Links should have the improved contrast styling
      links.forEach(link => {
        expect(link).toHaveClass('mobile-card-link');
      });
    });

    it('should stop propagation on link clicks', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      // Expand to see links
      const header = screen.getByRole('button');
      fireEvent.click(header);

      const netkanLink = screen.getByText('netkan').closest('a');
      expect(netkanLink).toBeInTheDocument();

      // Click the link - this should not collapse the card
      fireEvent.click(netkanLink!);

      // Card should still be expanded
      expect(screen.getByText('Last Inflated')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button semantics for expansion', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should provide proper link targets', () => {
      render(<NetKANMobileCard {...defaultProps} />);

      // Expand to see links
      const header = screen.getByRole('button');
      fireEvent.click(header);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});
