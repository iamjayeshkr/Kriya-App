// src/components/ScreenWrapper.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

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