// src/components/HabitItem.js — with icon, schedule badge, linked tasks, animated check
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CheckCircle, Circle, Flame, Trash2, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { RADIUS, SPACING, WEEKDAYS } from '../constants/theme';

export default function HabitItem({ habit }) {
  const { theme } = useTheme();
  const { toggleHabit, deleteHabit, tasks } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = habit.completedDates?.includes(today);
  const scale = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.8, useNativeDriver: true, speed: 60 }),
      Animated.spring(checkScale, { toValue: 1.15, useNativeDriver: true, speed: 40 }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    toggleHabit(habit.id);
  };

  const color = habit.color || theme.accent.primary;
  const icon = habit.icon || '🎯';

  // Schedule label
  const schedDays = habit.scheduledDays || [];
  const schedLabel = schedDays.length === 0
    ? 'Daily'
    : schedDays.sort().map((d) => WEEKDAYS[d]).join(' · ');

  // Linked tasks
  const linkedTaskIds = habit.linkedTaskIds || [];
  const linkedTasks = (typeof tasks !== 'undefined' ? tasks : []).filter((t) => linkedTaskIds.includes(t.id));

  // Today is a scheduled day?
  const todayDow = new Date().getDay();
  const isScheduledToday = schedDays.length === 0 || schedDays.includes(todayDow);

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: SPACING.sm }}>
      <View style={[
        styles.container,
        {
          backgroundColor: isCompleted ? color + '0d' : theme.bg.card,
          borderColor: isCompleted ? color + '40' : theme.border.default,
          opacity: isScheduledToday ? 1 : 0.55,
        },
      ]}>
        {/* Color bar */}
        <View style={[styles.colorBar, { backgroundColor: color }]} />

        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.name, { color: theme.text.primary }]} numberOfLines={1}>
            {habit.name}
          </Text>
          <View style={styles.metaRow}>
            <Flame size={12} color={isCompleted ? color : theme.text.muted} />
            <Text style={[styles.metaText, { color: theme.text.secondary }]}>
              {' '}{habit.streak || 0}d streak
            </Text>
            {schedDays.length > 0 && (
              <>
                <View style={[styles.dot, { backgroundColor: theme.text.muted }]} />
                <Calendar size={11} color={theme.text.muted} />
                <Text style={[styles.metaText, { color: theme.text.muted }]}> {schedLabel}</Text>
              </>
            )}
          </View>
          {linkedTasks.length > 0 && (
            <View style={styles.linkedRow}>
              {linkedTasks.slice(0, 2).map((t) => (
                <View key={t.id} style={[styles.linkedBadge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
                  <Text style={[styles.linkedText, { color }]} numberOfLines={1}>{t.title}</Text>
                </View>
              ))}
              {linkedTasks.length > 2 && (
                <Text style={[styles.metaText, { color: theme.text.muted }]}>+{linkedTasks.length - 2}</Text>
              )}
            </View>
          )}
        </View>

        {/* Right actions */}
        <View style={styles.right}>
          <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Trash2 size={14} color={theme.text.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggle} style={styles.checkBtn} disabled={!isScheduledToday}>
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              {isCompleted
                ? <CheckCircle size={28} color={color} strokeWidth={2.5} />
                : <Circle size={28} color={isScheduledToday ? theme.text.muted : theme.text.muted} strokeWidth={1.5} />
              }
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.lg, borderWidth: 1, overflow: 'hidden',
    minHeight: 72,
  },
  colorBar: { width: 4, alignSelf: 'stretch' },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  content: { flex: 1, paddingVertical: 12, paddingLeft: 12, paddingRight: 4 },
  name: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaText: { fontSize: 11 },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 6 },
  linkedRow: { flexDirection: 'row', gap: 4, marginTop: 5, flexWrap: 'wrap' },
  linkedBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, maxWidth: 120 },
  linkedText: { fontSize: 10, fontWeight: '600' },
  right: { flexDirection: 'row', alignItems: 'center', paddingRight: 14, gap: 10 },
  deleteBtn: { padding: 4 },
  checkBtn: { padding: 2 },
});
