// src/screens/main/HabitsScreen.js — with scheduling, icons, linked tasks
import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Modal,
  KeyboardAvoidingView, Platform, ScrollView, Text,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Plus, X, Flame, Calendar, Link, ChevronDown, ChevronUp } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Input from '../../components/Input';
import Button from '../../components/Button';
import HabitItem from '../../components/HabitItem';
import EmptyState from '../../components/EmptyState';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, HABIT_ICONS, WEEKDAYS } from '../../constants/theme';
import { format } from 'date-fns';

const COLORS = ['#a78bfa', '#5bc4d6', '#a78bfa', '#f4a05e', '#f07070', '#f5c842', '#34d399', '#f472b6'];

export default function HabitsScreen() {
  const { theme } = useTheme();
  const { habits, tasks, addHabit } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [scheduledDays, setScheduledDays] = useState([]); // [] = every day
  const [linkedTaskIds, setLinkedTaskIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDow = new Date().getDay(); // 0=Sun

  // Only show habits scheduled for today (empty scheduledDays = every day)
  const todayHabits = habits.filter((h) =>
    !h.scheduledDays || h.scheduledDays.length === 0 || h.scheduledDays.includes(todayDow)
  );
  const completedToday = todayHabits.filter((h) => h.completedDates?.includes(today)).length;
  const completionRate = todayHabits.length > 0 ? Math.round((completedToday / todayHabits.length) * 100) : 0;

  // Active tasks for linking
  const activeTasks = tasks.filter((t) => !t.completed);

  const toggleDay = (day) => {
    setScheduledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTask = (taskId) => {
    setLinkedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 200));
    addHabit({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      scheduledDays,
      linkedTaskIds,
    });
    handleClose();
    setCreating(false);
  }, [name, selectedColor, selectedIcon, scheduledDays, linkedTaskIds, addHabit]);

  const handleClose = () => {
    setName('');
    setSelectedColor(COLORS[0]);
    setSelectedIcon(HABIT_ICONS[0]);
    setScheduledDays([]);
    setLinkedTaskIds([]);
    setShowAdvanced(false);
    setShowModal(false);
  };

  const scheduleLabel = scheduledDays.length === 0
    ? 'Every day'
    : scheduledDays.sort().map((d) => WEEKDAYS[d]).join(', ');

  return (
    <>
      <ScreenWrapper>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <KriyaText variant="label" color={theme.accent.primary} style={{ letterSpacing: 2 }}>
              HABITS
            </KriyaText>
            <KriyaText variant="title">{habits.length} Tracked</KriyaText>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.accent.primary }]}
            onPress={() => setShowModal(true)}
          >
            <Plus size={22} color={theme.text.inverse} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Progress Banner */}
        {todayHabits.length > 0 && (
          <View style={[styles.banner, { backgroundColor: theme.bg.card, borderColor: theme.border.accent }]}>
            <View style={styles.bannerLeft}>
              <KriyaText variant="caption" color={theme.text.secondary}>Today</KriyaText>
              <KriyaText variant="heading" color={theme.accent.primary}>{completedToday}/{todayHabits.length}</KriyaText>
              <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 10 }}>{scheduleToday()}</KriyaText>
            </View>
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: theme.border.default }]}>
                <View style={[styles.progressFill, { width: `${completionRate}%`, backgroundColor: theme.accent.primary }]} />
              </View>
              <KriyaText variant="label" color={theme.accent.primary} style={{ marginTop: 6 }}>
                {completionRate}% complete
              </KriyaText>
            </View>
          </View>
        )}

        {/* All Habits / Today toggle */}
        {habits.length > 0 && todayHabits.length !== habits.length && (
          <KriyaText variant="caption" color={theme.text.muted} style={{ marginBottom: SPACING.sm }}>
            {habits.length - todayHabits.length} habit(s) not scheduled for today
          </KriyaText>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <EmptyState
            icon={Flame}
            title="No habits yet"
            subtitle="Build consistency by tracking daily habits with streaks"
            action={<Button title="Add Habit" onPress={() => setShowModal(true)} size="md" />}
          />
        ) : (
          habits.map((habit) => <HabitItem key={habit.id} habit={habit} />)
        )}
      </ScreenWrapper>

      {/* Add Habit Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={[styles.modalOverlay, { backgroundColor: theme.bg.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.modalHeader}>
                  <KriyaText variant="heading">New Habit</KriyaText>
                  <TouchableOpacity onPress={handleClose}>
                    <X size={22} color={theme.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Icon picker */}
                <KriyaText variant="label" color={theme.text.secondary} style={{ marginBottom: 8 }}>Icon</KriyaText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
                  {HABIT_ICONS.map((ic) => (
                    <TouchableOpacity
                      key={ic}
                      onPress={() => setSelectedIcon(ic)}
                      style={[
                        styles.iconBtn,
                        { backgroundColor: selectedIcon === ic ? selectedColor + '30' : theme.bg.card,
                          borderColor: selectedIcon === ic ? selectedColor : theme.border.default },
                      ]}
                    >
                      <Text style={{ fontSize: 22 }}>{ic}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Input
                  label="Habit Name"
                  placeholder="e.g. Read for 30 minutes"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="sentences"
                />

                {/* Color */}
                <KriyaText variant="label" color={theme.text.secondary} style={{ marginBottom: 10 }}>Color</KriyaText>
                <View style={styles.colorsRow}>
                  {COLORS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                      onPress={() => setSelectedColor(c)}
                    />
                  ))}
                </View>

                {/* Advanced toggle */}
                <TouchableOpacity
                  style={[styles.advancedToggle, { borderColor: theme.border.default }]}
                  onPress={() => setShowAdvanced(!showAdvanced)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color={theme.text.secondary} />
                    <KriyaText variant="caption" color={theme.text.secondary}>Schedule & Link Tasks</KriyaText>
                  </View>
                  {showAdvanced
                    ? <ChevronUp size={16} color={theme.text.muted} />
                    : <ChevronDown size={16} color={theme.text.muted} />
                  }
                </TouchableOpacity>

                {showAdvanced && (
                  <>
                    {/* Days of week */}
                    <KriyaText variant="label" color={theme.text.secondary} style={{ marginTop: SPACING.md, marginBottom: 8 }}>
                      Schedule Days <KriyaText variant="caption" color={theme.text.muted}>(empty = every day)</KriyaText>
                    </KriyaText>
                    <View style={styles.daysRow}>
                      {WEEKDAYS.map((day, idx) => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => toggleDay(idx)}
                          style={[
                            styles.dayBtn,
                            {
                              backgroundColor: scheduledDays.includes(idx) ? selectedColor : theme.bg.card,
                              borderColor: scheduledDays.includes(idx) ? selectedColor : theme.border.default,
                            },
                          ]}
                        >
                          <Text style={{
                            fontSize: 11, fontWeight: '700',
                            color: scheduledDays.includes(idx) ? theme.text.inverse : theme.text.secondary,
                          }}>
                            {day.slice(0, 1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <KriyaText variant="caption" color={theme.accent.primary} style={{ marginBottom: SPACING.md }}>
                      {scheduleLabel}
                    </KriyaText>

                    {/* Link to tasks */}
                    {activeTasks.length > 0 && (
                      <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Link size={14} color={theme.text.secondary} />
                          <KriyaText variant="label" color={theme.text.secondary}>Link to Tasks</KriyaText>
                        </View>
                        {activeTasks.slice(0, 6).map((task) => (
                          <TouchableOpacity
                            key={task.id}
                            onPress={() => toggleTask(task.id)}
                            style={[
                              styles.taskLinkRow,
                              {
                                backgroundColor: linkedTaskIds.includes(task.id) ? selectedColor + '15' : theme.bg.card,
                                borderColor: linkedTaskIds.includes(task.id) ? selectedColor : theme.border.default,
                              },
                            ]}
                          >
                            <View style={[styles.taskLinkDot, {
                              backgroundColor: linkedTaskIds.includes(task.id) ? selectedColor : theme.border.default,
                            }]} />
                            <Text style={{ flex: 1, color: theme.text.primary, fontSize: 13 }} numberOfLines={1}>
                              {task.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </>
                )}

                <Button
                  title="ADD HABIT"
                  onPress={handleCreate}
                  loading={creating}
                  disabled={!name.trim()}
                  size="lg"
                  style={{ marginTop: SPACING.lg }}
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function scheduleToday() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  addBtn: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.lg,
    borderWidth: 1, padding: SPACING.md, marginBottom: SPACING.lg, gap: 16,
  },
  bannerLeft: { alignItems: 'center', minWidth: 72 },
  progressSection: { flex: 1 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0,
    padding: SPACING.lg, paddingBottom: 40, maxHeight: '92%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  iconBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  colorsRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md, flexWrap: 'wrap' },
  colorDot: { width: 34, height: 34, borderRadius: 17 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff', transform: [{ scale: 1.15 }] },
  advancedToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: RADIUS.md, borderWidth: 1, marginBottom: 4,
  },
  daysRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dayBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  taskLinkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10,
    borderRadius: RADIUS.sm, borderWidth: 1, marginBottom: 6,
  },
  taskLinkDot: { width: 8, height: 8, borderRadius: 4 },
});
