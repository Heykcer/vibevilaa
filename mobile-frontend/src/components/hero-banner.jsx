import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';
import heroImage from '../../assets/images/vibe_villa_hero.png';

export default function HeroBanner() {
  const theme = useTheme();

  return (
    <View style={styles.heroContainer}>
      <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroOverlay} />
      <View style={styles.heroTextContainer}>
        <Text style={[styles.heroBadge, { color: theme.accent }]}>🔴 NEON EDEN VILLA</Text>
        <Text style={styles.heroTitle}>Room 01: The Main Lounge</Text>
        <Text style={styles.heroSubtitle}>
          Contestants are online and chatting live. Eviction polls are active!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    marginHorizontal: Spacing.three,
    borderRadius: 16,
    height: 200,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.three,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 37, 68, 0.65)',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
  },
  heroBadge: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 16,
  },
});
