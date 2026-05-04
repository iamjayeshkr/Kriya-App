// src/hooks/useStats.js
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export function useStats() {
  const { tasks, habits, focusSessions } = useApp();

  return useMemo(() => {
    // BUG FIX: today must be computed INSIDE useMemo so it's not stale
    // (previously 'today' was declared outside useMemo and captured at module eval time)
    const today = format(new Date(), 'yyyy-MM-dd');

    const todayTasks = tasks.filter(
      (t) => t.createdAt?.startsWith(today) || t.dueDate?.startsWith(today)
    );
    const completedToday   = todayTasks.filter((t) => t.completed).length;
    const todaySessions    = focusSessions.filter((s) => s.date?.startsWith(today));
    const focusMinutes     = todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const habitsToday      = habits.filter((h) => h.completedDates?.includes(today)).length;
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
  // BUG FIX: removed 'today' from deps (it's a string computed inside the memo);
  // tasks/habits/focusSessions are the actual reactive dependencies
  }, [tasks, habits, focusSessions]);
}
