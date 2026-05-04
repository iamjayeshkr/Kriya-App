import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import KriyaText from '../../components/KriyaText';
import Button from '../../components/Button';
import { SPACING, RADIUS } from '../../constants/theme';

const ROLES = [
  {
    id: 'student', emoji: '🎓', label: 'Student', tagline: 'Ace exams & assignments',
    color: '#60a5fa', gradient: ['#60a5fa22', '#60a5fa08'],
    features: ['📚 Syllabus tracker', '⏱️ Pomodoro study timer', '📝 Assignment tasks', '🔥 Study streaks', '📊 Weekly progress'],
    problems: 'Procrastination, exam pressure, managing subjects',
  },
  {
    id: 'developer', emoji: '💻', label: 'Developer', tagline: 'Ship code, crush deadlines',
    color: '#a78bfa', gradient: ['#a78bfa22', '#a78bfa08'],
    features: ['🚀 Project sprints', '🐛 Bug tracking tasks', '⏱️ Deep work sessions', '📋 PR checklists', '📈 Commit streaks'],
    problems: 'Context switching, scope creep, focus blocks',
  },
  {
    id: 'medical', emoji: '🏥', label: 'Medical', tagline: 'MBBS/NEET warrior mode',
    color: '#34d399', gradient: ['#34d39922', '#34d39908'],
    features: ['📖 Subject revision tasks', '💊 Clinical schedules', '⏱️ MCQ sessions', '🔬 Lab habits', '📊 Ward round logs'],
    problems: 'Vast syllabus, clinical shifts, mental fatigue',
  },
  {
    id: 'teacher', emoji: '📖', label: 'Teacher', tagline: 'Educate, inspire, lead',
    color: '#fb923c', gradient: ['#fb923c22', '#fb923c08'],
    features: ['📅 Lesson planning tasks', '✅ Assignment grading', '⏱️ Class prep timer', '📋 Curriculum habits', '📊 Student tracking'],
    problems: 'Lesson prep, grading overload, time management',
  },
];

export default function RoleSelectScreen() {
  const { theme, isDark } = useTheme();
  const { setUserRole, user } = useApp();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try { await setUserRole(selected); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const selectedRole = ROLES.find((r) => r.id === selected);

  return (
    <LinearGradient
      colors={isDark ? ['#0f0f17', '#0d1020', '#0f0f17'] : ['#f5f3ff', '#ede9fe', '#faf8ff']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.blob1, { backgroundColor: (selectedRole?.color || theme.accent.primary) + '20' }]} />
        <View style={[styles.blob2, { backgroundColor: theme.accent.secondary + '15' }]} />

        <View style={styles.header}>
          <KriyaText style={{ fontSize: 40 }}>👋</KriyaText>
          <KriyaText variant="title" style={{ marginTop: SPACING.sm, textAlign: 'center' }}>
            Welcome, {user?.name?.split(' ')[0]}!
          </KriyaText>
          <KriyaText variant="body" color={theme.text.secondary} style={{ textAlign: 'center', marginTop: 6, lineHeight: 22 }}>
            Tell us who you are so Kriya can be{'\n'}your perfect productivity companion.
          </KriyaText>
        </View>

        <View style={styles.grid}>
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <TouchableOpacity
                key={role.id} onPress={() => setSelected(role.id)} activeOpacity={0.8}
                style={[styles.roleCard, {
                  backgroundColor: isSelected ? role.color + '18' : theme.bg.card,
                  borderColor: isSelected ? role.color : theme.border.default,
                  borderWidth: isSelected ? 2 : 1,
                }]}
              >
                {isSelected && (
                  <LinearGradient colors={role.gradient} style={StyleSheet.absoluteFill} />
                )}
                <View style={styles.roleTop}>
                  <KriyaText style={{ fontSize: 34 }}>{role.emoji}</KriyaText>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: role.color }]}>
                      <KriyaText style={{ color: '#fff', fontSize: 13, fontWeight: '900' }}>✓</KriyaText>
                    </View>
                  )}
                </View>
                <KriyaText variant="caption" style={{ fontWeight: '800', fontSize: 15, color: isSelected ? role.color : theme.text.primary }}>
                  {role.label}
                </KriyaText>
                <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 10, marginTop: 2, textAlign: 'center' }}>
                  {role.tagline}
                </KriyaText>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedRole && (
          <View style={[styles.preview, { backgroundColor: theme.bg.card, borderColor: selectedRole.color + '40', borderWidth: 1 }]}>
            <LinearGradient colors={[selectedRole.color + '15', 'transparent']} style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.xl }]} />
            <KriyaText variant="label" color={selectedRole.color} style={{ letterSpacing: 1.5, marginBottom: SPACING.sm }}>
              🎯 WHAT'S UNLOCKED FOR YOU
            </KriyaText>
            {selectedRole.features.map((f, i) => (
              <KriyaText key={i} variant="caption" color={theme.text.secondary} style={{ marginBottom: 4, fontSize: 13 }}>{f}</KriyaText>
            ))}
            <View style={[styles.problemChip, { backgroundColor: selectedRole.color + '15', borderColor: selectedRole.color + '30' }]}>
              <KriyaText variant="caption" color={selectedRole.color} style={{ fontSize: 11 }}>
                💡 Solves: {selectedRole.problems}
              </KriyaText>
            </View>
          </View>
        )}

        <Button
          title={selected ? `ENTER AS ${selectedRole?.label?.toUpperCase()}` : 'SELECT YOUR ROLE'}
          onPress={handleContinue} loading={loading} size="lg"
          style={{ marginTop: SPACING.lg, opacity: selected ? 1 : 0.5 }}
        />
        <KriyaText variant="caption" color={theme.text.muted} style={{ textAlign: 'center', marginTop: SPACING.sm, fontSize: 11 }}>
          You can change this anytime in Settings
        </KriyaText>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1, padding: SPACING.lg, paddingTop: 60, paddingBottom: 40 },
  blob1:       { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -100, right: -80, opacity: 0.6 },
  blob2:       { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 200, left: -60, opacity: 0.5 },
  header:      { alignItems: 'center', marginBottom: SPACING.xl },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: SPACING.lg },
  roleCard:    { width: '47%', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.xl, overflow: 'hidden', minHeight: 110 },
  roleTop:     { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 6 },
  checkBadge:  { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  preview:     { borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, overflow: 'hidden' },
  problemChip: { borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1, marginTop: SPACING.sm },
});
