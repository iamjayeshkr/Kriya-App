import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { CheckCircle, Circle, Trash2, Calendar } from 'lucide-react-native';
import { RADIUS, SPACING, TASK_CATEGORIES, SHADOWS } from '../constants/theme';

export default function TaskItem({ task, onPress, showDelete = true }) {
  const { theme, isDark } = useTheme();
  const { toggleTask, deleteTask } = useApp();
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const S = isDark ? SHADOWS.dark : SHADOWS.light;

  const category = TASK_CATEGORIES.find((c) => c.id === task.category) || TASK_CATEGORIES[5];
  const pColor   = theme.priority[task.priority] || theme.accent.secondary;

  const handleToggle = useCallback(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 50 }),
    ]).start();
    toggleTask(task.id);
  }, [task.id]);

  const handleDelete = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => deleteTask(task.id));
  }, [task.id]);

  const due = task.dueDate ? new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' }) : null;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity, marginBottom: SPACING.sm }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.bg.card, borderColor: task.completed ? theme.border.subtle : theme.border.default }, S.sm]}
        onPress={onPress} activeOpacity={0.8}
      >
        {/* Priority stripe */}
        <View style={[styles.stripe, { backgroundColor: pColor }]} />

        <TouchableOpacity onPress={handleToggle} style={styles.check} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          {task.completed
            ? <CheckCircle size={24} color={theme.accent.primary} strokeWidth={2} />
            : <Circle      size={24} color={theme.text.muted}     strokeWidth={1.5} />
          }
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, { color: task.completed ? theme.text.muted : theme.text.primary }, task.completed && { textDecorationLine: 'line-through', opacity: 0.5 }]} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.tag, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.tagTxt, { color: category.color }]}>{category.label}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: pColor + '20' }]}>
              <Text style={[styles.tagTxt, { color: pColor, textTransform: 'capitalize' }]}>{task.priority}</Text>
            </View>
            {due && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Calendar size={10} color={theme.text.muted} />
                <Text style={{ fontSize: 10, color: theme.text.muted }}>{due}</Text>
              </View>
            )}
          </View>
        </View>

        {showDelete && (
          <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash2 size={16} color={theme.text.muted} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.xl, borderWidth: 1, overflow: 'hidden', minHeight: 68 },
  stripe:    { width: 4, alignSelf: 'stretch' },
  check:     { paddingHorizontal: 12, paddingVertical: 8 },
  content:   { flex: 1, paddingVertical: 12, paddingRight: 8 },
  title:     { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 6 },
  meta:      { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  tag:       { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagTxt:    { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});
