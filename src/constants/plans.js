// src/constants/plans.js — Freemium plan definitions

export const FREE_LIMITS = {
  MAX_TASKS:    10,
  MAX_HABITS:   5,
  ANALYTICS_DAYS: 7,
};

export const PRO_PRICE = {
  amount: 4900,        // paise (₹49)
  display: '₹49',
  period: 'month',
  currency: 'INR',
};

// Feature flags — what each plan gets
export const PLAN_FEATURES = {
  free: {
    tasks: 10,
    habits: 5,
    analyticsDays: 7,
    pomodoro: true,
    basicAnalytics: true,
    unlimitedTasks: false,
    unlimitedHabits: false,
    fullAnalytics: false,
    // Student features
    studyTracker: false,
    examCountdown: false,
    syllabusChecklist: false,
    subjectPomodoro: false,
    // Dev features
    projectTracker: false,
    codeLogger: false,
    bugTracker: false,
    commitStreak: false,
    // Medical features
    revisionTracker: false,
    drugFlashcards: false,
    rotationSchedule: false,
    mbssProgress: false,
    // Themes
    amoledTheme: false,
    warmTheme: true,
    darkTheme: true,
  },
  pro: {
    tasks: Infinity,
    habits: Infinity,
    analyticsDays: 90,
    pomodoro: true,
    basicAnalytics: true,
    unlimitedTasks: true,
    unlimitedHabits: true,
    fullAnalytics: true,
    studyTracker: true,
    examCountdown: true,
    syllabusChecklist: true,
    subjectPomodoro: true,
    projectTracker: true,
    codeLogger: true,
    bugTracker: true,
    commitStreak: true,
    revisionTracker: true,
    drugFlashcards: true,
    rotationSchedule: true,
    mbssProgress: true,
    amoledTheme: true,
    warmTheme: true,
    darkTheme: true,
  },
};

export const PRO_FEATURE_LIST = [
  { icon: '♾️', label: 'Unlimited tasks & habits' },
  { icon: '📊', label: '90-day deep analytics' },
  { icon: '🎓', label: 'Student tools (exam timer, syllabus)' },
  { icon: '💻', label: 'Dev tools (projects, code logger)' },
  { icon: '🏥', label: 'Medical tools (flashcards, rotations)' },
  { icon: '🌑', label: 'AMOLED + all premium themes' },
  { icon: '📅', label: 'Habit scheduling (day-wise)' },
  { icon: '🔗', label: 'Habit-task linking' },
  { icon: '⚡', label: 'Priority support' },
];
