// src/components/Input.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SPACING } from '../constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

/**
 * Input Component: A styled text input field with support for labels, icons, errors,
 * and password visibility toggles.
 *
 * @param {string} label - Optional label text above the input.
 * @param {string} placeholder - Placeholder text inside the input.
 * @param {string} value - Current value of the input.
 * @param {function} onChangeText - Callback when text changes.
 * @param {string} error - Error message text to display below the input.
 * @param {boolean} secureTextEntry - If true, masks the input text (for passwords).
 * @param {React.ReactNode} icon - Optional icon to display on the left.
 * @param {boolean} multiline - If true, the text input can have multiple lines.
 * @param {number} numberOfLines - Number of lines for multiline input.
 * @param {string} keyboardType - Keyboard type (e.g., 'email-address', 'numeric').
 * @param {string} autoCapitalize - Auto-capitalization behavior.
 * @param {object} style - Styles for the outer wrapper.
 * @param {object} inputStyle - Styles for the TextInput component itself.
 */
export default function Input({
  label, placeholder, value, onChangeText, error,
  secureTextEntry, icon, multiline, numberOfLines, keyboardType,
  autoCapitalize, style, inputStyle,
}) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text.secondary }]}>{label}</Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.bg.input,
            borderColor: error ? theme.accent.red : focused ? theme.accent.primary : theme.border.default,
            borderWidth: focused ? 1.5 : 1,
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text.primary,
              paddingLeft: icon ? 8 : SPACING.md,
            },
            multiline && { textAlignVertical: 'top', paddingTop: SPACING.sm },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.text.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPass}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={theme.accent.primary}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eye}>
            {showPass
              ? <EyeOff size={18} color={theme.text.secondary} />
              : <Eye size={18} color={theme.text.secondary} />
            }
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.accent.red }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.md },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.md, overflow: 'hidden',
    minHeight: 48,
  },
  icon: { paddingLeft: SPACING.md },
  input: { flex: 1, fontSize: 15, paddingRight: SPACING.md, paddingVertical: 12, fontWeight: '400' },
  eye: { paddingRight: SPACING.md },
  error: { fontSize: 12, marginTop: 4 },
});
