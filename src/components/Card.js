import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SHADOWS, SPACING } from '../constants/theme';

/**
 * Card Component: A versatile container with consistent styling, shadowing, and borders.
 * Supports multiple variants for different context (e.g., standard, outlined, accent).
 *
 * @param {React.ReactNode} children - Content to be rendered inside the card.
 * @param {object} style - Additional styles for the card container.
 * @param {'default'|'alt'|'outlined'|'accent'|'glass'} variant - The visual style variant.
 * @param {boolean} glow - If true, applies a more prominent glow shadow effect.
 * @param {number} padding - Optional custom padding value.
 */
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
