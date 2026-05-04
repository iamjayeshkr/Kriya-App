// src/screens/main/FocusScreen.js
// Full Pomodoro timer — synced with settings, themed, logs sessions to AppContext
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet,
  ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Timer, Play, Square, RotateCcw, Coffee, Zap } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS } from '../../constants/theme';

const STATUS = { IDLE: 'idle', FOCUS: 'focus', BREAK: 'break', DONE: 'done', FAILED: 'failed' };

export default function FocusScreen() {
  const { theme, isDark } = useTheme();
  const { settings, addFocusSession, focusSessions } = useApp();

  const focusDuration = (settings?.focusDuration || 25) * 60;
  const breakDuration = (settings?.breakDuration || 5) * 60;

  const [status, setStatus]     = useState(STATUS.IDLE);
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [isBreak, setIsBreak]   = useState(false);
  const [sessionLabel, setSessionLabel] = useState('');

  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef  = useRef(null);
  const startedAt    = useRef(null);

  // Sync timer duration when settings change (only when idle)
  useEffect(() => {
    if (status === STATUS.IDLE) {
      setTimeLeft(focusDuration);
      setIsBreak(false);
    }
  }, [settings?.focusDuration, settings?.breakDuration]);

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearTimer();
        if (!isBreak) {
          // Focus session complete → log it
          const dur = (settings?.focusDuration || 25) * 60;
          addFocusSession({ duration: dur, label: sessionLabel || 'Focus Session', type: 'focus' });
          setStatus(STATUS.DONE);
        } else {
          setStatus(STATUS.IDLE);
          setIsBreak(false);
          setTimeLeft(focusDuration);
        }
        return 0;
      }
      return prev - 1;
    });
  }, [isBreak, sessionLabel, focusDuration, settings]);

  useEffect(() => {
    if (status === STATUS.FOCUS || status === STATUS.BREAK) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return clearTimer;
  }, [status, tick]);

  // Animate ring progress
  useEffect(() => {
    const total = isBreak ? breakDuration : focusDuration;
    const elapsed = 1 - timeLeft / total;
    Animated.timing(progressAnim, {
      toValue: elapsed,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, isBreak]);

  const handleStart = () => {
    startedAt.current = new Date().toISOString();
    setStatus(STATUS.FOCUS);
    setIsBreak(false);
    setTimeLeft(focusDuration);
  };

  const handleGiveUp = () => {
    Alert.alert('Give Up?', 'This session won\'t be counted.', [
      { text: 'Keep Going', style: 'cancel' },
      { text: 'Give Up', style: 'destructive', onPress: () => {
        clearTimer();
        setStatus(STATUS.FAILED);
        setTimeLeft(focusDuration);
      }},
    ]);
  };

  const handleStartBreak = () => {
    setIsBreak(true);
    setTimeLeft(breakDuration);
    setStatus(STATUS.BREAK);
  };

  const reset = () => {
    clearTimer();
    setStatus(STATUS.IDLE);
    setIsBreak(false);
    setTimeLeft(focusDuration);
    Animated.timing(progressAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const total   = isBreak ? breakDuration : focusDuration;
  const elapsed = 1 - timeLeft / total;

  const emoji = status === STATUS.FAILED ? '💀'
    : status === STATUS.DONE ? '🌳'
    : isBreak ? '☕'
    : elapsed < 0.3 ? '🐣'
    : elapsed < 0.7 ? '🐥'
    : '🦅';

  const accent = isBreak ? theme.accent.secondary : theme.accent.primary;
  const gradColors = isDark
    ? [accent + '18', theme.bg.primary]
    : [accent + '10', theme.bg.primary];

  // Today's sessions
  const today = new Date().toDateString();
  const todaySessions = (focusSessions || []).filter(
    (s) => new Date(s.date).toDateString() === today
  );
  const totalMinToday = todaySessions.reduce((acc, s) => acc + Math.round((s.duration || 0) / 60), 0);

  return (
    <ScreenWrapper>
      {/* Gradient bg */}
      <View style={styles.gradWrap} pointerEvents="none">
        <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <KriyaText variant="title">
            {isBreak ? '☕ Break Time' : '⚡ Focus Mode'}
          </KriyaText>
          <KriyaText variant="caption" color={theme.text.muted}>
            {isBreak
              ? `${settings?.breakDuration || 5}min break`
              : `${settings?.focusDuration || 25}min Pomodoro`}
          </KriyaText>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            <Zap size={13} color={theme.accent.primary} />
            <KriyaText variant="caption" color={theme.accent.primary} style={{ marginLeft: 4, fontWeight: '700' }}>
              {todaySessions.length} sessions
            </KriyaText>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            <Timer size={13} color={theme.accent.secondary} />
            <KriyaText variant="caption" color={theme.accent.secondary} style={{ marginLeft: 4, fontWeight: '700' }}>
              {totalMinToday}min today
            </KriyaText>
          </View>
        </View>

        {/* Ring + Character */}
        <View style={styles.ringWrap}>
          {/* Background ring */}
          <View style={[styles.ring, { borderColor: accent + '20' }]}>
            {/* Character */}
            <Animated.View
              style={[styles.charWrap, {
                transform: [{
                  scale: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1.2],
                  }),
                }],
              }]}
            >
              <Text style={styles.charEmoji}>{emoji}</Text>
            </Animated.View>

            {/* Timer */}
            <Text style={[styles.timer, { color: theme.text.primary }]}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>

            <KriyaText variant="caption" color={theme.text.muted}>
              {status === STATUS.IDLE && 'Ready when you are'}
              {status === STATUS.FOCUS && 'Stay focused…'}
              {status === STATUS.BREAK && 'Rest your mind'}
              {status === STATUS.DONE && 'Session complete!'}
              {status === STATUS.FAILED && 'Better luck next time'}
            </KriyaText>
          </View>

          {/* Progress arc overlay using border trick */}
          <Animated.View
            style={[
              styles.progressRing,
              {
                borderColor: accent,
                transform: [{
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
                opacity: status === STATUS.IDLE ? 0 : 1,
              },
            ]}
          />
        </View>

        {/* State buttons */}
        <View style={styles.btnWrap}>
          {status === STATUS.IDLE && (
            <TouchableOpacity
              style={[styles.mainBtn, { backgroundColor: accent }]}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Play size={22} color="#fff" fill="#fff" />
              <Text style={styles.mainBtnText}>Start Focus</Text>
            </TouchableOpacity>
          )}

          {status === STATUS.FOCUS && (
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: theme.accent.red, flex: 1 }]}
                onPress={handleGiveUp}
                activeOpacity={0.85}
              >
                <Square size={18} color="#fff" fill="#fff" />
                <Text style={styles.mainBtnText}>Give Up</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === STATUS.BREAK && (
            <TouchableOpacity
              style={[styles.mainBtn, { backgroundColor: theme.accent.red }]}
              onPress={reset}
              activeOpacity={0.85}
            >
              <Square size={18} color="#fff" fill="#fff" />
              <Text style={styles.mainBtnText}>End Break</Text>
            </TouchableOpacity>
          )}

          {status === STATUS.DONE && (
            <View style={styles.doneWrap}>
              <Text style={styles.doneText}>🎉 You grew it!</Text>
              <KriyaText variant="caption" color={theme.text.muted} style={{ textAlign: 'center', marginBottom: SPACING.md }}>
                {sessionLabel || 'Focus session'} complete — great work!
              </KriyaText>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.secondaryBtn, { borderColor: accent, flex: 1 }]}
                  onPress={handleStartBreak}
                  activeOpacity={0.85}
                >
                  <Coffee size={17} color={accent} />
                  <Text style={[styles.secondaryBtnText, { color: accent }]}>Take Break</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mainBtn, { backgroundColor: accent, flex: 1 }]}
                  onPress={handleStart}
                  activeOpacity={0.85}
                >
                  <RotateCcw size={17} color="#fff" />
                  <Text style={styles.mainBtnText}>Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {status === STATUS.FAILED && (
            <View style={styles.doneWrap}>
              <Text style={styles.doneText}>😢 It didn't survive</Text>
              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: accent }]}
                onPress={reset}
                activeOpacity={0.85}
              >
                <RotateCcw size={17} color="#fff" />
                <Text style={styles.mainBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reset (always visible except idle) */}
          {status !== STATUS.IDLE && (
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <RotateCcw size={14} color={theme.text.muted} />
              <KriyaText variant="caption" color={theme.text.muted} style={{ marginLeft: 5 }}>Reset</KriyaText>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent sessions */}
        {todaySessions.length > 0 && (
          <View style={[styles.sessionsCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5, marginBottom: SPACING.sm }}>
              TODAY'S SESSIONS
            </KriyaText>
            {todaySessions.slice(0, 5).map((s, i) => (
              <View key={s.id || i} style={[styles.sessionRow, { borderBottomColor: theme.border.subtle, borderBottomWidth: i < todaySessions.length - 1 ? 1 : 0 }]}>
                <Text style={{ fontSize: 18 }}>⚡</Text>
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <KriyaText variant="caption" style={{ fontWeight: '600', color: theme.text.primary }}>
                    {s.label || 'Focus Session'}
                  </KriyaText>
                  <KriyaText variant="caption" color={theme.text.muted}>
                    {Math.round((s.duration || 0) / 60)}min · {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </KriyaText>
                </View>
                <View style={[styles.doneTag, { backgroundColor: theme.accent.primary + '18' }]}>
                  <KriyaText variant="caption" color={theme.accent.primary} style={{ fontSize: 10 }}>DONE</KriyaText>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tip */}
        <View style={[styles.tipCard, { backgroundColor: accent + '10', borderColor: accent + '30' }]}>
          <KriyaText variant="caption" color={theme.text.secondary} style={{ textAlign: 'center', lineHeight: 20 }}>
            💡 The Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. After 4 sessions, take a longer break.
          </KriyaText>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  gradWrap:       { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  scroll:         { paddingBottom: 40 },
  header:         { alignItems: 'center', marginBottom: SPACING.md, paddingTop: SPACING.md },
  statsRow:       { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: SPACING.lg },
  statPill:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1 },
  ringWrap:       { alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl, position: 'relative' },
  ring:           { width: 240, height: 240, borderRadius: 120, borderWidth: 3, alignItems: 'center', justifyContent: 'center', gap: 4 },
  progressRing:   { position: 'absolute', width: 246, height: 246, borderRadius: 123, borderWidth: 4, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
  charWrap:       { marginBottom: 8 },
  charEmoji:      { fontSize: 56 },
  timer:          { fontSize: 52, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: 2 },
  btnWrap:        { alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.lg },
  btnRow:         { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  mainBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 32, borderRadius: RADIUS.xl, width: '100%' },
  mainBtnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 24, borderRadius: RADIUS.xl, borderWidth: 2 },
  secondaryBtnText: { fontSize: 15, fontWeight: '600' },
  resetBtn:       { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  doneWrap:       { alignItems: 'center', width: '100%', gap: SPACING.sm },
  doneText:       { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  sessionsCard:   { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.md, marginHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sessionRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  doneTag:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  tipCard:        { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.md, marginHorizontal: SPACING.lg, marginTop: SPACING.md, marginBottom: SPACING.md },
});