import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Plus, X, CheckSquare, Filter } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TaskItem from '../../components/TaskItem';
import EmptyState from '../../components/EmptyState';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS, TASK_CATEGORIES } from '../../constants/theme';

const PRIORITIES = ['low','medium','high'];
const FILTERS    = ['all','active','completed'];

function isValidDate(s) { return s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T12:00:00')); }

export default function TasksScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { tasks, addTask } = useApp();
  const [showModal, setShowModal]     = useState(false);
  const [filter, setFilter]           = useState('all');
  const [catFilter, setCatFilter]     = useState('all');
  const [title, setTitle]             = useState('');
  const [priority, setPriority]       = useState('medium');
  const [category, setCategory]       = useState('other');
  const [dueDate, setDueDate]         = useState('');
  const [dueDateErr, setDueDateErr]   = useState('');
  const [creating, setCreating]       = useState(false);

  const filtered = useMemo(() =>
    tasks
      .filter((t) => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
      .filter((t) => catFilter === 'all' ? true : t.category === catFilter)
  , [tasks, filter, catFilter]);

  const activeCnt    = tasks.filter((t) => !t.completed).length;
  const completedCnt = tasks.filter((t) => t.completed).length;

  const handleCreate = useCallback(async () => {
    if (!title.trim()) return;
    if (dueDate && !isValidDate(dueDate)) { setDueDateErr('Use YYYY-MM-DD format'); return; }
    setDueDateErr(''); setCreating(true);
    await new Promise((r) => setTimeout(r, 150));
    addTask({ title: title.trim(), priority, category, dueDate: dueDate || null });
    setTitle(''); setPriority('medium'); setCategory('other'); setDueDate(''); setShowModal(false);
    setCreating(false);
  }, [title, priority, category, dueDate, addTask]);

  return (
    <>
      <ScreenWrapper>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <KriyaText variant="label" color={theme.accent.primary} style={{ letterSpacing: 2 }}>TASKS</KriyaText>
            <KriyaText variant="title">{tasks.length} Total</KriyaText>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.accent.primary }]} onPress={() => setShowModal(true)}>
            <Plus size={22} color={theme.text.inverse} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Summary chips */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: theme.accent.secondary + '15', borderColor: theme.accent.secondary + '40' }]}>
            <Text style={{ fontSize: 18 }}>⏳</Text>
            <KriyaText variant="heading" color={theme.accent.secondary} style={{ fontSize: 22 }}>{activeCnt}</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary}>Pending</KriyaText>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: theme.accent.primary + '15', borderColor: theme.border.accent }]}>
            <Text style={{ fontSize: 18 }}>✅</Text>
            <KriyaText variant="heading" color={theme.accent.primary} style={{ fontSize: 22 }}>{completedCnt}</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary}>Done</KriyaText>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: theme.accent.blue + '15', borderColor: theme.accent.blue + '40' }]}>
            <Text style={{ fontSize: 18 }}>📊</Text>
            <KriyaText variant="heading" color={theme.accent.blue} style={{ fontSize: 22 }}>
              {tasks.length > 0 ? Math.round((completedCnt / tasks.length) * 100) : 0}%
            </KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary}>Rate</KriyaText>
          </View>
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.pill, { backgroundColor: filter === f ? theme.accent.primary : theme.bg.card, borderColor: filter === f ? theme.accent.primary : theme.border.default }]}
              onPress={() => setFilter(f)}
            >
              <KriyaText variant="caption" color={filter === f ? theme.text.inverse : theme.text.secondary} style={{ fontWeight: '700', textTransform: 'capitalize' }}>{f}</KriyaText>
            </TouchableOpacity>
          ))}
          <View style={[styles.sep, { backgroundColor: theme.border.default }]} />
          {TASK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, { backgroundColor: catFilter === cat.id ? cat.color + '25' : theme.bg.card, borderColor: catFilter === cat.id ? cat.color : theme.border.default }]}
              onPress={() => setCatFilter(catFilter === cat.id ? 'all' : cat.id)}
            >
              <KriyaText variant="caption" color={catFilter === cat.id ? cat.color : theme.text.secondary} style={{ fontWeight: '600' }}>{cat.label}</KriyaText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks here" subtitle={filter === 'all' ? 'Tap + to add your first task' : 'Try a different filter'}
            action={filter === 'all' && <Button title="Add Task" onPress={() => setShowModal(true)} size="md" />}
          />
        ) : filtered.map((task) => (
          <TaskItem key={task.id} task={task} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
        ))}
      </ScreenWrapper>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={[styles.overlay, { backgroundColor: theme.bg.overlay }]}>
            <View style={[styles.sheet, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <KriyaText variant="heading">New Task</KriyaText>
                <TouchableOpacity onPress={() => setShowModal(false)}><X size={22} color={theme.text.secondary} /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Input label="Task Title" placeholder="What needs to be done?" value={title} onChangeText={setTitle} autoCapitalize="sentences" />

                <KriyaText variant="label" color={theme.text.secondary} style={{ marginBottom: 8 }}>Priority</KriyaText>
                <View style={styles.pillRow}>
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity key={p}
                      style={[styles.priorityBtn, { backgroundColor: priority === p ? theme.priority[p] : theme.bg.card, borderColor: theme.priority[p] }]}
                      onPress={() => setPriority(p)}
                    >
                      <KriyaText variant="caption" color={priority === p ? '#fff' : theme.priority[p]} style={{ fontWeight: '800', textTransform: 'capitalize' }}>{p}</KriyaText>
                    </TouchableOpacity>
                  ))}
                </View>

                <KriyaText variant="label" color={theme.text.secondary} style={{ marginTop: SPACING.md, marginBottom: 8 }}>Category</KriyaText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {TASK_CATEGORIES.map((cat) => (
                    <TouchableOpacity key={cat.id}
                      style={[styles.catBtn, { backgroundColor: category === cat.id ? cat.color : theme.bg.card, borderColor: cat.color }]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <KriyaText variant="caption" color={category === cat.id ? '#fff' : cat.color} style={{ fontWeight: '700' }}>{cat.label}</KriyaText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Input label="Due Date (optional)" placeholder="YYYY-MM-DD" value={dueDate}
                  onChangeText={(v) => { setDueDate(v); setDueDateErr(''); }} error={dueDateErr} style={{ marginTop: SPACING.md }} />

                <Button title="CREATE TASK" onPress={handleCreate} loading={creating} disabled={!title.trim()} size="lg" style={{ marginTop: SPACING.sm }} />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.lg, marginBottom: SPACING.md },
  addBtn:      { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  summaryRow:  { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  summaryChip: { flex: 1, alignItems: 'center', padding: SPACING.sm, borderRadius: RADIUS.xl, borderWidth: 1, gap: 2 },
  filterScroll:{ marginBottom: SPACING.md, marginHorizontal: -20, paddingHorizontal: 20 },
  pill:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1, marginRight: 8, height: 34, justifyContent: 'center' },
  sep:         { width: 1, height: 34, marginRight: 8 },
  overlay:     { flex: 1, justifyContent: 'flex-end' },
  sheet:       { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: SPACING.lg, paddingBottom: 40, maxHeight: '90%' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#ffffff20', borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.md },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  pillRow:     { flexDirection: 'row', gap: 10, marginBottom: 4 },
  priorityBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.full, borderWidth: 1.5 },
  catBtn:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1, marginRight: 8 },
});
