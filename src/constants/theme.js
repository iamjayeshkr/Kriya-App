/**
 * Design System Constants
 * This file defines the visual language of the application including:
 * - Theme definitions (Dark, Warm, AMOLED)
 * - Spacing and Radius scales
 * - Shadows for elevation
 * - Shared content like motivational quotes and task categories
 */

export const DARK_THEME = {
  mode: 'dark', name: 'Dark',
  bg: {
    primary: '#0f0f17',
    secondary: '#15151f',
    card: '#1c1c28',
    cardAlt: '#212130',
    input: '#1c1c28',
    overlay: 'rgba(0,0,0,0.80)',
    glass: 'rgba(255,255,255,0.04)',
  },
  accent: {
    primary: '#a78bfa',      // violet — modern, premium
    secondary: '#34d399',    // emerald
    purple: '#a78bfa',
    blue: '#60a5fa',
    orange: '#fb923c',
    red: '#f87171',
    yellow: '#fbbf24',
    pink: '#f472b6',
    glow: 'rgba(167,139,250,0.15)',
    glowGreen: 'rgba(52,211,153,0.15)',
  },
  text: {
    primary: '#f1f0f8',
    secondary: '#8b8ba8',
    muted: '#3d3d55',
    accent: '#a78bfa',
    inverse: '#0f0f17',
  },
  border: {
    default: '#2a2a3d',
    subtle: '#1e1e2e',
    accent: 'rgba(167,139,250,0.30)',
    glass: 'rgba(255,255,255,0.06)',
  },
  priority: { low: '#34d399', medium: '#fbbf24', high: '#f87171' },
};

export const WARM_LIGHT_THEME = {
  mode: 'light', name: 'Warm',
  bg: {
    primary: '#faf8f5',
    secondary: '#fff',
    card: '#fff',
    cardAlt: '#f5f2ec',
    input: '#f5f2ec',
    overlay: 'rgba(30,20,10,0.40)',
    glass: 'rgba(255,255,255,0.80)',
  },
  accent: {
    primary: '#7c3aed',
    secondary: '#059669',
    purple: '#7c3aed',
    blue: '#2563eb',
    orange: '#ea580c',
    red: '#dc2626',
    yellow: '#d97706',
    pink: '#db2777',
    glow: 'rgba(124,58,237,0.10)',
    glowGreen: 'rgba(5,150,105,0.10)',
  },
  text: {
    primary: '#1a1523',
    secondary: '#6b6580',
    muted: '#b8b0c8',
    accent: '#7c3aed',
    inverse: '#fff',
  },
  border: {
    default: '#e8e3f0',
    subtle: '#f0ecf8',
    accent: 'rgba(124,58,237,0.20)',
    glass: 'rgba(0,0,0,0.04)',
  },
  priority: { low: '#059669', medium: '#d97706', high: '#dc2626' },
};

export const AMOLED_THEME = {
  mode: 'dark', name: 'AMOLED',
  bg: {
    primary: '#000000',
    secondary: '#060608',
    card: '#0d0d12',
    cardAlt: '#111118',
    input: '#0d0d12',
    overlay: 'rgba(0,0,0,0.90)',
    glass: 'rgba(255,255,255,0.03)',
  },
  accent: {
    primary: '#c084fc',
    secondary: '#4ade80',
    purple: '#c084fc',
    blue: '#818cf8',
    orange: '#fb923c',
    red: '#f87171',
    yellow: '#facc15',
    pink: '#f472b6',
    glow: 'rgba(192,132,252,0.20)',
    glowGreen: 'rgba(74,222,128,0.20)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#6b7280',
    muted: '#2d2d3a',
    accent: '#c084fc',
    inverse: '#000000',
  },
  border: {
    default: '#1a1a24',
    subtle: '#0f0f18',
    accent: 'rgba(192,132,252,0.30)',
    glass: 'rgba(255,255,255,0.04)',
  },
  priority: { low: '#4ade80', medium: '#facc15', high: '#f87171' },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const RADIUS  = { sm: 8, md: 12, lg: 18, xl: 24, xxl: 32, full: 9999 };

export const SHADOWS = {
  dark: {
    sm:   { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4,  shadowRadius: 8,  elevation: 4 },
    md:   { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5,  shadowRadius: 16, elevation: 8 },
    glow: { shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  },
  light: {
    sm:   { shadowColor: '#4a3a6a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,  elevation: 2 },
    md:   { shadowColor: '#4a3a6a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5 },
    glow: { shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  },
};

export const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "It's not about time, it's about choices.", author: "Jean-Paul Sartre" },
];

export const TASK_CATEGORIES = [
  { id: 'work',     label: 'Work',     color: '#60a5fa' },
  { id: 'personal', label: 'Personal', color: '#a78bfa' },
  { id: 'study',    label: 'Study',    color: '#34d399' },
  { id: 'health',   label: 'Health',   color: '#f87171' },
  { id: 'project',  label: 'Project',  color: '#fbbf24' },
  { id: 'other',    label: 'Other',    color: '#8b8ba8' },
];

export const HABIT_ICONS = ['🧠','💪','📖','🏃','💧','🧘','✍️','🎯','🛏️','🥗','☀️','🎵','⚡','🔥','🌿','💊'];
export const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const WEEKDAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
