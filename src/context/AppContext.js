import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const AppContext = createContext(null);

const KEYS = {
  USER: '@kriya_user', TASKS: '@kriya_tasks', HABITS: '@kriya_habits',
  SESSIONS: '@kriya_sessions', SETTINGS: '@kriya_settings',
  ONBOARDING_DONE: '@kriya_onboarding',
};

const init = {
  user: null, isAuthenticated: false, isLoading: true,
  onboardingDone: false,
  tasks: [], habits: [], focusSessions: [],
  settings: { focusDuration: 25, breakDuration: 5, notifications: true },
};

function calcStreak(dates) {
  if (!dates?.length) return 0;
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  const now = new Date(); now.setHours(12, 0, 0, 0);
  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i] + 'T12:00:00'); d.setHours(12, 0, 0, 0);
    if (Math.round((now - d) / 86400000) === i) streak++;
    else break;
  }
  return streak;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':     return { ...state, isLoading: action.payload };
    case 'LOGIN':           return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':          return { ...init, isLoading: false, onboardingDone: false };
    case 'LOAD':            return { ...state, ...action.payload, isLoading: false };
    case 'SET_ROLE':        return { ...state, user: { ...state.user, role: action.payload }, onboardingDone: true };
    case 'SET_ONBOARDING':  return { ...state, onboardingDone: true };
    case 'ADD_TASK':        return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':     return { ...state, tasks: state.tasks.map((t) => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    case 'DELETE_TASK':     return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK':     return { ...state, tasks: state.tasks.map((t) => t.id === action.payload ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t) };
    case 'ADD_HABIT':       return { ...state, habits: [action.payload, ...state.habits] };
    case 'UPDATE_HABIT':    return { ...state, habits: state.habits.map((h) => h.id === action.payload.id ? { ...h, ...action.payload } : h) };
    case 'DELETE_HABIT':    return { ...state, habits: state.habits.filter((h) => h.id !== action.payload) };
    case 'TOGGLE_HABIT': {
      const today = format(new Date(), 'yyyy-MM-dd');
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.payload) return h;
          const dates = h.completedDates || [];
          const done  = dates.includes(today);
          const newDates = done ? dates.filter((d) => d !== today) : [...dates, today];
          const streak   = calcStreak(newDates);
          const final    = newDates.includes(today) ? Math.max(streak, 1) : streak;
          return { ...h, completedDates: newDates, streak: final };
        }),
      };
    }
    case 'ADD_SESSION':   return { ...state, focusSessions: [action.payload, ...state.focusSessions] };
    case 'UPD_SETTINGS':  return { ...state, settings: { ...state.settings, ...action.payload } };
    default: return state;
  }
}

function safeArr(raw)     { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; } }
function safeObj(raw, fb) { try { const p = JSON.parse(raw); return p && typeof p === 'object' ? p : fb; } catch { return fb; } }

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const loaded = useRef(false);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEYS.TASKS,    JSON.stringify(state.tasks)).catch(() => {});
    AsyncStorage.setItem(KEYS.HABITS,   JSON.stringify(state.habits)).catch(() => {});
    AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(state.focusSessions)).catch(() => {});
  }, [state.tasks, state.habits, state.focusSessions]);

  const load = async () => {
    try {
      const [uR, tR, hR, sR, stR, obR] = await Promise.all([
        AsyncStorage.getItem(KEYS.USER), AsyncStorage.getItem(KEYS.TASKS),
        AsyncStorage.getItem(KEYS.HABITS), AsyncStorage.getItem(KEYS.SESSIONS),
        AsyncStorage.getItem(KEYS.SETTINGS), AsyncStorage.getItem(KEYS.ONBOARDING_DONE),
      ]);
      loaded.current = true;
      dispatch({ type: 'LOAD', payload: {
        user: uR ? safeObj(uR, null) : null,
        isAuthenticated: !!uR,
        onboardingDone: obR === 'true',
        tasks:         safeArr(tR),
        habits:        safeArr(hR),
        focusSessions: safeArr(sR),
        settings:      safeObj(stR, init.settings),
      }});
    } catch { loaded.current = true; dispatch({ type: 'SET_LOADING', payload: false }); }
  };

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 800));
    if (!email || !password) throw new Error('Invalid credentials');
    const user = { id: 'u1', email, name: email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()), createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const signup = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (!name || !email || !password) throw new Error('All fields required');
    const user = { id: `u_${Date.now()}`, email, name, role: null, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const setUserRole = async (role) => {
    const updatedUser = { ...state.user, role };
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(updatedUser));
    await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    dispatch({ type: 'LOGOUT' });
  };

  const addTask = (task) => {
    const t = { id: `t_${Date.now()}`, createdAt: new Date().toISOString(), completed: false, completedAt: null, priority: 'medium', category: 'other', ...task };
    dispatch({ type: 'ADD_TASK', payload: t }); return t;
  };
  const updateTask = (t) => dispatch({ type: 'UPDATE_TASK', payload: t });
  const deleteTask = (id) => dispatch({ type: 'DELETE_TASK', payload: id });
  const toggleTask = (id) => dispatch({ type: 'TOGGLE_TASK', payload: id });

  const addHabit = (habit) => {
    const h = { id: `h_${Date.now()}`, createdAt: new Date().toISOString(), completedDates: [], streak: 0, color: '#a78bfa', icon: '🎯', scheduledDays: [], linkedTaskIds: [], ...habit };
    dispatch({ type: 'ADD_HABIT', payload: h }); return h;
  };
  const updateHabit = (h) => dispatch({ type: 'UPDATE_HABIT', payload: h });
  const deleteHabit = (id) => dispatch({ type: 'DELETE_HABIT', payload: id });
  const toggleHabit = (id) => dispatch({ type: 'TOGGLE_HABIT', payload: id });

  const addFocusSession = (s) => {
    const sess = { id: `s_${Date.now()}`, date: new Date().toISOString(), ...s };
    dispatch({ type: 'ADD_SESSION', payload: sess }); return sess;
  };

  const updateSettings = async (s) => {
    dispatch({ type: 'UPD_SETTINGS', payload: s });
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...state.settings, ...s })).catch(() => {});
  };

  const resetAllData = async () => {
    await AsyncStorage.multiRemove([KEYS.TASKS, KEYS.HABITS, KEYS.SESSIONS]);
    dispatch({ type: 'LOAD', payload: { ...state, tasks: [], habits: [], focusSessions: [] } });
  };

  return (
    <AppContext.Provider value={{ ...state, login, signup, setUserRole, logout, addTask, updateTask, deleteTask, toggleTask, addHabit, updateHabit, deleteHabit, toggleHabit, addFocusSession, updateSettings, resetAllData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
