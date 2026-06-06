import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';














export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  onBlur,
  editable = true,
  autoComplete = 'off'
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View
        style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError]
        }>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AuthColors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          editable={editable}
          autoComplete={autoComplete} />
        
        {secureTextEntry &&
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <ThemedText style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</ThemedText>
          </TouchableOpacity>
        }
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>);

}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.three
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.two,
    color: AuthColors.textPrimary
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark inner background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AuthColors.border,
    paddingHorizontal: Spacing.three,
    height: 48
  },
  inputWrapperFocused: {
    borderColor: AuthColors.primary,
    shadowColor: AuthColors.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 }, // Center the glow
    shadowRadius: 12,
    elevation: 8
  },
  inputWrapperError: {
    borderColor: AuthColors.error,
    shadowColor: AuthColors.error,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8
  },
  input: {
    flex: 1,
    color: AuthColors.textPrimary,
    fontSize: 16,
    padding: 0
  },
  eyeIcon: {
    padding: Spacing.two
  },
  eyeIconText: {
    fontSize: 16,
    color: AuthColors.textSecondary
  },
  error: {
    color: AuthColors.error,
    fontSize: 12,
    marginTop: Spacing.one
  }
});