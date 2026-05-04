// src/components/CircularProgress.js
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

/**
 * CircularProgress Component: Renders a circular progress indicator using SVG.
 * Often used for timers or percentage-based tracking.
 *
 * @param {number} size - The diameter of the circular progress bar.
 * @param {number} progress - The completion percentage as a float between 0 and 1.
 * @param {number} strokeWidth - The thickness of the progress ring.
 * @param {string} color - The color of the active progress stroke.
 * @param {string} trackColor - The color of the background track ring.
 * @param {React.ReactNode} children - Optional content to be centered inside the ring (e.g., timer text).
 */
export default function CircularProgress({
  size = 200,
  progress = 0, // 0 to 1
  strokeWidth = 12,
  color,
  trackColor,
  children,
}) {
  const { theme } = useTheme();
  const c = color || theme.accent.primary;
  const t = trackColor || theme.border.default;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Track */}
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={t} strokeWidth={strokeWidth} fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={c} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}
