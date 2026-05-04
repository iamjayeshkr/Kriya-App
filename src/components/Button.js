// src/components/Button.js
import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS } from '../constants/theme';

/**
 * Button Component: A customizable, animated button with multiple variants and sizes.
 * Supports loading states, icons, and scale animations on press.
 *
 * @param {string} title - The text label for the button.
 * @param {function} onPress - Callback function when button is pressed.
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant - The visual style of the button.
 * @param {'sm'|'md'|'lg'} size - The size variant of the button.
 * @param {React.ReactNode} icon - Optional icon to display next to the text.
 * @param {boolean} loading - Shows a spinner and disables the button if true.
 * @param {boolean} disabled - Disables interactions and dims the button if true.
 * @param {object} style - Optional container styles.
 * @param {object} textStyle - Optional text styles.
 */
export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  icon, loading, disabled, style, textStyle,
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const variants = {
    primary:   { bg: theme.accent.primary,  text: theme.text.inverse, border: 'transparent' },
    secondary: { bg: theme.bg.cardAlt,      text: theme.text.primary, border: theme.border.default },
    ghost:     { bg: 'transparent',         text: theme.accent.primary, border: theme.border.accent },
    danger:    { bg: theme.accent.red,      text: '#fff',             border: 'transparent' },
  };

  const sizes = {
    sm: { paddingH: 16, paddingV: 8,  fontSize: 13, radius: RADIUS.md },
    md: { paddingH: 20, paddingV: 13, fontSize: 15, radius: RADIUS.lg },
    lg: { paddingH: 28, paddingV: 16, fontSize: 17, radius: RADIUS.xl },
  };

  // BUG FIX: Fall back to primary variant if an unknown variant string is passed
  const v = variants[variant] || variants.primary;
  const s = sizes[size]     || sizes.md;

  const hasBorder = variant === 'ghost' || variant === 'secondary';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[
          styles.base,
          {
            backgroundColor: v.bg,
            borderColor:      v.border,
            borderWidth:      hasBorder ? 1 : 0,
            paddingHorizontal: s.paddingH,
            paddingVertical:   s.paddingV,
            borderRadius:      s.radius,
            opacity:           disabled ? 0.5 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={v.text} />
        ) : (
          <View style={styles.row}>
            {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
            <Text style={[styles.text, { color: v.text, fontSize: s.fontSize }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row:  { flexDirection: 'row', alignItems: 'center' },
  text: { fontWeight: '700', letterSpacing: 0.3 },
});
