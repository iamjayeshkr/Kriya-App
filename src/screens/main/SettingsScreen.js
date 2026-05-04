import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Switch, Alert, Text, Modal,
  KeyboardAvoidingView, Platform, Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import {
  Timer, Trash2, LogOut, ChevronRight, Bell, Palette, Shield, User,
  Code2, Heart, Info, RefreshCw, Github, Mail,
} from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ScreenWrapper from '../../components/ScreenWrapper';
import { SPACING, RADIUS } from '../../constants/theme';

const THEMES = [
  { key: 'dark',   label: 'Dark',   sub: 'Navy + violet',   bg: '#0f0f17', ac: '#a78bfa' },
  { key: 'warm',   label: 'Warm',   sub: 'Cream + purple',  bg: '#faf8f5', ac: '#7c3aed' },
  { key: 'amoled', label: 'AMOLED', sub: 'Black + violet',  bg: '#000000', ac: '#c084fc' },
];

const ROLES = [
  { id: 'student',   emoji: '🎓', label: 'Student',   color: '#60a5fa' },
  { id: 'developer', emoji: '💻', label: 'Developer', color: '#a78bfa' },
  { id: 'medical',   emoji: '🏥', label: 'Medical',   color: '#34d399' },
  { id: 'teacher',   emoji: '📖', label: 'Teacher',   color: '#fb923c' },
];

function Row({ icon: Icon, label, sub, right, onPress, color }) {
  const { theme } = useTheme();
  const c = color || theme.accent.primary;
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.border.subtle }]}
      onPress={onPress} disabled={!onPress && !right} activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, { backgroundColor: c + '18' }]}>
        <Icon size={17} color={c} strokeWidth={2} />
      </View>
      <View style={styles.rowBody}>
        <KriyaText variant="caption" style={{ fontSize: 14, fontWeight: '600', color: theme.text.primary }}>{label}</KriyaText>
        {sub && <KriyaText variant="caption" color={theme.text.muted} style={{ marginTop: 1 }}>{sub}</KriyaText>}
      </View>
      <View>{right || (onPress && <ChevronRight size={16} color={theme.text.muted} />)}</View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, themeName, setTheme } = useTheme();
  const { user, logout, settings, updateSettings, resetAllData, setUserRole } = useApp();
  const [showTheme, setShowTheme]   = useState(false);
  const [showTimer, setShowTimer]   = useState(false);
  const [showDev, setShowDev]       = useState(false);
  const [showRole, setShowRole]     = useState(false);
  const [focusDur, setFocusDur]     = useState(String(settings.focusDuration || 25));
  const [breakDur, setBreakDur]     = useState(String(settings.breakDuration || 5));

  useEffect(() => {
    setFocusDur(String(settings.focusDuration || 25));
    setBreakDur(String(settings.breakDuration || 5));
  }, [settings]);

  const current     = THEMES.find((t) => t.key === themeName) || THEMES[0];
  const currentRole = ROLES.find((r) => r.id === user?.role);
  const gradColors  = isDark ? [theme.accent.primary + '18', theme.bg.primary] : [theme.accent.primary + '08', theme.bg.primary];

  return (
    <>
      <ScreenWrapper>
        <View style={styles.gradWrap} pointerEvents="none">
          <LinearGradient colors={gradColors} style={StyleSheet.absoluteFill} />
        </View>

        {/* Profile hero */}
        <View style={styles.profileHero}>
          <LinearGradient
            colors={isDark ? [theme.accent.primary + '30', theme.bg.card] : [theme.accent.primary + '15', theme.bg.card]}
            style={styles.profileGrad}
          >
            <View style={[styles.avatarLarge, { backgroundColor: theme.accent.primary + '20', borderColor: theme.border.accent }]}>
              <KriyaText style={{ fontSize: 32, fontWeight: '900', color: theme.accent.primary, lineHeight: 38, includeFontPadding: false, textAlignVertical: 'center' }}>
                {user?.name?.[0]?.toUpperCase()}
              </KriyaText>
            </View>
            <KriyaText variant="heading" style={{ marginTop: SPACING.sm }}>{user?.name}</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary}>{user?.email}</KriyaText>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
                <KriyaText variant="label" color={theme.text.secondary} style={{ letterSpacing: 1 }}>FREE PLAN</KriyaText>
              </View>
              {currentRole && (
                <TouchableOpacity
                  onPress={() => setShowRole(true)}
                  style={[styles.badge, { backgroundColor: currentRole.color + '18', borderColor: currentRole.color + '50' }]}
                >
                  <KriyaText style={{ fontSize: 12 }}>{currentRole.emoji}</KriyaText>
                  <KriyaText variant="label" color={currentRole.color} style={{ letterSpacing: 1, marginLeft: 4 }}>
                    {currentRole.label.toUpperCase()}
                  </KriyaText>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>PROFILE</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row icon={User} label="Change Role" sub={currentRole ? `Currently: ${currentRole.emoji} ${currentRole.label}` : 'Set your role'} color={currentRole?.color || theme.accent.blue} onPress={() => setShowRole(true)} />
        </Card>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>APPEARANCE</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row icon={Palette} label="Theme" sub={`${current.label} — ${current.sub}`} color={theme.accent.primary} onPress={() => setShowTheme(true)} />
        </Card>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>FOCUS TIMER</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row icon={Timer} label="Timer Durations" sub={`Focus ${settings.focusDuration || 25}min · Break ${settings.breakDuration || 5}min`} color={theme.accent.secondary} onPress={() => setShowTimer(true)} />
        </Card>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>NOTIFICATIONS</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row
            icon={Bell} label="Push Notifications" sub="Focus & task reminders" color={theme.accent.orange}
            right={
              <Switch
                value={settings.notifications ?? true}
                onValueChange={(v) => updateSettings({ notifications: v })}
                trackColor={{ false: theme.border.default, true: theme.accent.primary + '80' }}
                thumbColor={(settings.notifications ?? true) ? theme.accent.primary : theme.text.muted}
              />
            }
          />
        </Card>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>DATA</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row
            icon={Trash2} label="Reset All Data" sub="Clears tasks, habits & sessions" color={theme.accent.red}
            onPress={() => Alert.alert('Reset Data', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: resetAllData },
            ])}
          />
        </Card>

        <KriyaText variant="label" color={theme.text.muted} style={styles.sectionLabel}>ABOUT</KriyaText>
        <Card style={{ padding: 0 }}>
          <Row icon={Shield} label="Kriya v4.0" sub="Built for focus & discipline" color={theme.accent.primary} />
          <Row icon={Code2} label="Know the Developer" sub="The mind behind Kriya" color={theme.accent.blue} onPress={() => setShowDev(true)} />
        </Card>

        <Button
          title="LOG OUT" variant="danger" size="lg" icon={<LogOut size={18} color="#fff" />}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xl }}
          onPress={() => Alert.alert('Log Out?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: logout },
          ])}
        />
      </ScreenWrapper>

      {/* Theme Modal */}
      <Modal visible={showTheme} animationType="slide" transparent onRequestClose={() => setShowTheme(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.bg.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
            <View style={styles.sheetHandle} />
            <KriyaText variant="heading" style={{ marginBottom: SPACING.lg }}>Choose Theme</KriyaText>
            {THEMES.map((t) => (
              <TouchableOpacity key={t.key} onPress={() => { setTheme(t.key); setShowTheme(false); }}
                style={[styles.themeOpt, { backgroundColor: themeName === t.key ? t.ac + '15' : theme.bg.card, borderColor: themeName === t.key ? t.ac : theme.border.default, borderWidth: themeName === t.key ? 2 : 1 }]}>
                <View style={[styles.themeSwatch, { backgroundColor: t.bg, borderColor: theme.border.default }]}>
                  <View style={[styles.themeAccent, { backgroundColor: t.ac }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <KriyaText variant="caption" style={{ fontWeight: '700', fontSize: 15 }}>{t.label}</KriyaText>
                  <KriyaText variant="caption" color={theme.text.secondary}>{t.sub}</KriyaText>
                </View>
                {themeName === t.key && (
                  <View style={[styles.checkDot, { backgroundColor: t.ac }]}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Timer Modal */}
      <Modal visible={showTimer} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={[styles.modalOverlay, { backgroundColor: theme.bg.overlay }]}>
            <View style={[styles.sheet, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
              <View style={styles.sheetHandle} />
              <KriyaText variant="heading" style={{ marginBottom: SPACING.lg }}>Timer Settings</KriyaText>
              <Input label="Focus Duration (minutes)" placeholder="25" value={focusDur} onChangeText={setFocusDur} keyboardType="number-pad" />
              <Input label="Break Duration (minutes)" placeholder="5" value={breakDur} onChangeText={setBreakDur} keyboardType="number-pad" />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: SPACING.sm }}>
                <Button title="Cancel" onPress={() => setShowTimer(false)} variant="ghost" style={{ flex: 1 }} />
                <Button title="Save" style={{ flex: 1 }} onPress={() => {
                  const f = Math.min(Math.max(parseInt(focusDur) || 25, 1), 120);
                  const b = Math.min(Math.max(parseInt(breakDur) || 5, 1), 60);
                  updateSettings({ focusDuration: f, breakDuration: b }); setShowTimer(false);
                }} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Role Change Modal */}
      <Modal visible={showRole} animationType="slide" transparent onRequestClose={() => setShowRole(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.bg.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
            <View style={styles.sheetHandle} />
            <KriyaText variant="heading" style={{ marginBottom: SPACING.sm }}>Change Your Role</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary} style={{ marginBottom: SPACING.lg }}>
              The app adapts to your role — tasks, habits and focus sessions are tailored for you.
            </KriyaText>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => { setUserRole(r.id); setShowRole(false); }}
                style={[styles.themeOpt, {
                  backgroundColor: user?.role === r.id ? r.color + '15' : theme.bg.card,
                  borderColor: user?.role === r.id ? r.color : theme.border.default,
                  borderWidth: user?.role === r.id ? 2 : 1,
                }]}
              >
                <KriyaText style={{ fontSize: 28, marginRight: SPACING.md }}>{r.emoji}</KriyaText>
                <View style={{ flex: 1 }}>
                  <KriyaText variant="caption" style={{ fontWeight: '700', fontSize: 15, color: user?.role === r.id ? r.color : theme.text.primary }}>{r.label}</KriyaText>
                </View>
                {user?.role === r.id && (
                  <View style={[styles.checkDot, { backgroundColor: r.color }]}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <Button title="Close" variant="ghost" onPress={() => setShowRole(false)} style={{ marginTop: SPACING.sm }} />
          </View>
        </View>
      </Modal>

      {/* Developer Modal */}
      <Modal visible={showDev} animationType="slide" transparent onRequestClose={() => setShowDev(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.bg.overlay }]}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <View style={[styles.devSheet, { backgroundColor: theme.bg.secondary, borderColor: theme.border.default }]}>
              <View style={styles.sheetHandle} />

              {/* Developer photo */}
              <View style={styles.devPhotoWrap}>
                <LinearGradient
                  colors={[theme.accent.primary + '40', theme.accent.secondary + '20']}
                  style={styles.devPhotoGrad}
                >
                  <Image
                    source={require('../../../assets/developer.jpeg')}
                    style={styles.devPhoto}
                    resizeMode="cover"
                  />
                </LinearGradient>
                <View style={[styles.devOnlineDot, { backgroundColor: '#34d399', borderColor: theme.bg.secondary }]} />
              </View>

              <KriyaText variant="title" style={{ textAlign: 'center', marginTop: SPACING.sm }}>
                Mohammad Sahil
              </KriyaText>
              <KriyaText variant="caption" color={theme.accent.primary} style={{ textAlign: 'center', letterSpacing: 1.5, marginTop: 2 }}>
                FULL STACK DEVELOPER · CREATOR OF KRIYA
              </KriyaText>

              <View style={[styles.devBio, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
                <KriyaText variant="body" color={theme.text.secondary} style={{ lineHeight: 22, textAlign: 'center' }}>
                  Hey! I'm Sahil, a passionate developer from Patna, Bihar 🇮🇳.
                  I built Kriya to solve the real productivity struggles I faced as a student —
                  procrastination, lack of focus, and keeping up with habits. This app is my
                  answer to those late nights and missed deadlines. Hope it helps you too! 🚀
                </KriyaText>
              </View>

              {/* Stats */}
              <View style={styles.devStats}>
                {[
                  { emoji: '⚡', label: 'Apps Built', value: '10+' },
                  { emoji: '☕', label: 'Coffee/day', value: '4' },
                  { emoji: '🌙', label: 'Late nights', value: '∞' },
                ].map((s) => (
                  <View key={s.label} style={[styles.devStat, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
                    <KriyaText style={{ fontSize: 20 }}>{s.emoji}</KriyaText>
                    <KriyaText variant="heading" color={theme.accent.primary} style={{ fontSize: 18 }}>{s.value}</KriyaText>
                    <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 10 }}>{s.label}</KriyaText>
                  </View>
                ))}
              </View>

              {/* Contact row */}
              <View style={styles.devContact}>
                <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.accent.blue + '18', borderColor: theme.accent.blue + '40' }]}>
                  <Github size={18} color={theme.accent.blue} />
                  <KriyaText variant="caption" color={theme.accent.blue} style={{ marginLeft: 6 }}>GitHub</KriyaText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.accent.primary + '18', borderColor: theme.accent.primary + '40' }]}>
                  <Mail size={18} color={theme.accent.primary} />
                  <KriyaText variant="caption" color={theme.accent.primary} style={{ marginLeft: 6 }}>Email</KriyaText>
                </TouchableOpacity>
              </View>

              <View style={[styles.madeWith, { borderColor: theme.border.subtle }]}>
                <Heart size={14} color={theme.accent.red} fill={theme.accent.red} />
                <KriyaText variant="caption" color={theme.text.muted} style={{ marginLeft: 6 }}>
                  Made with love in Patna, Bihar
                </KriyaText>
              </View>

              <Button title="Close" variant="ghost" onPress={() => setShowDev(false)} style={{ marginTop: SPACING.sm }} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gradWrap:     { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  profileHero:  { marginBottom: SPACING.lg, borderRadius: RADIUS.xxl, overflow: 'hidden' },
  profileGrad:  { padding: SPACING.lg, alignItems: 'center', paddingTop: SPACING.xl, paddingBottom: SPACING.lg },
  avatarLarge:  { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: SPACING.sm },
  badges:       { flexDirection: 'row', gap: 8, marginTop: SPACING.sm, flexWrap: 'wrap', justifyContent: 'center' },
  badge:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full, borderWidth: 1 },
  sectionLabel: { letterSpacing: 1.5, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: SPACING.md, borderBottomWidth: 1 },
  rowIcon:      { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowBody:      { flex: 1 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  sheet:        { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: SPACING.lg, paddingBottom: 40 },
  devSheet:     { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: SPACING.lg, paddingBottom: 48, alignItems: 'center' },
  sheetHandle:  { width: 40, height: 4, backgroundColor: '#ffffff20', borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  themeOpt:     { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: RADIUS.xl, marginBottom: 10 },
  themeSwatch:  { width: 52, height: 52, borderRadius: 16, borderWidth: 1, overflow: 'hidden', justifyContent: 'flex-end' },
  themeAccent:  { height: 14 },
  checkDot:     { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  // Developer modal
  devPhotoWrap: { position: 'relative', marginTop: SPACING.sm, marginBottom: SPACING.sm },
  devPhotoGrad: { width: 110, height: 110, borderRadius: 35, padding: 3, alignItems: 'center', justifyContent: 'center' },
  devPhoto:     { width: 104, height: 104, borderRadius: 32 },
  devOnlineDot: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  devBio:       { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.md, marginVertical: SPACING.md, width: '100%' },
  devStats:     { flexDirection: 'row', gap: 10, width: '100%', marginBottom: SPACING.md },
  devStat:      { flex: 1, alignItems: 'center', padding: SPACING.sm, borderRadius: RADIUS.xl, borderWidth: 1, gap: 2 },
  devContact:   { flexDirection: 'row', gap: 12, marginBottom: SPACING.md },
  contactBtn:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1 },
  madeWith:     { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, borderTopWidth: 1, width: '100%', justifyContent: 'center' },
});
