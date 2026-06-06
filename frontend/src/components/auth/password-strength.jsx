import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { checkPasswordStrength } from '@/lib/validation';
import { Spacing } from '@/constants/theme';





export default function PasswordStrength({ password }) {
  if (!password) return null;

  const strength = checkPasswordStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {[...Array(6)].map((_, index) =>
        <View
          key={index}
          style={[
          styles.bar,
          index < strength.score && { backgroundColor: strength.color }]
          } />

        )}
      </View>
      <ThemedText style={[styles.label, { color: strength.color }]}>
        {strength.label}
      </ThemedText>
    </View>);

}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two
  },
  barContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: Spacing.one
  },
  bar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2
  },
  label: {
    fontSize: 12,
    fontWeight: '500'
  }
});