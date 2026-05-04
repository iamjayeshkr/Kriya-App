import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import RoleSelectScreen from '../screens/onboarding/RoleSelectScreen';

/**
 * RootNavigator: The top-level navigator component.
 * It manages the high-level routing logic:
 * 1. Loading State: Shows a spinner while the app state is being loaded from storage.
 * 2. Auth State: If not authenticated, shows the AuthNavigator (Login/Signup).
 * 3. Onboarding: If authenticated but no role is selected, shows the RoleSelectScreen.
 * 4. Main App: If authenticated and onboarding is complete, shows the MainNavigator (Dashboard/Tabs).
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading, user, onboardingDone } = useApp();
  const { theme } = useTheme();

  // Show a loading screen while initializing app data
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg.primary }}>
        <ActivityIndicator size="large" color={theme.accent.primary} />
      </View>
    );
  }

  // Determine if the user needs to select their role (Student, Developer, etc.)
  const needsOnboarding = isAuthenticated && (!user?.role || !onboardingDone);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        /* Unauthenticated user flow: Login, Signup, Landing */
        <AuthNavigator />
      ) : needsOnboarding ? (
        /* Post-signup flow: Select user role and preference */
        <RoleSelectScreen />
      ) : (
        /* Main application flow: Dashboard, Tasks, Habits, Focus */
        <MainNavigator />
      )}
    </NavigationContainer>
  );
}
