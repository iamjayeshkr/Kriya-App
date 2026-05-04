import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { format, subDays } from 'date-fns';
import { Activity, CheckSquare, Timer, Flame, TrendingUp, Award } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Card from '../../components/Card';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const BAR_W = (width - 80) / 7 - 6;

function Bar({ value, max, color, label, theme }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 9, marginBottom: 4 }}>{value || ''}</KriyaText>
      <View style={{ width: BAR_W, height: 80, backgroundColor: theme.border.subtle, borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' }}>
        <View style={{ height: `${pct}%`, backgroundColor: color, borderRadius: 6, minHeight: pct > 0 ? 4 : 0 }} />
      </View>
      <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 9, marginTop: 4 }}>{label}</KriyaText>
    </View>
  );
}

function StatBadge({ icon: Icon, label, value, color, theme, isDark }) {
  const S = isDark ? SHADOWS.dark : SHADOWS.light;
  return (
    <View style={[styles.statBadge, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, S.sm]}>
      <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
        <Icon size={18} color={color} strokeWidth={2} />
      </View>
      <KriyaText variant="heading" color={color} style={{ fontSize: 26, marginTop: 4 }}>{value}</KriyaText>
      <KriyaText variant="caption" color={theme.text.secondary} style={{ textAlign: 'center', fontSize: 10 }}>{label}</KriyaText>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { theme, isDark } = useTheme();
  const { tasks, habits, focusSessions } = useApp();

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')), []);

  const taskData = useMemo(() => last7.map((d) => {
    const day = tasks.filter((t) => t.createdAt?.startsWith(d) || t.dueDate?.startsWith(d));
    return { date: d, total: day.length, done: day.filter((t) => t.completed && t.completedAt?.startsWith(d)).length };
  }), [tasks, last7]);

  const habitData = useMemo(() => last7.map((d) => {
    const done = habits.filter((h) => h.completedDates?.includes(d)).length;
    return { date: d, done, total: habits.length };
  }), [habits, last7]);

  const sessData = useMemo(() => last7.map((d) => {
    const s = focusSessions.filter((s) => s.date?.startsWith(d));
    return { date: d, mins: s.reduce((a, x) => a + (x.duration || 0), 0), count: s.length };
  }), [focusSessions, last7]);

  const totalTasksDone  = tasks.filter((t) => t.completed).length;
  const totalFocusMins  = focusSessions.reduce((a, s) => a + (s.duration || 0), 0);
  const maxStreak       = habits.reduce((m, h) => Math.max(m, h.streak || 0), 0);
  const completionRate  = tasks.length > 0 ? Math.round((totalTasksDone / tasks.length) * 100) : 0;

  const maxTaskVal  = Math.max(...taskData.map((d) => d.total), 1);
  const maxHabitVal = Math.max(...habitData.map((d) => d.done), 1);
  const maxSessVal  = Math.max(...sessData.map((d) => d.mins), 1);

  const gradColors = isDark ? [theme.accent.primary + '18', 'transparent'] : [theme.accent.primary + '08', 'transparent'];

  return (
    <ScreenWrapper>
      <View style={styles.gradWrap} pointerEvents="none">
        <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.header}>
        <KriyaText variant="label" color={theme.accent.primary} style={{ letterSpacing: 2 }}>ANALYTICS</KriyaText>
        <KriyaText variant="title">Your Progress</KriyaText>
        <KriyaText variant="caption" color={theme.text.secondary}>Last 7 days overview</KriyaText>
      </View>

      {/* Summary badges */}
      <View style={styles.badgeRow}>
        <StatBadge icon={CheckSquare} label="Tasks Done"    value={totalTasksDone}   color={theme.accent.secondary} theme={theme} isDark={isDark} />
        <StatBadge icon={Timer}       label="Focus Mins"    value={`${totalFocusMins}m`} color={theme.accent.primary}   theme={theme} isDark={isDark} />
        <StatBadge icon={Flame}       label="Best Streak"   value={`${maxStreak}d`}  color={theme.accent.orange}   theme={theme} isDark={isDark} />
        <StatBadge icon={TrendingUp}  label="Completion"    value={`${completionRate}%`} color={theme.accent.blue}   theme={theme} isDark={isDark} />
      </View>

      {/* Task chart */}
      <Card style={{ marginBottom: SPACING.md }}>
        <View style={styles.chartHeader}>
          <CheckSquare size={16} color={theme.accent.secondary} />
          <KriyaText variant="label" color={theme.text.secondary} style={{ marginLeft: 8, letterSpacing: 1 }}>TASKS THIS WEEK</KriyaText>
        </View>
        <View style={styles.chartBars}>
          {taskData.map((d, i) => (
            <Bar key={d.date} value={d.done} max={maxTaskVal} color={theme.accent.secondary} label={format(new Date(d.date + 'T12:00:00'), 'EEE')} theme={theme} />
          ))}
        </View>
        <View style={styles.chartLegend}>
          <View style={[styles.legendDot, { backgroundColor: theme.accent.secondary }]} />
          <KriyaText variant="caption" color={theme.text.muted}>Completed tasks per day</KriyaText>
        </View>
      </Card>

      {/* Habit chart */}
      <Card style={{ marginBottom: SPACING.md }}>
        <View style={styles.chartHeader}>
          <Flame size={16} color={theme.accent.orange} />
          <KriyaText variant="label" color={theme.text.secondary} style={{ marginLeft: 8, letterSpacing: 1 }}>HABITS THIS WEEK</KriyaText>
        </View>
        <View style={styles.chartBars}>
          {habitData.map((d) => (
            <Bar key={d.date} value={d.done} max={maxHabitVal} color={theme.accent.orange} label={format(new Date(d.date + 'T12:00:00'), 'EEE')} theme={theme} />
          ))}
        </View>
      </Card>

      {/* Focus chart */}
      <Card style={{ marginBottom: SPACING.md }}>
        <View style={styles.chartHeader}>
          <Timer size={16} color={theme.accent.primary} />
          <KriyaText variant="label" color={theme.text.secondary} style={{ marginLeft: 8, letterSpacing: 1 }}>FOCUS MINUTES THIS WEEK</KriyaText>
        </View>
        <View style={styles.chartBars}>
          {sessData.map((d) => (
            <Bar key={d.date} value={d.mins} max={maxSessVal} color={theme.accent.primary} label={format(new Date(d.date + 'T12:00:00'), 'EEE')} theme={theme} />
          ))}
        </View>
      </Card>

      {/* Habit streaks */}
      {habits.length > 0 && (
        <Card style={{ marginBottom: SPACING.xl }}>
          <View style={styles.chartHeader}>
            <Award size={16} color={theme.accent.yellow} />
            <KriyaText variant="label" color={theme.text.secondary} style={{ marginLeft: 8, letterSpacing: 1 }}>HABIT STREAKS</KriyaText>
          </View>
          {habits.sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5).map((h) => {
            const pct = maxStreak > 0 ? Math.min(((h.streak || 0) / maxStreak) * 100, 100) : 0;
            const color = h.color || theme.accent.primary;
            return (
              <View key={h.id} style={styles.streakRow}>
                <Text style={{ fontSize: 16, width: 24 }}>{h.icon || '🎯'}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={styles.streakLabelRow}>
                    <KriyaText variant="caption" color={theme.text.primary} style={{ fontWeight: '600' }}>{h.name}</KriyaText>
                    <KriyaText variant="caption" color={color} style={{ fontWeight: '700' }}>{h.streak || 0}d 🔥</KriyaText>
                  </View>
                  <View style={[styles.streakTrack, { backgroundColor: theme.border.subtle }]}>
                    <View style={[styles.streakFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  gradWrap:      { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  header:        { paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  badgeRow:      { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  statBadge:     { flex: 1, alignItems: 'center', padding: SPACING.sm, borderRadius: RADIUS.xl, borderWidth: 1 },
  statIcon:      { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  chartBars:     { flexDirection: 'row', alignItems: 'flex-end', gap: 4, justifyContent: 'space-between' },
  chartLegend:   { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: 6 },
  legendDot:     { width: 8, height: 8, borderRadius: 4 },
  streakRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  streakLabelRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  streakTrack:   { height: 6, borderRadius: 3, overflow: 'hidden' },
  streakFill:    { height: '100%', borderRadius: 3 },
});
