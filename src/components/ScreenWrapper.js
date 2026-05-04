// src/components/ScreenWrapper.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

/**
 * ScreenWrapper Component: A standardized layout wrapper for all screens.
 * Automatically handles safe area insets and optionally provides a ScrollView.
 *
 * @param {React.ReactNode} children - Screen content.
 * @param {boolean} scroll - If true, wraps content in a ScrollView. Defaults to true.
 * @param {object} style - Styles for the root SafeAreaView.
 * @param {object} contentStyle - Styles for the content container.
 * @param {boolean} noPadding - If true, removes the default horizontal padding.
 */
export default function ScreenWrapper({ children, scroll = true, style, contentStyle, noPadding }) {
  const { theme } = useTheme();

  const content = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, !noPadding && styles.padding, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, !noPadding && styles.padding, contentStyle]}>
      {children}
    </View>
  );

  return (
    // edges={['top']} — bottom is handled by the tab bar, left/right not needed
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg.primary }, style]}
      edges={['top', 'left', 'right']}
    >
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  flex:    { flex: 1 },
  content: { paddingBottom: 40, paddingTop: 8 },
  padding: { paddingHorizontal: 20 },
});