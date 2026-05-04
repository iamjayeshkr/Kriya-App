import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import RoleSelectScreen from '../screens/onboarding/RoleSelectScreen';

export default function RootNavigator() {
  const { isAuthenticated, isLoading, user, onboardingDone } = useApp();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg.primary }}>
        <ActivityIndicator size="large" color={theme.accent.primary} />
      </View>
    );
  }

  // Show onboarding role-select if logged in but no role chosen yet
  const needsOnboarding = isAuthenticated && (!user?.role || !onboardingDone);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : needsOnboarding ? (
        <RoleSelectScreen />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
}
