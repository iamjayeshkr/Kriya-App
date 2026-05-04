// src/screens/main/TaskDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Trash2, CheckCircle, Circle, Flag, Tag, Calendar } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, TASK_CATEGORIES } from '../../constants/theme';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params || {};
  const { theme } = useTheme();
  const { tasks, toggleTask, deleteTask } = useApp();

  // BUG FIX: Derive task inside render — don't call hooks conditionally
  const task = tasks.find((t) => t.id === taskId);

  // BUG FIX: Guard navigation in useEffect — only navigate back if task disappears
  // after mount (e.g. deleted from another screen), NOT on first render when task
  // may not exist yet due to a bad taskId param.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !task) {
      navigation.goBack();
    }
  }, [task, mounted, navigation]);

  // BUG FIX: Show nothing while loading or task not found — prevents rendering errors
  if (!task) return null;

  const category = TASK_CATEGORIES.find((c) => c.id === task.category) || TASK_CATEGORIES[5];

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={theme.text.secondary} />
        </TouchableOpacity>
        {/* BUG FIX: Wrapped delete in Alert confirmation to prevent accidental deletion */}
        <TouchableOpacity onPress={handleDelete} style={[styles.backBtn, { backgroundColor: theme.accent.red + '15' }]}>
          <Trash2 size={18} color={theme.accent.red} />
        </TouchableOpacity>
      </View>

      {/* Status */}
      <TouchableOpacity style={styles.statusRow} onPress={() => toggleTask(task.id)}>
        {task.completed
          ? <CheckCircle size={28} color={theme.accent.primary} strokeWidth={2} />
          : <Circle size={28} color={theme.text.muted} strokeWidth={1.5} />
        }
        <KriyaText variant="label" color={task.completed ? theme.accent.primary : theme.text.muted} style={{ marginLeft: 10, letterSpacing: 1 }}>
          {task.completed ? 'COMPLETED' : 'IN PROGRESS'}
        </KriyaText>
      </TouchableOpacity>

      {/* Title */}
      <KriyaText
        variant="title"
        style={[styles.title, task.completed && { textDecorationLine: 'line-through', opacity: 0.5 }]}
      >
        {task.title}
      </KriyaText>

      {/* Meta */}
      <View style={styles.metaRow}>
        <Badge label={category.label} color={category.color} size="md" />
        <Badge label={task.priority.toUpperCase()} color={theme.priority[task.priority]} size="md" />
      </View>

      {/* Details Card */}
      <Card style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Flag size={16} color={theme.text.secondary} />
          <KriyaText variant="body" color={theme.text.secondary} style={{ marginLeft: 10 }}>Priority</KriyaText>
          <KriyaText variant="body" color={theme.priority[task.priority]} style={[styles.rightText, { color: theme.priority[task.priority] }]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </KriyaText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border.default }]} />

        <View style={styles.detailRow}>
          <Tag size={16} color={theme.text.secondary} />
          <KriyaText variant="body" color={theme.text.secondary} style={{ marginLeft: 10 }}>Category</KriyaText>
          <KriyaText variant="body" color={category.color} style={[styles.rightText, { color: category.color }]}>
            {category.label}
          </KriyaText>
        </View>

        {task.dueDate && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border.default }]} />
            <View style={styles.detailRow}>
              <Calendar size={16} color={theme.text.secondary} />
              <KriyaText variant="body" color={theme.text.secondary} style={{ marginLeft: 10 }}>Due Date</KriyaText>
              <KriyaText variant="body" color={theme.text.primary} style={styles.rightText}>
                {/* BUG FIX: Append T12:00:00 to avoid timezone shifting the date by 1 day */}
                {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
              </KriyaText>
            </View>
          </>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border.default }]} />

        <View style={styles.detailRow}>
          <KriyaText variant="caption" color={theme.text.muted}>Created</KriyaText>
          <KriyaText variant="caption" color={theme.text.muted} style={styles.rightText}>
            {new Date(task.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </KriyaText>
        </View>

        {task.completedAt && (
          <View style={styles.detailRow}>
            <KriyaText variant="caption" color={theme.accent.primary}>Completed</KriyaText>
            <KriyaText variant="caption" color={theme.accent.primary} style={styles.rightText}>
              {new Date(task.completedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </KriyaText>
          </View>
        )}
      </Card>

      <Button
        title={task.completed ? 'MARK INCOMPLETE' : 'MARK COMPLETE'}
        onPress={() => toggleTask(task.id)}
        variant={task.completed ? 'secondary' : 'primary'}
        size="lg"
        style={{ marginTop: SPACING.lg }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontSize: 26, lineHeight: 34, marginBottom: SPACING.md },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  detailCard: { marginBottom: SPACING.lg },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  // BUG FIX: Replaced marginLeft: 'auto' (works in RN but causes warning on some setups)
  // with flex positioning — the text is pushed right using flex: 1 on the label side
  rightText: { marginLeft: 'auto', fontWeight: '600' },
  divider: { height: 1, marginVertical: 2 },
});
