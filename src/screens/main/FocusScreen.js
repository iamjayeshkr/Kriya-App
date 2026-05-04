import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const TOTAL_TIME = 1 * 60;

export default function FocusScreen() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [status, setStatus] = useState('idle'); // idle, running, success, failed

  const progressAnim = useRef(new Animated.Value(0)).current;

  // Timer logic
  useEffect(() => {
    let interval;

    if (status === 'running') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  // Animate progress
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1 - timeLeft / TOTAL_TIME,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const handleStart = () => {
    setStatus('running');
  };

  const handleGiveUp = () => {
    setStatus('failed');
  };

  const reset = () => {
    setTimeLeft(TOTAL_TIME);
    setStatus('idle');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      
      {/* CHARACTER */}
      <Animated.View
        style={[
          styles.character,
          {
            transform: [
              {
                scale: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.3],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: 60 }}>
          {status === 'failed' ? '💀' : '🐣'}
        </Text>
      </Animated.View>

      {/* TIMER */}
      <Text style={styles.timer}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>

      {/* STATES */}
      {status === 'idle' && (
        <TouchableOpacity style={styles.btn} onPress={handleStart}>
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
      )}

      {status === 'running' && (
        <TouchableOpacity style={styles.btn} onPress={handleGiveUp}>
          <Text style={styles.btnText}>Give Up</Text>
        </TouchableOpacity>
      )}

      {status === 'success' && (
        <>
          <Text style={styles.success}>🎉 You grew it!</Text>
          <TouchableOpacity style={styles.btn} onPress={reset}>
            <Text style={styles.btnText}>Restart</Text>
          </TouchableOpacity>
        </>
      )}

      {status === 'failed' && (
        <>
          <Text style={styles.fail}>😢 It died</Text>
          <TouchableOpacity style={styles.btn} onPress={reset}>
            <Text style={styles.btnText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    marginBottom: 30,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#111',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
  },
  success: {
    fontSize: 18,
    marginTop: 20,
  },
  fail: {
    fontSize: 18,
    marginTop: 20,
  },
});