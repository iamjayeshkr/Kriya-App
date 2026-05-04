// src/context/ThemeContext.js — 3-theme switcher: dark | warm | amoled
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_THEME, WARM_LIGHT_THEME, AMOLED_THEME } from '../constants/theme';

const THEMES = { dark: DARK_THEME, warm: WARM_LIGHT_THEME, amoled: AMOLED_THEME };

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('@kriya_theme_v2').then((val) => {
      if (val && THEMES[val]) setThemeName(val);
    });
  }, []);

  const theme = THEMES[themeName] || DARK_THEME;
  const isDark = theme.mode === 'dark';

  const setTheme = async (name) => {
    if (!THEMES[name]) return;
    setThemeName(name);
    await AsyncStorage.setItem('@kriya_theme_v2', name);
  };

  // Legacy toggle: dark <-> warm
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
