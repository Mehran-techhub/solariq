import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('solariq_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('solariq_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const syncFromBackend = useCallback(async () => {
    try {
      const res = await settingsApi.get();
      if (res.success && res.data?.theme) {
        setTheme(res.data.theme);
      }
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, syncFromBackend }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);