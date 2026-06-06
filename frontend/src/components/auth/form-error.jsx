import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthColors, Spacing } from '@/constants/theme';





export default function FormError({ message }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>⚠️</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
    </View>);

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.errorLight,
    borderRadius: 8,
    padding: Spacing.two,
    marginBottom: Spacing.three,
    borderLeftWidth: 4,
    borderLeftColor: AuthColors.error
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.two
  },
  message: {
    flex: 1,
    color: AuthColors.error,
    fontSize: 13,
    fontWeight: '500'
  }
});