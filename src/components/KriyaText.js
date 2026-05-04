// src/components/KriyaText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function KriyaText({
  children, variant = 'body', color, style, mono, ...props
}) {
  const { theme } = useTheme();
  const variantStyles = {
    hero: { fontSize: 36, fontWeight: '800', letterSpacing: -1, lineHeight: 42 },
    title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: 32 },
    heading: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, lineHeight: 26 },
    subheading: { fontSize: 16, fontWeight: '600', letterSpacing: 0, lineHeight: 22 },
    body: { fontSize: 14, fontWeight: '400', letterSpacing: 0.1, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', letterSpacing: 0.3, lineHeight: 16 },
    label: { fontSize: 11, fontWeight: '600', letterSpacing: 1, lineHeight: 14, textTransform: 'uppercase' },
    mono: { fontSize: 13, fontFamily: 'Courier', letterSpacing: 0.5, lineHeight: 18 },
  };

  return (
    <Text
      style={[
        variantStyles[variant],
        { color: color || theme.text.primary },
        mono && { fontFamily: 'Courier' },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
