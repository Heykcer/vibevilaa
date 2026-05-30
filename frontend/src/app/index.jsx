import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/use-theme';
import { Fonts, Spacing } from '../constants/theme';
import heroImage from '../../assets/images/vibe_villa_hero.png';

const CONTESTANTS = [
  { id: 'c1', name: 'Sakura', avatar: '🌸', role: 'Fox Avatar', status: 'Chatting...' },
  { id: 'c2', name: 'Kenji', avatar: '🦊', role: 'Wolf Avatar', status: 'Vulnerable' },
  { id: 'c3', name: 'Yuki', avatar: '🐱', role: 'Cat Avatar', status: 'Vulnerable' },
  { id: 'c4', name: 'Kuro', avatar: '🐈', role: 'Shadow Cat', status: 'Offline' },
  { id: 'c5', name: 'Rei', avatar: '🦄', role: 'Unicorn Spirit', status: 'Chatting...' },
];

const INITIAL_MESSAGES = [
  { id: 'm1', sender: 'Sakura 🌸', text: 'Wait, who ate my virtual sushi? 🍣', time: '10:41' },
  {
    id: 'm2',
    sender: 'Kuro 🐈',
    text: 'Probably Kenji. I saw his avatar near the fridge emoji.',
    time: '10:42',
  },
  { id: 'm3', sender: 'Kenji 🦊', text: 'Hey! I was in the garden room! 😭', time: '10:42' },
  { id: 'm4', sender: 'Rei 🦄', text: 'Spamming heart reactions for Kenji! 💖', time: '10:43' },
  {
    id: 'm5',
    sender: 'Yuki 🐱',
    text: 'Vote for who gets eliminated tonight... I am scared!',
    time: '10:43',
  },
];

export default function HomeScreen() {
  const theme = useTheme();

  // Live Voting State
  const [votes, setVotes] = useState({ Kenji: 420, Yuki: 980, Sakura: 180 });
  const [hasVoted, setHasVoted] = useState(false);

  // Live Chat State
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  // Audience Emoji Reactions State
  const [reactions, setReactions] = useState({
    '🔥': 2341,
    '💖': 5892,
    '😂': 1489,
    '😮': 602,
    '💀': 892,
  });

  // Handle Casting a Vote
  const handleVote = (candidate) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [candidate]: prev[candidate] + 1 }));
    setHasVoted(true);
  };

  // Handle Sending a Message (as Audience)
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `audience-${Date.now()}`,
      sender: 'You (Audience) 👁️',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  // Handle Emoji Reaction
  const handleReaction = (emoji) => {
    setReactions((prev) => ({ ...prev, [emoji]: prev[emoji] + 1 }));
  };

  // Calculate Voting Percentages
  const totalVotes = votes.Kenji + votes.Yuki + votes.Sakura;
  const getPercentage = (candidateVotes) => {
    return totalVotes > 0 ? Math.round((candidateVotes / totalVotes) * 100) : 0;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={theme.text === '#ffffff' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Banner */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.brandTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
                VIBE VILLA
              </Text>
              <Text
                style={[
                  styles.brandSubtitle,
                  { color: theme.textSecondary, fontFamily: Fonts.sans },
                ]}
              >
                Anime Avatar Reality Show
              </Text>
            </View>
            <View style={styles.liveIndicatorContainer}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>1.2M WATCHING</Text>
            </View>
          </View>

          {/* Hero Stream Banner */}
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

          {/* Active Contestants */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Contestants</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contestantsContainer}
          >
            {CONTESTANTS.map((c) => (
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

          {/* Live Eviction Voting Card */}
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
                  onPress={() => handleVote('Kenji')}
                  disabled={hasVoted}
                >
                  <Text style={styles.voteBtnText}>
                    {hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}
                  </Text>
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
                  onPress={() => handleVote('Yuki')}
                  disabled={hasVoted}
                >
                  <Text style={styles.voteBtnText}>
                    {hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}
                  </Text>
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
                  onPress={() => handleVote('Sakura')}
                  disabled={hasVoted}
                >
                  <Text style={styles.voteBtnText}>
                    {hasVoted ? 'Vote Saved' : 'Vote to Eliminate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.votingDisclaimer, { color: theme.textSecondary }]}>
              ⚡ Instant Redis sync active. Multi-vote prevention enabled.
            </Text>
          </View>

          {/* Real-time Contestant Chat Feed */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Live Villa Conversation
            </Text>
          </View>

          <View style={[styles.chatBox, { backgroundColor: theme.backgroundElement }]}>
            <ScrollView
              nestedScrollEnabled
              style={styles.chatScroll}
              contentContainerStyle={styles.chatScrollContent}
            >
              {messages.map((msg) => {
                const isAudience = msg.sender.includes('You');
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.chatMessage,
                      {
                        backgroundColor: isAudience ? theme.backgroundSelected : theme.background,
                        alignSelf: isAudience ? 'flex-end' : 'flex-start',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chatSender,
                        { color: isAudience ? theme.accent : theme.textSecondary },
                      ]}
                    >
                      {msg.sender}
                    </Text>
                    <Text style={[styles.chatText, { color: theme.text }]}>{msg.text}</Text>
                    <Text style={[styles.chatTime, { color: theme.textSecondary }]}>
                      {msg.time}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Audience Reaction Bar */}
            <View style={[styles.reactionContainer, { borderTopColor: theme.background }]}>
              {Object.keys(reactions).map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionBtn}
                  onPress={() => handleReaction(emoji)}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                  <Text style={[styles.reactionCount, { color: theme.textSecondary }]}>
                    {reactions[emoji]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Message input */}
            <View style={[styles.inputRow, { borderTopColor: theme.background }]}>
              <TextInput
                style={[
                  styles.chatInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
                placeholder="Interact as live audience..."
                placeholderTextColor={theme.textSecondary}
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: theme.accent }]}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.five,
  },
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
  chatBox: {
    marginHorizontal: Spacing.three,
    borderRadius: 16,
    height: 380,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  chatScroll: {
    flex: 1,
    padding: Spacing.three,
  },
  chatScrollContent: {
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  chatMessage: {
    borderRadius: 12,
    padding: Spacing.two,
    maxWidth: '85%',
  },
  chatSender: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 18,
  },
  chatTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 2,
    opacity: 0.7,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  reactionBtn: {
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    padding: Spacing.two,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    fontSize: 13,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
  sendButtonText: {
    fontSize: 16,
  },
});
