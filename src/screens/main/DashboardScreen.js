import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { CheckSquare, Flame, Timer, ArrowRight, TrendingUp, Zap, Star, BookOpen, Code, Stethoscope, GraduationCap } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Card from '../../components/Card';
import TaskItem from '../../components/TaskItem';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, MOTIVATIONAL_QUOTES, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

/**
 * ROLE_CONFIG: Defines the visual style and content for different user roles.
 * Each role has a specific color, emoji, greeting suffix, tips, and quick actions.
 */
const ROLE_CONFIG = {
  student: {
    color: '#60a5fa', emoji: '🎓', label: 'Student Mode',
    greeting_suffix: '— Study hard!',
    tips: ['📚 Break your syllabus into daily goals', '⏱️ Use 25-min Pomodoros for each subject', '🔥 Build a revision habit daily'],
    quickActions: [
      { label: 'Add Study Task', screen: 'Tasks', emoji: '📚' },
      { label: 'Study Timer',    screen: 'Focus',  emoji: '⏱️' },
      { label: 'View Progress',  screen: 'Analytics', emoji: '📊' },
    ],
  },
  developer: {
    color: '#a78bfa', emoji: '💻', label: 'Dev Mode',
    greeting_suffix: '— Ship it!',
    tips: ['🚀 Use tasks as your sprint board', '⏱️ Deep work: 90-min no-distraction blocks', '🔁 Build a daily code commit habit'],
    quickActions: [
      { label: 'New Feature',  screen: 'Tasks', emoji: '🚀' },
      { label: 'Deep Work',    screen: 'Focus',  emoji: '⏱️' },
      { label: 'Sprint Stats', screen: 'Analytics', emoji: '📈' },
    ],
  },
  medical: {
    color: '#34d399', emoji: '🏥', label: 'Medical Mode',
    greeting_suffix: '— Save lives!',
    tips: ['📖 Revise one system per day', '⏱️ Use Pomodoro for MCQ practice', '💊 Log clinical habits daily'],
    quickActions: [
      { label: 'Add Revision', screen: 'Tasks', emoji: '📖' },
      { label: 'MCQ Session', screen: 'Focus',  emoji: '⏱️' },
      { label: 'Progress',    screen: 'Analytics', emoji: '🔬' },
    ],
  },
  teacher: {
    color: '#fb923c', emoji: '📖', label: 'Teacher Mode',
    greeting_suffix: '— Inspire!',
    tips: ['📅 Plan your lessons weekly', '⏱️ Use prep timer before each class', '✅ Habit: mark attendance daily'],
    quickActions: [
      { label: 'Lesson Plan', screen: 'Tasks', emoji: '📅' },
      { label: 'Prep Timer',  screen: 'Focus',  emoji: '⏱️' },
      { label: 'Weekly View', screen: 'Analytics', emoji: '📊' },
    ],
  },
};

/**
 * Returns a time-appropriate greeting string based on the current hour.
 */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night 🌙';
  if (h < 12) return 'Good morning ☀️';
  if (h < 17) return 'Good afternoon ⚡';
  return 'Good evening 🌆';
}

/**
 * MiniStatCard: A small UI card displaying a single statistic (e.g., tasks done).
 * @param {string} label - The label for the stat.
 * @param {string|number} value - The main value to display.
 * @param {string} sub - Secondary information (e.g., "/5").
 * @param {string} color - The accent color for the stat.
 * @param {React.Component} icon - The icon component to display.
 */
function MiniStatCard({ label, value, sub, color, icon: Icon }) {
  const { theme, isDark } = useTheme();
  const S = isDark ? SHADOWS.dark : SHADOWS.light;
  return (
    <View style={[styles.miniStat, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, S?.sm]}>
      <View style={[styles.miniStatIcon, { backgroundColor: color + '18' }]}>
        <Icon size={16} color={color} strokeWidth={2} />
      </View>
      <KriyaText variant="heading" color={color} style={{ fontSize: 24, lineHeight: 28 }}>{value}</KriyaText>
      <KriyaText variant="label" color={theme.text.secondary} style={{ fontSize: 9, marginTop: 2 }}>{label}</KriyaText>
      {sub && <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 9 }}>{sub}</KriyaText>}
    </View>
  );
}

/**
 * DashboardScreen: The main landing screen after login.
 * Displays a summary of today's progress, stats, pending tasks, habits, and role-based tips.
 */
export default function DashboardScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { user, tasks, habits, focusSessions } = useApp();

  // Load configuration based on the user's selected role
  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.student;
  const roleColor  = roleConfig.color;

  const today    = format(new Date(), 'yyyy-MM-dd');
  const todayDow = new Date().getDay();

  // Memoize the quote so it doesn't change on every re-render, only every hour
  const quote    = useMemo(() => MOTIVATIONAL_QUOTES[new Date().getHours() % MOTIVATIONAL_QUOTES.length], []);

  // Calculate statistics for today
  const todayTasks     = tasks.filter((t) => t.dueDate?.startsWith(today) || t.createdAt?.startsWith(today));
  const completedToday = todayTasks.filter((t) => t.completed).length;

  const todayHabits = habits.filter((h) => !h.scheduledDays?.length || h.scheduledDays.includes(todayDow));
  const doneHabits  = todayHabits.filter((h) => h.completedDates?.includes(today)).length;

  const todaySessions = focusSessions.filter((s) => s.date?.startsWith(today));
  const focusMinutes  = todaySessions.reduce((a, s) => a + (s.duration || 0), 0);

  // Overall progress percentage
  const totalItems = todayTasks.length + todayHabits.length;
  const doneItems  = completedToday + doneHabits;
  const pct        = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const pendingTasks = todayTasks.filter((t) => !t.completed).slice(0, 3);
  const maxStreak    = habits.reduce((m, h) => Math.max(m, h.streak || 0), 0);

  // Background gradient colors based on theme
  const gradColors = isDark
    ? [roleColor + '22', theme.accent.secondary + '10', 'transparent']
    : [roleColor + '12', theme.accent.secondary + '08', 'transparent'];

  return (
    <ScreenWrapper>
      <View style={styles.heroGradWrap} pointerEvents="none">
        <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} />
      </View>

      {/* Header row */}
      <View style={[styles.headerRow, { zIndex: 1 }]}>
        <View style={{ flex: 1 }}>
          <View style={styles.roleTag}>
            <Text style={{ fontSize: 12 }}>{roleConfig.emoji}</Text>
            <KriyaText variant="caption" color={roleColor} style={{ letterSpacing: 1.5, marginLeft: 4, fontSize: 10 }}>
              {roleConfig.label.toUpperCase()}
            </KriyaText>
          </View>
          <KriyaText variant="caption" color={theme.text.secondary} style={{ marginBottom: 2 }}>
            {format(new Date(), 'EEEE, MMM d').toUpperCase()}
          </KriyaText>
          <KriyaText variant="heading" style={{ fontSize: 20 }}>{getGreeting()}</KriyaText>
          <KriyaText variant="title" color={theme.text.primary} style={{ fontSize: 26 }}>{user?.name?.split(' ')[0]}</KriyaText>
        </View>
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: roleColor + '18', borderColor: roleColor + '50' }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <KriyaText variant="heading" color={roleColor} style={{ fontSize: 20 }}>
            {user?.name?.[0]?.toUpperCase()}
          </KriyaText>
        </TouchableOpacity>
      </View>

      {/* Hero progress card */}
      <Card variant="accent" glow style={{ marginBottom: SPACING.lg, padding: 0, overflow: 'hidden' }}>
        <LinearGradient
          colors={isDark ? [roleColor + '25', theme.bg.card] : [roleColor + '12', theme.bg.card]}
          style={styles.heroCard}
        >
          <View style={styles.heroLeft}>
            <KriyaText variant="label" color={roleColor} style={{ letterSpacing: 1.5, marginBottom: 4 }}>TODAY'S PROGRESS</KriyaText>
            <KriyaText style={{ fontSize: 56, fontWeight: '900', color: roleColor, lineHeight: 60 }}>
              {pct}<Text style={{ fontSize: 22, fontWeight: '700' }}>%</Text>
            </KriyaText>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: roleColor }]} />
            </View>
            <KriyaText variant="caption" color={theme.text.secondary} style={{ marginTop: 6 }}>
              {doneItems} of {totalItems} done
            </KriyaText>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroRight}>
            <Star size={14} color={theme.accent.secondary} />
            <KriyaText variant="caption" color={theme.text.secondary} style={{ fontStyle: 'italic', lineHeight: 18, marginTop: 6 }}>
              "{quote.text}"
            </KriyaText>
            <KriyaText variant="caption" color={theme.text.muted} style={{ marginTop: 4 }}>— {quote.author}</KriyaText>
          </View>
        </LinearGradient>
      </Card>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <MiniStatCard label="TASKS" value={completedToday} sub={`/${todayTasks.length}`} color={theme.accent.blue} icon={CheckSquare} />
        <MiniStatCard label="FOCUS" value={`${focusMinutes}m`} sub={`${todaySessions.length} sess`} color={roleColor} icon={Timer} />
        <MiniStatCard label="HABITS" value={doneHabits} sub={`/${todayHabits.length}`} color={theme.accent.secondary} icon={Flame} />
        <MiniStatCard label="STREAK" value={maxStreak} sub="days" color={theme.accent.orange} icon={TrendingUp} />
      </View>

      {/* Role tips */}
      <View style={[styles.tipCard, { backgroundColor: roleColor + '10', borderColor: roleColor + '30' }]}>
        <KriyaText variant="label" color={roleColor} style={{ letterSpacing: 1.2, marginBottom: SPACING.xs }}>
          {roleConfig.emoji} {roleConfig.label.toUpperCase()} TIPS
        </KriyaText>
        {roleConfig.tips.map((tip, i) => (
          <KriyaText key={i} variant="caption" color={theme.text.secondary} style={{ marginBottom: 3, fontSize: 12 }}>{tip}</KriyaText>
        ))}
      </View>

      {/* Pending tasks */}
      <View style={styles.sectionRow}>
        <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5 }}>TODAY'S TASKS</KriyaText>
        <TouchableOpacity onPress={() => navigation.navigate('Tasks')} style={styles.seeAllBtn}>
          <KriyaText variant="caption" color={roleColor}>See all</KriyaText>
          <ArrowRight size={13} color={roleColor} />
        </TouchableOpacity>
      </View>

      {pendingTasks.length === 0 ? (
        <Card style={{ marginBottom: SPACING.md, alignItems: 'center', padding: SPACING.lg }}>
          <KriyaText style={{ fontSize: 32, marginBottom: 8 }}>✅</KriyaText>
          <KriyaText variant="subheading" style={{ marginBottom: 4 }}>All caught up!</KriyaText>
          <KriyaText variant="caption" color={theme.text.secondary}>No pending tasks for today</KriyaText>
        </Card>
      ) : (
        pendingTasks.map((task) => (
          <TaskItem
            key={task.id} task={task} showDelete={false}
            onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetail', params: { taskId: task.id } })}
          />
        ))
      )}

      {/* Habit chips */}
      <View style={styles.sectionRow}>
        <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5 }}>HABITS TODAY</KriyaText>
        <TouchableOpacity onPress={() => navigation.navigate('Analytics')} style={styles.seeAllBtn}>
          <KriyaText variant="caption" color={roleColor}>Analytics</KriyaText>
          <ArrowRight size={13} color={roleColor} />
        </TouchableOpacity>
      </View>

      {todayHabits.length === 0 ? (
        <Card style={{ marginBottom: SPACING.lg, alignItems: 'center', padding: SPACING.md }}>
          <KriyaText variant="caption" color={theme.text.muted}>No habits scheduled for today</KriyaText>
        </Card>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20, marginBottom: SPACING.lg }}>
          {todayHabits.map((habit) => {
            const done  = habit.completedDates?.includes(today);
            const color = habit.color || roleColor;
            return (
              <Card key={habit.id} style={{ alignItems: 'center', padding: SPACING.sm + 4, marginRight: 10, minWidth: 80, borderColor: done ? color + '60' : theme.border.default, backgroundColor: done ? color + '12' : theme.bg.card }}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{habit.icon || '🎯'}</Text>
                <KriyaText variant="caption" color={done ? color : theme.text.secondary} style={{ textAlign: 'center', fontSize: 10 }} numberOfLines={2}>{habit.name}</KriyaText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <Flame size={10} color={done ? color : theme.text.muted} />
                  <KriyaText variant="caption" color={done ? color : theme.text.muted} style={{ fontSize: 9 }}>{habit.streak || 0}d</KriyaText>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      )}

      {/* Role-based Quick actions */}
      <View style={styles.quickRow}>
        {roleConfig.quickActions.map((q) => (
          <TouchableOpacity
            key={q.label}
            onPress={() => navigation.navigate(q.screen)}
            style={[styles.quickBtn, { backgroundColor: roleColor + '18', borderColor: roleColor + '40' }]}
          >
            <Text style={{ fontSize: 18 }}>{q.emoji}</Text>
            <KriyaText variant="caption" color={roleColor} style={{ fontWeight: '700', marginTop: 4, fontSize: 10, textAlign: 'center' }}>
              {q.label}
            </KriyaText>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroGradWrap:  { position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 0 },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  roleTag:       { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  avatar:        { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  heroCard:      { flexDirection: 'row', padding: SPACING.lg, minHeight: 150 },
  heroLeft:      { flex: 1, paddingRight: SPACING.md },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 10, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 2 },
  heroDivider:   { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginRight: SPACING.md },
  heroRight:     { flex: 1, justifyContent: 'center' },
  statsRow:      { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  miniStat:      { flex: 1, borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.sm, alignItems: 'flex-start' },
  miniStatIcon:  { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tipCard:       { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.md, marginBottom: SPACING.lg },
  sectionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  seeAllBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quickRow:      { flexDirection: 'row', gap: 10, marginBottom: SPACING.xl },
  quickBtn:      { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1 },
});
