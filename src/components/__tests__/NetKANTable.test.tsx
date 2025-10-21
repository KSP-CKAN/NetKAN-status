import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetKANTable } from '../NetKANTable';
import type { NetKANEntry, GameConfig } from '@/types/netkan';

// Mock the virtual scroller
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getTotalSize: () => 1000,
    getVirtualItems: () => [
      {
        index: 0,
        start: 0,
        size: 120,
        end: 120,
        key: '0',
      },
      {
        index: 1,
        start: 120,
        size: 120,
        end: 240,
        key: '1',
      },
    ],
    measureElement: vi.fn(),
  }),
}));

const mockGames: GameConfig[] = [
  {
    id: 'ksp',
    name: 'KSP',
    status: '/status/netkan.json',
    netkan: (id: string) => `https://github.com/KSP-CKAN/NetKAN/blob/master/NetKAN/${id}.netkan`,
    history: (id: string) => `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${id}.netkan`,
    metadata: (id: string) => `https://github.com/KSP-CKAN/CKAN-meta/tree/master/${id}`,
  },
  {
    id: 'ksp2',
    name: 'KSP2',
    status: '/status/netkan-ksp2.json',
    netkan: (id: string) => `https://github.com/KSP-CKAN/NetKAN/blob/master/NetKAN/${id}.netkan`,
    history: (id: string) => `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${id}.netkan`,
    metadata: (id: string) => `https://github.com/KSP-CKAN/CKAN-meta/tree/master/${id}`,
  },
];

const mockData: NetKANEntry[] = [
  {
    id: 'ModuleManager',
    game_id: 'ksp',
    last_inflated: '2023-10-20T10:00:00Z',
    last_downloaded: '2023-10-20T09:30:00Z',
    last_indexed: '2023-10-20T10:30:00Z',
    resources: {},
  },
  {
    id: 'KerbalEngineerRedux',
    game_id: 'ksp',
    last_inflated: '2023-10-19T10:00:00Z',
    last_downloaded: '2023-10-19T09:30:00Z',
    last_indexed: '2023-10-19T10:30:00Z',
    last_error: 'Build failed',
    resources: {},
  },
];

const defaultProps = {
  data: mockData,
  games: mockGames,
  filterId: null,
  sortBy: null,
  sortDir: null as 'ASC' | 'DESC' | null,
  onSort: vi.fn(),
};

describe('NetKANTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Sort Controls', () => {
    it('should render mobile sort controls only on mobile view', () => {
      render(<NetKANTable {...defaultProps} />);

      // Look for the sort select in mobile view
      const mobileContainer = document.querySelector('.sm\\:hidden');
      expect(mobileContainer).toBeInTheDocument();

      // The select should be inside the mobile container
      const sortSelect = mobileContainer?.querySelector('select');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should display correct sort options', () => {
      render(<NetKANTable {...defaultProps} />);

      const sortSelect = screen.getByRole('combobox');
      const options = sortSelect.querySelectorAll('option');

      expect(options).toHaveLength(6); // Including placeholder
      expect(screen.getByRole('option', { name: 'Sort by...' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ID' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Last Inflated' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Last Downloaded' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Last Indexed' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Errors/Warnings' })).toBeInTheDocument();
    });

    it('should call onSort when sort option is selected', () => {
      const onSort = vi.fn();
      render(<NetKANTable {...defaultProps} onSort={onSort} />);

      const sortSelect = screen.getByRole('combobox');
      fireEvent.change(sortSelect, { target: { value: 'id' } });

      expect(onSort).toHaveBeenCalledWith('id');
    });

    it('should display current sort selection', () => {
      render(<NetKANTable {...defaultProps} sortBy="last_indexed" />);

      const sortSelect = screen.getByRole('combobox') as HTMLSelectElement;
      expect(sortSelect.value).toBe('last_indexed');
    });

    it('should show sort direction button with correct icon', () => {
      render(<NetKANTable {...defaultProps} sortBy="id" sortDir="ASC" />);

      const directionButton = screen.getByRole('button', { name: /sort descending/i });
      expect(directionButton).toBeInTheDocument();
      expect(directionButton).not.toBeDisabled();
    });

    it('should disable direction button when no sort column selected', () => {
      render(<NetKANTable {...defaultProps} sortBy={null} sortDir={null} />);

      const directionButton = screen.getByRole('button', { name: /select a column to sort/i });
      expect(directionButton).toBeDisabled();
    });

    it('should call onSort when direction button is clicked', () => {
      const onSort = vi.fn();
      render(<NetKANTable {...defaultProps} sortBy="id" sortDir="ASC" onSort={onSort} />);

      const directionButton = screen.getByRole('button', { name: /sort descending/i });
      fireEvent.click(directionButton);

      expect(onSort).toHaveBeenCalledWith('id');
    });

    it('should display correct tooltip for direction button', () => {
      const { rerender } = render(<NetKANTable {...defaultProps} sortBy="id" sortDir="ASC" />);

      let directionButton = screen.getByRole('button', { name: /sort descending/i });
      expect(directionButton).toHaveAttribute('title', 'Sort descending');

      rerender(<NetKANTable {...defaultProps} sortBy="id" sortDir="DESC" />);

      directionButton = screen.getByRole('button', { name: /sort ascending/i });
      expect(directionButton).toHaveAttribute('title', 'Sort ascending');
    });
  });

  describe('Mobile Summary', () => {
    it('should display error and warning counts in mobile summary', () => {
      render(<NetKANTable {...defaultProps} />);

      // Look specifically in the mobile summary section
      const mobileSummary = document.querySelector('.mobile-card-summary');
      expect(mobileSummary).toBeInTheDocument();
      expect(mobileSummary).toHaveTextContent('1 Errors');
      expect(mobileSummary).toHaveTextContent('0 Warnings');
    });

    it('should calculate correct counts for data with warnings', () => {
      const dataWithWarnings: NetKANEntry[] = [
        ...mockData,
        {
          id: 'TestMod',
          game_id: 'ksp',
          last_inflated: '2023-10-20T10:00:00Z',
          last_downloaded: '2023-10-20T09:30:00Z',
          last_indexed: '2023-10-20T10:30:00Z',
          last_warnings: 'Some warning',
          resources: {},
        },
      ];

      render(<NetKANTable {...defaultProps} data={dataWithWarnings} />);

      // Look specifically in the mobile summary section
      const mobileSummary = document.querySelector('.mobile-card-summary');
      expect(mobileSummary).toBeInTheDocument();
      expect(mobileSummary).toHaveTextContent('1 Errors');
      expect(mobileSummary).toHaveTextContent('1 Warnings');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for sort controls', () => {
      render(<NetKANTable {...defaultProps} />);

      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();

      // Find the sort direction button specifically (not the mobile card buttons)
      const directionButton = screen.getByRole('button', { name: /select a column to sort/i });
      expect(directionButton).toHaveAttribute('title');
    });

    it('should support keyboard navigation in sort select', () => {
      render(<NetKANTable {...defaultProps} />);

      const sortSelect = screen.getByRole('combobox');
      sortSelect.focus();

      expect(sortSelect).toHaveFocus();
    });
  });

  describe('Integration with existing functionality', () => {
    it('should not affect desktop table view', () => {
      render(<NetKANTable {...defaultProps} />);

      // Desktop table should still exist
      const desktopTable = document.querySelector('.hidden.sm\\:block');
      expect(desktopTable).toBeInTheDocument();

      // Desktop headers should still be clickable
      const desktopHeaders = desktopTable?.querySelectorAll('[role="columnheader"], .cursor-pointer');
      expect(desktopHeaders?.length).toBeGreaterThan(0);
    });

    it('should work correctly when filterId is provided', () => {
      render(<NetKANTable {...defaultProps} filterId="test" />);

      // Should still render sort controls
      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();
    });
  });
});
