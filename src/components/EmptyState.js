import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import KriyaText from './KriyaText';
import { SPACING } from '../constants/theme';

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      {Icon && (
        <View style={[styles.iconWrap, { backgroundColor: theme.accent.primary + '12' }]}>
          <Icon size={32} color={theme.accent.primary} strokeWidth={1.5} />
        </View>
      )}
      <KriyaText variant="subheading" style={{ marginBottom: 6, textAlign: 'center' }}>{title}</KriyaText>
      {subtitle && <KriyaText variant="caption" color={theme.text.muted} style={{ textAlign: 'center', marginBottom: SPACING.lg }}>{subtitle}</KriyaText>}
      {action}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingVertical: 40, paddingHorizontal: SPACING.lg },
  iconWrap: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
});
