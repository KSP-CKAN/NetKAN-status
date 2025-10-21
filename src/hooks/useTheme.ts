import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

// Pure functions for testing
export function getNextTheme(currentTheme: Theme): Theme {
  return currentTheme === 'light' ? 'dark' : 'light';
}

export function loadThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('darkTheme');
  return stored === 'true' ? 'dark' : 'light';
}

export function saveThemeToStorage(theme: Theme): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('darkTheme', theme === 'dark' ? 'true' : 'false');
}

export function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => loadThemeFromStorage());

  useEffect(() => {
    applyThemeToDOM(theme);
    saveThemeToStorage(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => getNextTheme(prev));
  };

  return { theme, toggleTheme };
}
