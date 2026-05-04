import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SHADOWS, SPACING } from '../constants/theme';

export default function Card({ children, style, variant = 'default', glow, padding }) {
  const { theme, isDark } = useTheme();
  const S = isDark ? SHADOWS.dark : SHADOWS.light;
  const bg = {
    default:  theme.bg.card,
    alt:      theme.bg.cardAlt,
    outlined: 'transparent',
    accent:   theme.bg.card,
    glass:    theme.bg.glass,
  };
  const border = {
    default:  { borderWidth: 1, borderColor: theme.border.default },
    alt:      { borderWidth: 1, borderColor: theme.border.subtle },
    outlined: { borderWidth: 1, borderColor: theme.border.default },
    accent:   { borderWidth: 1, borderColor: theme.border.accent },
    glass:    { borderWidth: 1, borderColor: theme.border.glass },
  };
  return (
    <View style={[styles.card, { backgroundColor: bg[variant] || bg.default, padding: padding ?? SPACING.md }, border[variant], glow ? S.glow : S.sm, style]}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({ card: { borderRadius: RADIUS.xl, overflow: 'hidden' } });
