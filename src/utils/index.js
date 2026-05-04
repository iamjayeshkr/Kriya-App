// src/utils/index.js

// BUG FIX: Added more entropy to ID generation to prevent rare collisions
// when multiple items are created in rapid succession
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// BUG FIX: Append T12:00:00 to avoid timezone-related off-by-one day
export function getDayLabel(dateStr) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateStr + 'T12:00:00').getDay()];
}

export function getCompletionColor(rate) {
  if (rate >= 80) return '#00f5a0';
  if (rate >= 50) return '#fbbf24';
  return '#f87171';
}

// BUG FIX: Added helper for safe date string display used across screens
export function formatDateSafe(isoString, options = {}) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('en', options);
  } catch {
    return '';
  }
}
