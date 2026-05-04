// src/components/StatCard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SPACING, SHADOWS } from '../constants/theme';
import KriyaText from './KriyaText';

/**
 * StatCard Component: Displays a key performance indicator (KPI) or metric.
 * Typically used in the dashboard or analytics screens.
 *
 * @param {string} label - Title of the statistic.
 * @param {string|number} value - Main numerical or text value to highlight.
 * @param {string} sub - Optional subtitle or secondary metric info.
 * @param {React.ReactNode} icon - Icon component representing the metric.
 * @param {string} color - Accent color for the icon and value.
 * @param {object} style - Additional container styles.
 */
export default function StatCard({ label, value, sub, icon: Icon, color, style }) {
  const { theme, isDark } = useTheme();
  const shadows = isDark ? SHADOWS.dark : SHADOWS.light;
  const c = color || theme.accent.primary;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.bg.card, borderColor: theme.border.subtle },
        shadows.sm,
        style,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: c + '1a' }]}>
        {Icon && <Icon size={20} color={c} strokeWidth={2} />}
      </View>
      <KriyaText variant="hero" color={c} style={styles.value}>{value}</KriyaText>
      <KriyaText variant="caption" color={theme.text.secondary} style={styles.label}>{label}</KriyaText>
      {sub && <KriyaText variant="caption" color={theme.text.muted}>{sub}</KriyaText>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    alignItems: 'flex-start',
    flex: 1,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  value: { fontSize: 28, lineHeight: 34, marginBottom: 2 },
  label: { textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
});
