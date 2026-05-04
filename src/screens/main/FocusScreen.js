import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Vibration, Text, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Timer, Coffee, Zap, ChevronDown } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import CircularProgress from '../../components/CircularProgress';
import Card from '../../components/Card';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, MOTIVATIONAL_QUOTES, TASK_CATEGORIES } from '../../constants/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
function fmt(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`; }

/**
 * FocusScreen: A Pomodoro-style timer to help users stay focused.
 * Features:
 * - Focus and Break modes with configurable durations.
 * - Circular progress visualization.
 * - Ability to link the focus session to a specific task.
 * - Daily stats tracking (sessions and minutes).
 */
export default function FocusScreen() {
  const { theme, isDark } = useTheme();
  const { settings, addFocusSession, focusSessions, tasks } = useApp();

  // Load timer durations from global settings
  const focusSecs = (settings.focusDuration || 25) * 60;
  const breakSecs = (settings.breakDuration || 5) * 60;

  const [mode, setMode]           = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft]   = useState(focusSecs);
  const [running, setRunning]     = useState(false);
  const [sessCount, setSessCount] = useState(0);
  const [linkedTask, setLinkedTask] = useState(null);
  const [showTaskPick, setShowTaskPick] = useState(false);

  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  // Refs to keep track of current values in intervals without triggering re-renders
  const intervalRef = useRef(null);
  const modeRef = useRef(mode);
  const focusRef = useRef(focusSecs);
  const breakRef = useRef(breakSecs);
  const settingsRef = useRef(settings);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { focusRef.current = focusSecs; }, [focusSecs]);
  useEffect(() => { breakRef.current = breakSecs; }, [breakSecs]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  // Update time left when settings change, but only if the timer isn't running
  useEffect(() => { if (!running) setTimeLeft(mode === 'focus' ? focusSecs : breakSecs); }, [focusSecs, breakSecs]);

  // Handle subtle pulsing animation while the timer is running
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);
  useEffect(() => {
    if (running) {
      pulseLoop.current = Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]));
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
    }
    return () => pulseLoop.current?.stop();
  }, [running]);

  /**
   * handleComplete: Called when the timer reaches zero.
   * Logic:
   * - If Focus mode ends: Save the session, increment count, and switch to Break.
   * - If Break mode ends: Switch back to Focus.
   */
  const handleComplete = useCallback(() => {
    if (modeRef.current === 'focus') {
      addFocusSession({ duration: settingsRef.current.focusDuration || 25, mode: 'focus', completed: true, taskId: linkedTask?.id });
      setSessCount((s) => s + 1);
      setMode('break'); setTimeLeft(breakRef.current);
    } else {
      setMode('focus'); setTimeLeft(focusRef.current);
    }
  }, [addFocusSession, linkedTask]);

  /**
   * Main timer interval logic.
   * Decrements timeLeft every second when 'running' is true.
   */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            Vibration.vibrate([0,300,100,300]);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [running, handleComplete]);

  const totalSecs  = mode === 'focus' ? focusSecs : breakSecs;
  const progress   = totalSecs > 0 ? 1 - timeLeft / totalSecs : 0;
  const color      = mode === 'focus' ? theme.accent.primary : theme.accent.secondary;

  // Stats for today
  const today      = format(new Date(), 'yyyy-MM-dd');
  const todaySess  = focusSessions.filter((s) => s.date?.startsWith(today));
  const totalMins  = todaySess.reduce((a, s) => a + (s.duration || 0), 0);
  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 8);

  const gradColors = isDark ? [color + '20', theme.bg.primary] : [color + '10', theme.bg.primary];

  return (
    <ScreenWrapper scroll>
      <View style={styles.gradWrap} pointerEvents="none">
        <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.header}>
        <KriyaText variant="label" color={color} style={{ letterSpacing: 2 }}>FOCUS MODE</KriyaText>
        <KriyaText variant="title">Pomodoro Timer</KriyaText>
      </View>

      {/* Mode tabs */}
      <View style={[styles.modeTabs, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
        {[{ k: 'focus', l: 'Focus', I: Zap }, { k: 'break', l: 'Break', I: Coffee }].map(({ k, l, I }) => (
          <TouchableOpacity key={k} style={[styles.modeTab, mode === k && { backgroundColor: (k === 'focus' ? theme.accent.primary : theme.accent.secondary) + '20', borderRadius: RADIUS.lg }]}
            onPress={() => { setRunning(false); setMode(k); setTimeLeft(k === 'focus' ? focusSecs : breakSecs); }}>
            <I size={16} color={mode === k ? (k === 'focus' ? theme.accent.primary : theme.accent.secondary) : theme.text.muted} />
            <Text style={{ color: mode === k ? (k === 'focus' ? theme.accent.primary : theme.accent.secondary) : theme.text.muted, fontSize: 13, fontWeight: '700', marginLeft: 6 }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer ring */}
      <View style={styles.timerWrap}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[styles.timerOuter, { borderColor: color + '25' }]}>
            <CircularProgress size={220} progress={progress} strokeWidth={12} color={color} trackColor={theme.border.subtle}>
              <View style={{ alignItems: 'center' }}>
                <KriyaText
                style={{
                fontSize: 42,
                fontWeight: '800',        // 🔥 thoda kam karo
                color,
                fontFamily: 'System',     // 🔥 Courier hatao (main fix)
                letterSpacing: 1,         // slight spacing for clarity
                lineHeight: 46,           // 🔥 prevents cut
                includeFontPadding: false, // android fix
                textAlign: 'center',
                }}
                > 
                  {fmt(timeLeft)}
              </KriyaText>
                <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 2, marginTop: 4 }}>
                  {mode === 'focus' ? 'FOCUS' : 'BREAK'}
                </KriyaText>
                {linkedTask && (
                  <View style={[styles.taskBadge, { backgroundColor: color + '18' }]}>
                    <KriyaText variant="caption" color={color} style={{ fontSize: 10 }} numberOfLines={1}>{linkedTask.title}</KriyaText>
                  </View>
                )}
              </View>
            </CircularProgress>
          </View>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => { setRunning(false); setTimeLeft(mode === 'focus' ? focusSecs : breakSecs); }}
          style={[styles.ctrlBtn, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          <RotateCcw size={20} color={theme.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRunning(!running)}
          style={[styles.mainBtn, { backgroundColor: color, shadowColor: color }]}>
          {running ? <Pause size={28} color="#fff" strokeWidth={2.5} /> : <Play size={28} color="#fff" strokeWidth={2.5} />}
        </TouchableOpacity>
        <View style={[styles.ctrlBtn, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          <KriyaText variant="caption" color={theme.text.secondary} style={{ fontFamily: 'Courier', fontSize: 15, fontWeight: '700' }}>{sessCount}×</KriyaText>
        </View>
      </View>

      {/* Link task */}
      <TouchableOpacity onPress={() => setShowTaskPick(!showTaskPick)}
        style={[styles.linkTask, { backgroundColor: theme.bg.card, borderColor: linkedTask ? color : theme.border.default }]}>
        <Timer size={15} color={linkedTask ? color : theme.text.secondary} />
        <KriyaText variant="caption" color={linkedTask ? color : theme.text.secondary} style={{ flex: 1, marginLeft: 8 }}>
          {linkedTask ? `Linked: ${linkedTask.title}` : 'Link a task (optional)'}
        </KriyaText>
        <ChevronDown size={15} color={theme.text.muted} />
      </TouchableOpacity>

      {showTaskPick && activeTasks.length > 0 && (
        <Card style={{ marginBottom: SPACING.md, padding: 0 }}>
          {activeTasks.map((t, i) => (
            <TouchableOpacity key={t.id}
              onPress={() => { setLinkedTask(t === linkedTask ? null : t); setShowTaskPick(false); }}
              style={[styles.taskPickRow, { borderBottomColor: theme.border.subtle, borderBottomWidth: i < activeTasks.length - 1 ? 1 : 0, backgroundColor: linkedTask?.id === t.id ? color + '10' : 'transparent' }]}>
              <KriyaText variant="caption" color={linkedTask?.id === t.id ? color : theme.text.primary}>{t.title}</KriyaText>
            </TouchableOpacity>
          ))}
        </Card>
      )}

{/* Stats row */}
<View style={styles.statsRow}>
  <Card style={[styles.statCard, { marginRight: 8 }]}>
    <KriyaText variant="label" color={theme.text.secondary}>
      SESSIONS TODAY
    </KriyaText>

    <KriyaText
      style={{
        marginTop: 4,
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        includeFontPadding: false, 
        lineHeight: 38, // ✨ Fix: Font ko vertical space dene ke liye
        paddingBottom: 4, // ✨ Fix: Bottom clipping rokne ke liye
      }}
      color={theme.accent.primary}
    >
      {todaySess.length}
    </KriyaText>
  </Card>

  <Card style={[styles.statCard, { marginLeft: 8 }]}>
    <KriyaText variant="label" color={theme.text.secondary}>
      FOCUS MINUTES
    </KriyaText>

    <KriyaText
      style={{
        marginTop: 4,
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        includeFontPadding: false, 
        lineHeight: 38, // ✨ Fix
        paddingBottom: 4, // ✨ Fix
      }}
      color={theme.accent.secondary}
    >
      {`${Math.floor(totalMins)}m`}
    </KriyaText>
  </Card>
</View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  gradWrap:    { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  header:      { paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  modeTabs:    { flexDirection: 'row', borderRadius: RADIUS.xl, borderWidth: 1, padding: 5, marginBottom: SPACING.xl },
  modeTab:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  timerWrap:   { alignItems: 'center', marginBottom: SPACING.xl },
  timerOuter:  { borderRadius: 999, borderWidth: 2, padding: 8 },
  taskBadge:   { marginTop: 8, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full, maxWidth: 150 },
  controls:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: SPACING.lg },
  ctrlBtn:     { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  mainBtn:     { width: 76, height: 76, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10 },
  linkTask:    { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: RADIUS.xl, borderWidth: 1, marginBottom: SPACING.sm },
  taskPickRow: { paddingVertical: 12, paddingHorizontal: SPACING.md },
  statsRow:    { flexDirection: 'row', marginBottom: SPACING.lg },
  statCard:    { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
});
