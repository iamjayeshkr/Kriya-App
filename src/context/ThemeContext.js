// src/context/ThemeContext.js — 3-theme switcher: dark | warm | amoled
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_THEME, WARM_LIGHT_THEME, AMOLED_THEME } from '../constants/theme';

const THEMES = { dark: DARK_THEME, warm: WARM_LIGHT_THEME, amoled: AMOLED_THEME };

const ThemeContext = createContext(null);

/**
 * ThemeProvider: Manages the application's visual theme.
 * Supports multiple themes:
 * - dark: Modern dark mode with deep greys.
 * - warm: Easy-on-the-eyes light mode with cream tones.
 * - amoled: Pure black theme for OLED screens.
 */
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');

  // Load the saved theme preference from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('@kriya_theme_v2').then((val) => {
      if (val && THEMES[val]) setThemeName(val);
    });
  }, []);

  const theme = THEMES[themeName] || DARK_THEME;
  const isDark = theme.mode === 'dark';

  /**
   * Updates the current theme and persists it to storage.
   * @param {string} name - The name of the theme to set ('dark', 'warm', 'amoled').
   */
  const setTheme = async (name) => {
    if (!THEMES[name]) return;
    setThemeName(name);
    await AsyncStorage.setItem('@kriya_theme_v2', name);
  };

  /**
   * Toggles between 'dark' and 'warm' themes (Legacy support).
   */
  const toggleTheme = () => {
    setTheme(themeName === 'dark' ? 'warm' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeName, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
