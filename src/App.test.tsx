import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as useNetKANDataModule from '@/hooks/useNetKANData';
import * as useThemeModule from '@/hooks/useTheme';

vi.mock('@/hooks/useNetKANData');
vi.mock('@/hooks/useTheme');

describe('App', () => {
  it('should render without crashing', () => {
    vi.spyOn(useNetKANDataModule, 'useNetKANData').mockReturnValue({
      data: [],
      isLoading: false,
    });
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<App />);
    expect(screen.getByText(/NetKANs Indexed/i)).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    vi.spyOn(useNetKANDataModule, 'useNetKANData').mockReturnValue({
      data: [],
      isLoading: true,
    });
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<App />);
    expect(screen.getByText(/Loading NetKAN data/i)).toBeInTheDocument();
  });

  it('should render with data', () => {
    vi.spyOn(useNetKANDataModule, 'useNetKANData').mockReturnValue({
      data: [
        {
          id: 'TestMod',
          game_id: 'ksp',
          frozen: false,
          last_indexed: '2024-01-01',
          resources: {},
        },
      ],
      isLoading: false,
    });
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<App />);
    expect(screen.getByText(/NetKANs Indexed/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading NetKAN data/i)).not.toBeInTheDocument();
  });
});
