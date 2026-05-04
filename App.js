import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Main Entry Point for the Kriya App.
 * This component wraps the entire application with necessary providers:
 * - SafeAreaProvider: Handles safe area insets for different devices.
 * - ThemeProvider: Manages the application's color theme (dark/light mode).
 * - AppProvider: Provides global application state (tasks, habits, etc.).
 * - StatusBar: Configures the device's status bar style.
 * - RootNavigator: Handles the application's routing and navigation.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          {/* Automatically adjusts status bar icons based on theme */}
          <StatusBar style="auto" />
          {/* The main navigation stack of the app */}
          <RootNavigator />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


