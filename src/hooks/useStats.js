// src/hooks/useStats.js
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

/**
 * useStats: Custom hook to calculate application-wide statistics.
 * Aggregates data from tasks, habits, and focus sessions to provide a unified
 * view of user progress.
 */
export function useStats() {
  const { tasks, habits, focusSessions } = useApp();

  return useMemo(() => {
    // Current date for filtering today's activities
    const today = format(new Date(), 'yyyy-MM-dd');

    // Filtering tasks created or due today
    const todayTasks = tasks.filter(
      (t) => t.createdAt?.startsWith(today) || t.dueDate?.startsWith(today)
    );
    const completedToday   = todayTasks.filter((t) => t.completed).length;

    // Filtering and summing focus session minutes for today
    const todaySessions    = focusSessions.filter((s) => s.date?.startsWith(today));
    const focusMinutes     = todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);

    // Count habits completed today
    const habitsToday      = habits.filter((h) => h.completedDates?.includes(today)).length;

    // Find the highest streak among all habits
    const maxStreak        = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

    const totalCompleted   = tasks.filter((t) => t.completed).length;
    const completionRate   = tasks.length
      ? Math.round((totalCompleted / tasks.length) * 100)
      : 0;

    return {
      today,
      todayTasks,
      completedToday,
      todaySessions,
      focusMinutes,
      habitsToday,
      maxStreak,
      completionRate,
      totalCompleted,
    };
  // Recalculate only when the underlying data changes
  }, [tasks, habits, focusSessions]);
}
