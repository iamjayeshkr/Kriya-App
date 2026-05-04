import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import KriyaText from '../../components/KriyaText';
import { Mail, Lock, Zap, Sparkles } from 'lucide-react-native';
import { SPACING, RADIUS } from '../../constants/theme';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { login } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    setError(''); setLoading(true);
    try { await login(email.trim(), password); }
    catch (e) { setError(e.message || 'Login failed. Try again.'); }
    finally { setLoading(false); }
  };

  const gradColors = isDark
    ? ['#0f0f17', '#16102a', '#0f0f17']
    : ['#f5f3ff', '#ede9fe', '#faf8ff'];

  return (
    <LinearGradient colors={gradColors} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Decorative orb */}
          <View style={[styles.orb, { backgroundColor: theme.accent.primary + '30' }]} />
          <View style={[styles.orb2, { backgroundColor: theme.accent.secondary + '20' }]} />

          {/* Logo */}
          <View style={styles.hero}>
            <View style={[styles.logoWrap, { backgroundColor: theme.accent.primary + '18', borderColor: theme.border.accent }]}>
              <Zap size={34} color={theme.accent.primary} strokeWidth={2} />
            </View>
            <KriyaText variant="hero" style={[styles.logoText, { color: theme.text.primary }]}>KRIYA</KriyaText>
            <View style={styles.tagRow}>
              <View style={[styles.tagPill, { backgroundColor: theme.accent.primary + '15', borderColor: theme.border.accent }]}>
                <KriyaText variant="label" color={theme.accent.primary} style={{ letterSpacing: 3 }}>DISCIPLINE SYSTEM</KriyaText>
              </View>
            </View>
            <KriyaText variant="body" color={theme.text.secondary} style={{ marginTop: 10, textAlign: 'center' }}>
              Built for students, devs & medical warriors
            </KriyaText>
          </View>

          {/* Form card */}
          <View style={[styles.form, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            <KriyaText variant="heading" style={{ marginBottom: SPACING.xs }}>Welcome back</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary} style={{ marginBottom: SPACING.lg }}>Sign in to continue your streak</KriyaText>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: theme.accent.red + '15', borderColor: theme.accent.red + '50' }]}>
                <Text style={{ color: theme.accent.red, fontSize: 13 }}>⚠ {error}</Text>
              </View>
            ) : null}

            <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" icon={<Mail size={18} color={theme.text.secondary} />} />
            <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry icon={<Lock size={18} color={theme.text.secondary} />} />

            <Button title="SIGN IN" onPress={handleLogin} loading={loading} size="lg" style={{ marginTop: SPACING.sm }} />

            <TouchableOpacity
              onPress={() => { setEmail('demo@kriya.app'); setPassword('demo1234'); }}
              style={[styles.demoBtn, { borderColor: theme.border.default }]}
            >
              <KriyaText variant="caption" color={theme.text.secondary}>Try demo account →</KriyaText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <KriyaText variant="body" color={theme.text.secondary}>No account? </KriyaText>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <KriyaText variant="body" color={theme.accent.primary} style={{ fontWeight: '700' }}>Sign up free</KriyaText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg, paddingTop: 60 },
  orb:       { position: 'absolute', width: 280, height: 280, borderRadius: 140, top: -80, right: -80, opacity: 0.6 },
  orb2:      { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, left: -60, opacity: 0.5 },
  hero:      { alignItems: 'center', marginBottom: SPACING.xl },
  logoWrap:  { width: 80, height: 80, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginBottom: SPACING.md },
  logoText:  { fontSize: 44, letterSpacing: 10, fontWeight: '900', marginBottom: SPACING.sm },
  tagRow:    { flexDirection: 'row' },
  tagPill:   { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
  form:      { borderRadius: RADIUS.xxl, borderWidth: 1, padding: SPACING.lg, marginBottom: SPACING.lg },
  errorBox:  { borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.sm, marginBottom: SPACING.md },
  demoBtn:   { alignItems: 'center', marginTop: SPACING.md, paddingVertical: SPACING.sm, borderTopWidth: 1 },
  footer:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
