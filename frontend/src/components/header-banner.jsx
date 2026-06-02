import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Fonts, Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

export default function HeaderBanner() {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.brandTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
          VIBE VILLA
        </Text>
        <Text
          style={[styles.brandSubtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}
        >
          Anime Avatar Reality Show
        </Text>
      </View>
      <View style={styles.liveIndicatorContainer}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>1.2M WATCHING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
