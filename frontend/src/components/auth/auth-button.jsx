import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';











export default function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  testID
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
      styles.button,
      styles[variant],
      isDisabled && styles.disabled,
      style]
      }
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}>
      {loading ?
      <ActivityIndicator color={variant === 'primary' ? '#ffffff' : AuthColors.primary} /> :

      <ThemedText
        style={[styles.text, styles[`${variant}Text`], isDisabled && styles.disabledText]}>
          {title}
        </ThemedText>
      }
    </TouchableOpacity>);

}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.two
  },
  primary: {
    backgroundImage: `linear-gradient(135deg, ${AuthColors.primary} 0%, ${AuthColors.primaryLight} 100%)`,
    backgroundColor: AuthColors.primary,
    shadowColor: AuthColors.primaryLight,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8
  },
  secondary: {
    backgroundColor: AuthColors.glassAlt,
    borderWidth: 1,
    borderColor: AuthColors.primary,
    shadowColor: AuthColors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AuthColors.border
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  },
  primaryText: {
    color: '#ffffff'
  },
  secondaryText: {
    color: AuthColors.primary
  },
  outlineText: {
    color: AuthColors.textPrimary
  },
  disabledText: {
    opacity: 0.6
  }
});