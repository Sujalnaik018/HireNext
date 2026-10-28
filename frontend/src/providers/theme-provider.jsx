import { createContext, useContext, useEffect, useState } from 'react';

import { appConfig } from '@/config/site';

const ThemeProviderContext = createContext({
  theme: 'dark',
  setTheme: () => null,
});

/**
 * ThemeProvider for HireNext.
 * The app is dark-first (black/red brand). Defaults to dark theme.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = appConfig.themeStorageKey,
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (next) => {
      localStorage.setItem(storageKey, next);
      setTheme(next);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
