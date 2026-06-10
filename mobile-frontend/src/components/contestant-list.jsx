import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

export default function ContestantList({ contestants = [] }) {
  const theme = useTheme();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Contestants</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contestantsContainer}
      >
        {contestants.map((c) => (
          <View
            key={c.id}
            style={[styles.contestantCard, { backgroundColor: theme.backgroundElement }]}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{c.avatar}</Text>
            </View>
            <Text style={[styles.contestantName, { color: theme.text }]} numberOfLines={1}>
              {c.name}
            </Text>
            <Text
              style={[
                styles.contestantStatus,
                { color: c.status === 'Vulnerable' ? theme.accent : theme.textSecondary },
              ]}
            >
              {c.status}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  contestantsContainer: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    marginBottom: Spacing.four,
  },
  contestantCard: {
    alignItems: 'center',
    width: 90,
    padding: Spacing.two,
    borderRadius: 12,
    marginRight: Spacing.two,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  contestantName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  contestantStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
});
