// src/components/Badge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Badge Component: A small labeled indicator with a tinted background.
 * Used for status tags, priority levels, or categories.
 * @param {string} label - The text to display inside the badge.
 * @param {string} color - The base color for the text and background tint.
 * @param {'sm'|'md'} size - The size variant of the badge.
 */
export default function Badge({ label, color, size = 'sm' }) {
  const { theme } = useTheme();
  const c = color || theme.accent.primary;

  // Define padding and font size for different variants
  const sizes = { sm: { px: 8, py: 3, fs: 10 }, md: { px: 12, py: 5, fs: 12 } };
  const s = sizes[size];

  return (
    <View style={[styles.badge, { backgroundColor: c + '22', paddingHorizontal: s.px, paddingVertical: s.py }]}>
      <Text style={[styles.text, { color: c, fontSize: s.fs }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 6, alignSelf: 'flex-start' },
  text: { fontWeight: '700', letterSpacing: 0.5 },
});
