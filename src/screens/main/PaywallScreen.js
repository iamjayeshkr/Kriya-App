// src/screens/main/PaywallScreen.js
// Full-screen upgrade screen with Razorpay + UPI options
import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
  Text, ActivityIndicator, Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { X, Zap, Check, Crown, Shield } from 'lucide-react-native';
import KriyaText from '../../components/KriyaText';
import { SPACING, RADIUS } from '../../constants/theme';
import { PRO_FEATURE_LIST, PRO_PRICE } from '../../constants/plans';

const { width } = Dimensions.get('window');

export default function PaywallScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const { user } = useApp();
  const { payWithRazorpay, payWithUPI, processing } = useSubscription();
  const [selectedMethod, setSelectedMethod] = useState('razorpay');

  const featureTriggered = route?.params?.feature || 'this feature';

  const handlePay = async () => {
    if (selectedMethod === 'razorpay') {
      await payWithRazorpay(user);
    } else {
      await payWithUPI(user);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Close button */}
      <TouchableOpacity
        style={[styles.closeBtn, { backgroundColor: theme.bg.card }]}
        onPress={() => navigation.goBack()}
      >
        <X size={20} color={theme.text.secondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.crownWrap, { backgroundColor: theme.accent.primary + '20' }]}>
            <Crown size={36} color={theme.accent.primary} strokeWidth={1.5} />
          </View>
          <KriyaText variant="title" style={{ textAlign: 'center', marginTop: SPACING.md }}>
            Unlock Kriya Pro
          </KriyaText>
          <KriyaText variant="body" color={theme.text.secondary} style={{ textAlign: 'center', marginTop: 6 }}>
            You tried to use <Text style={{ color: theme.accent.primary, fontWeight: '600' }}>{featureTriggered}</Text>
            {' '}— upgrade to access everything.
          </KriyaText>
        </View>

        {/* Price badge */}
        <View style={[styles.priceBadge, { backgroundColor: theme.accent.primary + '15', borderColor: theme.border.accent }]}>
          <KriyaText variant="hero" color={theme.accent.primary} style={{ fontSize: 36 }}>
            {PRO_PRICE.display}
          </KriyaText>
          <KriyaText variant="caption" color={theme.text.secondary}>/month · Cancel anytime</KriyaText>
          <View style={[styles.savingPill, { backgroundColor: theme.accent.orange + '20' }]}>
            <KriyaText variant="caption" color={theme.accent.orange} style={{ fontWeight: '700' }}>
              Less than a cup of chai ☕
            </KriyaText>
          </View>
        </View>

        {/* Feature list */}
        <View style={[styles.featureCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5, marginBottom: SPACING.md }}>
            EVERYTHING IN PRO
          </KriyaText>
          {PRO_FEATURE_LIST.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.checkCircle, { backgroundColor: theme.accent.primary + '20' }]}>
                <Check size={13} color={theme.accent.primary} strokeWidth={3} />
              </View>
              <Text style={{ fontSize: 14, color: theme.text.primary, flex: 1 }}>
                <Text style={{ fontSize: 16 }}>{f.icon}</Text>{'  '}{f.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Free vs Pro comparison */}
        <View style={[styles.compareCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5, marginBottom: SPACING.md }}>
            FREE VS PRO
          </KriyaText>
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <KriyaText variant="caption" color={theme.text.muted} style={{ marginBottom: 8, textAlign: 'center' }}>Free</KriyaText>
              {['10 tasks only', '5 habits only', '7-day analytics', 'No student tools', 'No dev tools', 'No medical tools'].map((t, i) => (
                <View key={i} style={styles.compareItem}>
                  <Text style={{ color: theme.accent.red, fontSize: 12 }}>✗  </Text>
                  <Text style={{ color: theme.text.secondary, fontSize: 12 }}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.compareDivider, { backgroundColor: theme.border.default }]} />
            <View style={styles.compareCol}>
              <KriyaText variant="caption" color={theme.accent.primary} style={{ marginBottom: 8, textAlign: 'center', fontWeight: '700' }}>Pro ✦</KriyaText>
              {['Unlimited tasks', 'Unlimited habits', '90-day analytics', 'All student tools', 'All dev tools', 'All medical tools'].map((t, i) => (
                <View key={i} style={styles.compareItem}>
                  <Text style={{ color: theme.accent.primary, fontSize: 12 }}>✓  </Text>
                  <Text style={{ color: theme.text.primary, fontSize: 12, fontWeight: '500' }}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Payment method selector */}
        <KriyaText variant="label" color={theme.text.muted} style={{ letterSpacing: 1.5, marginBottom: SPACING.sm }}>
          CHOOSE PAYMENT METHOD
        </KriyaText>

        <View style={styles.methodRow}>
          {/* Razorpay */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: selectedMethod === 'razorpay' ? theme.accent.primary + '15' : theme.bg.card,
                borderColor: selectedMethod === 'razorpay' ? theme.accent.primary : theme.border.default,
                borderWidth: selectedMethod === 'razorpay' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedMethod('razorpay')}
          >
            <Text style={{ fontSize: 24 }}>💳</Text>
            <KriyaText variant="caption" color={selectedMethod === 'razorpay' ? theme.accent.primary : theme.text.primary} style={{ fontWeight: '700', marginTop: 6 }}>
              Razorpay
            </KriyaText>
            <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 10, textAlign: 'center', marginTop: 2 }}>
              Card · Net Banking · UPI · Wallet
            </KriyaText>
            {selectedMethod === 'razorpay' && (
              <View style={[styles.selectedDot, { backgroundColor: theme.accent.primary }]} />
            )}
          </TouchableOpacity>

          {/* UPI Direct */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor: selectedMethod === 'upi' ? theme.accent.secondary + '15' : theme.bg.card,
                borderColor: selectedMethod === 'upi' ? theme.accent.secondary : theme.border.default,
                borderWidth: selectedMethod === 'upi' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedMethod('upi')}
          >
            <Text style={{ fontSize: 24 }}>📱</Text>
            <KriyaText variant="caption" color={selectedMethod === 'upi' ? theme.accent.secondary : theme.text.primary} style={{ fontWeight: '700', marginTop: 6 }}>
              UPI Direct
            </KriyaText>
            <KriyaText variant="caption" color={theme.text.muted} style={{ fontSize: 10, textAlign: 'center', marginTop: 2 }}>
              PhonePe · GPay · Paytm
            </KriyaText>
            {selectedMethod === 'upi' && (
              <View style={[styles.selectedDot, { backgroundColor: theme.accent.secondary }]} />
            )}
          </TouchableOpacity>
        </View>

        {/* Pay button */}
        <TouchableOpacity
          style={[
            styles.payBtn,
            {
              backgroundColor: selectedMethod === 'razorpay' ? theme.accent.primary : theme.accent.secondary,
              opacity: processing ? 0.7 : 1,
            },
          ]}
          onPress={handlePay}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <ActivityIndicator color={theme.text.inverse} />
          ) : (
            <>
              <Zap size={18} color={theme.text.inverse} strokeWidth={2.5} />
              <Text style={[styles.payBtnText, { color: theme.text.inverse }]}>
                {selectedMethod === 'razorpay' ? 'Pay ₹49 with Razorpay' : 'Pay ₹49 via UPI'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          <Shield size={13} color={theme.text.muted} />
          <KriyaText variant="caption" color={theme.text.muted} style={{ marginLeft: 4 }}>
            256-bit encrypted · Cancel anytime · No hidden charges
          </KriyaText>
        </View>

        <KriyaText variant="caption" color={theme.text.muted} style={{ textAlign: 'center', marginBottom: SPACING.xxl }}>
          By subscribing you agree to our Terms of Service
        </KriyaText>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeBtn: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: 100, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: SPACING.xl },
  crownWrap: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  priceBadge: {
    alignItems: 'center', padding: SPACING.lg,
    borderRadius: RADIUS.xl, borderWidth: 1, marginBottom: SPACING.lg,
  },
  savingPill: { marginTop: 8, paddingHorizontal: 14, paddingVertical: 5, borderRadius: RADIUS.full },
  featureCard: { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.lg, marginBottom: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  compareCard: { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.lg, marginBottom: SPACING.lg },
  compareRow: { flexDirection: 'row' },
  compareCol: { flex: 1 },
  compareDivider: { width: 1, marginHorizontal: SPACING.md },
  compareItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  methodRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  methodCard: {
    flex: 1, alignItems: 'center', padding: SPACING.md,
    borderRadius: RADIUS.xl, position: 'relative',
  },
  selectedDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: RADIUS.xl, marginBottom: SPACING.md,
  },
  payBtnText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  trustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
});
