import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterControls } from '../FilterControls';
import type { GameConfig, FilterCounts } from '@/types/netkan';

const mockGames: GameConfig[] = [
  {
    id: 'ksp',
    name: 'KSP',
    status: '/status/netkan.json',
    netkan: () => '',
    history: () => '',
    metadata: () => '',
  },
  {
    id: 'ksp2',
    name: 'KSP2',
    status: '/status/netkan-ksp2.json',
    netkan: () => '',
    history: () => '',
    metadata: () => '',
  },
];

const mockCounts: FilterCounts = {
  activeCount: 100,
  frozenCount: 20,
  metaCount: 15,
  nonmetaCount: 105,
  gameCounts: { ksp: 110, ksp2: 10 },
};

const defaultProps = {
  games: mockGames,
  counts: mockCounts,
  showActive: true,
  showFrozen: false,
  showMeta: true,
  showNonmeta: true,
  showGames: { ksp: true, ksp2: true },
  onFilterChange: vi.fn(),
  onToggleActive: vi.fn(),
  onToggleFrozen: vi.fn(),
  onToggleMeta: vi.fn(),
  onToggleNonmeta: vi.fn(),
  onToggleGame: vi.fn(),
};

describe('FilterControls', () => {
  it('should render without crashing', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByPlaceholderText('filter...')).toBeInTheDocument();
  });

  it('should display game counts correctly', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText(/110 KSP/)).toBeInTheDocument();
    expect(screen.getByText(/10 KSP2/)).toBeInTheDocument();
  });

  it('should display meta/nonmeta counts', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText(/15 meta/)).toBeInTheDocument();
    expect(screen.getByText(/105 non-meta/)).toBeInTheDocument();
  });

  it('should display active/frozen counts', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText(/100 active/)).toBeInTheDocument();
    expect(screen.getByText(/20 frozen/)).toBeInTheDocument();
  });

  it('should render all checkboxes', () => {
    const { container } = render(<FilterControls {...defaultProps} />);
    const checkboxes = container.querySelectorAll('button[role="checkbox"]');
    // 2 games + meta + nonmeta + active + frozen = 6 checkboxes
    expect(checkboxes.length).toBe(6);
  });

  it('should render search input', () => {
    render(<FilterControls {...defaultProps} />);
    const input = screen.getByPlaceholderText('filter...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should handle zero counts', () => {
    const zeroCounts: FilterCounts = {
      activeCount: 0,
      frozenCount: 0,
      metaCount: 0,
      nonmetaCount: 0,
      gameCounts: { ksp: 0, ksp2: 0 },
    };

    render(<FilterControls {...defaultProps} counts={zeroCounts} />);
    expect(screen.getByText(/^0 KSP$/)).toBeInTheDocument();
    expect(screen.getByText(/^0 active$/)).toBeInTheDocument();
  });

  it('should not show clear button initially', () => {
    render(<FilterControls {...defaultProps} />);
    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should show clear button when text is entered', () => {
    render(<FilterControls {...defaultProps} />);
    const input = screen.getByPlaceholderText('filter...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', () => {
    render(<FilterControls {...defaultProps} />);
    const input = screen.getByPlaceholderText('filter...') as HTMLInputElement;

    // Enter text to show clear button
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    // Input should be cleared
    expect(input.value).toBe('');
  });

  it('should call onFilterChange with empty string when clear button is clicked', () => {
    const onFilterChange = vi.fn();
    render(<FilterControls {...defaultProps} onFilterChange={onFilterChange} />);
    const input = screen.getByPlaceholderText('filter...') as HTMLInputElement;

    // Enter text
    fireEvent.change(input, { target: { value: 'test' } });

    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    // Should call onFilterChange with empty string
    expect(onFilterChange).toHaveBeenCalledWith('');
  });

  it('should hide clear button after clearing', () => {
    render(<FilterControls {...defaultProps} />);
    const input = screen.getByPlaceholderText('filter...') as HTMLInputElement;

    // Enter text
    fireEvent.change(input, { target: { value: 'test' } });

    // Clear button should be visible
    let clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearButton);

    // Clear button should be hidden
    clearButton = screen.queryByRole('button', { name: /clear search/i }) as HTMLButtonElement;
    expect(clearButton).not.toBeInTheDocument();
  });
});
