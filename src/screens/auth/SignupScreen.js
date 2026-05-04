import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import KriyaText from '../../components/KriyaText';
import { Mail, Lock, User, Zap } from 'lucide-react-native';
import { SPACING, RADIUS } from '../../constants/theme';

export default function SignupScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { signup } = useApp();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Please fill all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try { await signup(name.trim(), email.trim(), password); }
    catch (e) { setError(e.message || 'Signup failed. Try again.'); }
    finally { setLoading(false); }
  };

  const gradColors = isDark ? ['#0f0f17', '#0d1020', '#0f0f17'] : ['#f5f3ff', '#ede9fe', '#faf8ff'];

  return (
    <LinearGradient colors={gradColors} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.orb, { backgroundColor: theme.accent.secondary + '25' }]} />

          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
              <KriyaText variant="caption" color={theme.text.secondary}>← Back</KriyaText>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={[styles.logoWrap, { backgroundColor: theme.accent.secondary + '18', borderColor: theme.accent.secondary + '40' }]}>
              <Zap size={30} color={theme.accent.secondary} />
            </View>
            <KriyaText variant="title" style={{ marginBottom: 4 }}>Create Account</KriyaText>
            <KriyaText variant="caption" color={theme.text.secondary}>Join Kriya and level up your productivity</KriyaText>
          </View>

          {/* Role preview teaser */}
          <View style={[styles.teaser, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            <KriyaText style={{ fontSize: 22 }}>🎭</KriyaText>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <KriyaText variant="caption" style={{ fontWeight: '700', color: theme.accent.primary }}>Role-Personalized Experience</KriyaText>
              <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 11, marginTop: 2 }}>
                After signup, tell us if you're a Student, Developer, Medical aspirant or Teacher — the app adapts to your needs!
              </KriyaText>
            </View>
          </View>

          <View style={[styles.form, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: theme.accent.red + '15', borderColor: theme.accent.red + '50' }]}>
                <KriyaText variant="caption" color={theme.accent.red}>⚠ {error}</KriyaText>
              </View>
            ) : null}

            <Input label="Full Name" placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" icon={<User size={18} color={theme.text.secondary} />} />
            <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" icon={<Mail size={18} color={theme.text.secondary} />} />
            <Input label="Password" placeholder="Min 6 characters" value={password} onChangeText={setPassword} secureTextEntry icon={<Lock size={18} color={theme.text.secondary} />} />

            <Button title="CREATE ACCOUNT →" onPress={handleSignup} loading={loading} size="lg" style={{ marginTop: SPACING.sm }} />
          </View>

          <View style={styles.footer}>
            <KriyaText variant="body" color={theme.text.secondary}>Already have an account? </KriyaText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <KriyaText variant="body" color={theme.accent.primary} style={{ fontWeight: '700' }}>Sign in</KriyaText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll:   { flexGrow: 1, padding: SPACING.lg, paddingTop: 60 },
  orb:      { position: 'absolute', width: 250, height: 250, borderRadius: 125, bottom: 50, right: -80, opacity: 0.5 },
  topRow:   { marginBottom: SPACING.lg },
  backBtn:  { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1 },
  header:   { alignItems: 'center', marginBottom: SPACING.lg },
  logoWrap: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginBottom: SPACING.sm },
  teaser:   { flexDirection: 'row', alignItems: 'flex-start', borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.md, marginBottom: SPACING.md },
  form:     { borderRadius: RADIUS.xxl, borderWidth: 1, padding: SPACING.lg, marginBottom: SPACING.lg },
  errorBox: { borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.sm, marginBottom: SPACING.md },
  footer:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: SPACING.xl },
});
