import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

export default function EvictionPoll({
  votes = { Kenji: 0, Yuki: 0, Sakura: 0 },
  hasVoted = false,
  onVote,
}) {
  const theme = useTheme();

  // Calculate Voting Percentages
  const totalVotes = votes.Kenji + votes.Yuki + votes.Sakura;
  const getPercentage = (candidateVotes) => {
    return totalVotes > 0 ? Math.round((candidateVotes / totalVotes) * 100) : 0;
  };

  return (
    <View
      style={[
        styles.votingCard,
        {
          backgroundColor: theme.backgroundElement,
          shadowColor: theme.text,
        },
      ]}
    >
      <View style={styles.votingHeader}>
        <Text style={[styles.votingTitle, { color: theme.text }]}>LIVE EVICTION POLL</Text>
        <Text style={[styles.votingSubtitle, { color: theme.textSecondary }]}>
          Who should be eliminated next?
        </Text>
      </View>

      <View style={styles.votingOptions}>
        {/* Option 1: Kenji */}
        <View style={styles.votingOption}>
          <View style={styles.optionInfo}>
            <Text style={[styles.optionLabel, { color: theme.text }]}>🦊 Kenji (Wolf)</Text>
            <Text style={[styles.optionPercent, { color: theme.text }]}>
              {getPercentage(votes.Kenji)}%
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.background }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${getPercentage(votes.Kenji)}%`,
                  backgroundColor: theme.accent,
                },
              ]}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.voteBtn,
              {
                backgroundColor: hasVoted ? theme.backgroundSelected : theme.accent,
                opacity: hasVoted ? 0.7 : 1,
              },
            ]}
            onPress={() => onVote('Kenji')}
            disabled={hasVoted}
          >
            <Text style={styles.voteBtnText}>{hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}</Text>
          </TouchableOpacity>
        </View>

        {/* Option 2: Yuki */}
        <View style={styles.votingOption}>
          <View style={styles.optionInfo}>
            <Text style={[styles.optionLabel, { color: theme.text }]}>🐱 Yuki (Cat)</Text>
            <Text style={[styles.optionPercent, { color: theme.text }]}>
              {getPercentage(votes.Yuki)}%
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.background }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${getPercentage(votes.Yuki)}%`,
                  backgroundColor: theme.teal || '#4ECDC4',
                },
              ]}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.voteBtn,
              {
                backgroundColor: hasVoted ? theme.backgroundSelected : theme.accent,
                opacity: hasVoted ? 0.7 : 1,
              },
            ]}
            onPress={() => onVote('Yuki')}
            disabled={hasVoted}
          >
            <Text style={styles.voteBtnText}>{hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}</Text>
          </TouchableOpacity>
        </View>

        {/* Option 3: Sakura */}
        <View style={styles.votingOption}>
          <View style={styles.optionInfo}>
            <Text style={[styles.optionLabel, { color: theme.text }]}>🌸 Sakura (Fox)</Text>
            <Text style={[styles.optionPercent, { color: theme.text }]}>
              {getPercentage(votes.Sakura)}%
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.background }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${getPercentage(votes.Sakura)}%`,
                  backgroundColor: theme.yellow || '#FFE66D',
                },
              ]}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.voteBtn,
              {
                backgroundColor: hasVoted ? theme.backgroundSelected : theme.accent,
                opacity: hasVoted ? 0.7 : 1,
              },
            ]}
            onPress={() => onVote('Sakura')}
            disabled={hasVoted}
          >
            <Text style={styles.voteBtnText}>{hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.votingDisclaimer, { color: theme.textSecondary }]}>
        ⚡ Instant Redis sync active. Multi-vote prevention enabled.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  votingCard: {
    marginHorizontal: Spacing.three,
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.four,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  votingHeader: {
    marginBottom: Spacing.three,
  },
  votingTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  votingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  votingOptions: {
    gap: Spacing.three,
  },
  votingOption: {
    marginBottom: Spacing.one,
  },
  optionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  voteBtn: {
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  votingDisclaimer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: Spacing.three,
    fontStyle: 'italic',
  },
});
