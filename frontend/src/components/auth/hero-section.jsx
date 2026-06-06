import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';








export default function HeroSection({
  logoText = 'VibeVilla',
  badge = 'Season 3 Live Now',
  title,
  subtitle
}) {
  return (
    <View style={styles.container}>
      {/* Gradient overlay */}
      <View style={styles.overlay} />

      {/* Logo */}
      <View style={styles.header}>
        <ThemedText style={styles.logo}>{logoText}</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>🔴 {badge}</ThemedText>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>1.2M+</ThemedText>
          <ThemedText style={styles.statLabel}>Active Fans</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>245K</ThemedText>
          <ThemedText style={styles.statLabel}>Live Viewers</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>125K</ThemedText>
          <ThemedText style={styles.statLabel}>Daily Votes</ThemedText>
        </View>
      </View>
    </View>);

}

const styles = StyleSheet.create({
  container: {
    height: 340,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    marginBottom: Spacing.four,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: Spacing.four
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  header: {
    zIndex: 1
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Spacing.two
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600'
  },
  content: {
    zIndex: 1
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Spacing.two
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.one
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
});