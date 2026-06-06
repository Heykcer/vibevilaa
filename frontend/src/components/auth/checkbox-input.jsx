import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';








export default function CheckboxInput({
  label,
  value,
  onValueChange,
  required = false
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}>
      <View
        style={[
        styles.checkbox,
        value && styles.checkboxChecked]
        }>
        {value && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </View>
      <ThemedText style={styles.label}>
        {label}
        {required && <ThemedText style={styles.required}>*</ThemedText>}
      </ThemedText>
    </TouchableOpacity>);

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.two
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: AuthColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.two
  },
  checkboxChecked: {
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
    shadowColor: AuthColors.primaryLight,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  label: {
    fontSize: 14,
    color: AuthColors.textPrimary,
    flex: 1
  },
  required: {
    color: AuthColors.error,
    marginLeft: 2
  }
});