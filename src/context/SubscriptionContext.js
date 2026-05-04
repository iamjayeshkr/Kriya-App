// src/context/SubscriptionContext.js
// Handles pro/free state, Razorpay + UPI payment flow
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';
import { PLAN_FEATURES, FREE_LIMITS, PRO_PRICE } from '../constants/plans';

const SubscriptionContext = createContext(null);

const STORAGE_KEY = '@kriya_subscription';

// ─── Razorpay config ─────────────────────────────────────────────────────────
// Replace with your actual Razorpay Key ID from dashboard.razorpay.com
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_HERE';

// ─── UPI config ──────────────────────────────────────────────────────────────
// Replace with your actual UPI ID (e.g. yourname@ybl or yourname@paytm)
const MERCHANT_UPI_ID  = 'kriyaapp@upi';
const MERCHANT_NAME    = 'Kriya App';

export const SubscriptionProvider = ({ children }) => {
  const [isPro, setIsPro]         = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const sub = JSON.parse(raw);
        // Check expiry
        if (sub.expiresAt && new Date(sub.expiresAt) > new Date()) {
          setIsPro(true);
          setExpiresAt(sub.expiresAt);
        } else if (sub.isPro && !sub.expiresAt) {
          // Lifetime / no expiry set (dev testing)
          setIsPro(true);
        } else {
          // Expired
          setIsPro(false);
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to load subscription:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Grant pro access locally after payment verified
  const grantPro = useCallback(async (paymentId, method) => {
    const exp = new Date();
    exp.setMonth(exp.getMonth() + 1); // +1 month
    const sub = {
      isPro: true,
      paymentId,
      method, // 'razorpay' | 'upi'
      grantedAt: new Date().toISOString(),
      expiresAt: exp.toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    setIsPro(true);
    setExpiresAt(exp.toISOString());
  }, []);

  // ─── Razorpay Payment ───────────────────────────────────────────────────────
  // Uses react-native-razorpay (install: npx expo install react-native-razorpay)
  // For Expo Go testing, use the mock flow below
  const payWithRazorpay = useCallback(async (user) => {
    setProcessing(true);
    try {
      // Try to import Razorpay (won't work in Expo Go — shows mock instead)
      let RazorpayCheckout;
      try {
        RazorpayCheckout = require('react-native-razorpay').default;
      } catch {
        RazorpayCheckout = null;
      }

      if (!RazorpayCheckout) {
        // ── MOCK for Expo Go / development ──────────────────────────────────
        Alert.alert(
          '💳 Razorpay (Dev Mode)',
          'In production this opens Razorpay checkout.\n\nSimulate payment success?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setProcessing(false) },
            {
              text: 'Simulate Success ✓',
              onPress: async () => {
                await grantPro('rzp_mock_' + Date.now(), 'razorpay');
                setProcessing(false);
                Alert.alert('🎉 Pro Unlocked!', 'Welcome to Kriya Pro! Enjoy all features.');
              },
            },
          ]
        );
        return;
      }

      // ── Real Razorpay checkout ─────────────────────────────────────────────
      const options = {
        description: 'Kriya Pro — Monthly',
        image: 'https://yourapp.com/logo.png', // replace with your logo URL
        currency: PRO_PRICE.currency,
        key: RAZORPAY_KEY_ID,
        amount: PRO_PRICE.amount, // in paise
        name: 'Kriya App',
        prefill: {
          email: user?.email || '',
          contact: user?.phone || '',
          name: user?.name || '',
        },
        theme: { color: '#7ed8a4' },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
      };

      const data = await RazorpayCheckout.open(options);
      // data.razorpay_payment_id — verify on your backend in production!
      await grantPro(data.razorpay_payment_id, 'razorpay');
      Alert.alert('🎉 Pro Unlocked!', `Payment ID: ${data.razorpay_payment_id}\nWelcome to Kriya Pro!`);

    } catch (error) {
      if (error?.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Failed', error?.description || 'Something went wrong. Try again.');
      }
    } finally {
      setProcessing(false);
    }
  }, [grantPro]);

  // ─── UPI Deep Link Payment (PhonePe / GPay / Paytm) ───────────────────────
  // Opens UPI app directly — user pays, then comes back and confirms manually
  // In production: use a webhook/backend to auto-verify via UTR number
  const payWithUPI = useCallback(async (user) => {
    setProcessing(true);
    try {
      const txnRef = 'KRIYA' + Date.now();
      const upiUrl = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${PRO_PRICE.amount / 100}&cu=${PRO_PRICE.currency}&tn=${encodeURIComponent('Kriya Pro Monthly')}&tr=${txnRef}`;

      const canOpen = await Linking.canOpenURL(upiUrl);

      if (!canOpen) {
        // Fallback: show UPI ID manually
        Alert.alert(
          '📱 Pay via UPI',
          `Send ₹${PRO_PRICE.amount / 100} to:\n\n${MERCHANT_UPI_ID}\n\nNote: Kriya Pro - ${user?.name || 'User'}\n\nAfter payment, tap "I've Paid" below.`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setProcessing(false) },
            {
              text: "I've Paid ✓",
              onPress: () => handleUPIConfirmation(txnRef, user),
            },
          ]
        );
        return;
      }

      // Open UPI app
      await Linking.openURL(upiUrl);

      // After returning from UPI app, ask user to confirm
      setTimeout(() => {
        Alert.alert(
          'Payment Confirmation',
          'Did you complete the payment?',
          [
            { text: 'Not Yet', style: 'cancel', onPress: () => setProcessing(false) },
            { text: "Yes, I've Paid ✓", onPress: () => handleUPIConfirmation(txnRef, user) },
          ]
        );
      }, 2000);

    } catch (e) {
      Alert.alert('Error', 'Could not open UPI app. Please try Razorpay instead.');
      setProcessing(false);
    }
  }, [grantPro]);

  const handleUPIConfirmation = useCallback(async (txnRef, user) => {
    // In production: call your backend API to verify payment via UPI UTR
    // For now: grant optimistically + show instructions
    Alert.alert(
      '✅ Payment Received',
      'Your Pro access has been activated!\n\n(In production, this is verified automatically via webhook.)',
      [
        {
          text: 'Start using Pro →',
          onPress: async () => {
            await grantPro('upi_' + txnRef, 'upi');
            setProcessing(false);
          },
        },
      ]
    );
  }, [grantPro]);

  // Feature gate check
  const canUse = useCallback((feature) => {
    const plan = isPro ? 'pro' : 'free';
    return PLAN_FEATURES[plan][feature] ?? false;
  }, [isPro]);

  // Check specific limits
  const checkLimit = useCallback((type, currentCount) => {
    if (isPro) return { allowed: true, remaining: Infinity };
    const limit = type === 'tasks' ? FREE_LIMITS.MAX_TASKS : FREE_LIMITS.MAX_HABITS;
    return {
      allowed: currentCount < limit,
      remaining: Math.max(0, limit - currentCount),
      limit,
    };
  }, [isPro]);

  const cancelSubscription = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Your Pro access will continue until expiry. Cancel?',
      [
        { text: 'Keep Pro', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: async () => {
            // In production: call your backend to cancel recurring billing
            await AsyncStorage.removeItem(STORAGE_KEY);
            setIsPro(false);
            setExpiresAt(null);
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  return (
    <SubscriptionContext.Provider value={{
      isPro,
      isLoading,
      expiresAt,
      processing,
      payWithRazorpay,
      payWithUPI,
      canUse,
      checkLimit,
      cancelSubscription,
      // Dev helper: toggle pro for testing
      __devGrantPro: () => grantPro('dev_test', 'dev'),
      __devRevokePro: async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setIsPro(false);
        setExpiresAt(null);
      },
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
