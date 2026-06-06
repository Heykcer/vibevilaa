import React, { useState } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';

import HeaderBanner from '../components/header-banner';
import HeroBanner from '../components/hero-banner';
import ContestantList from '../components/contestant-list';
import EvictionPoll from '../components/eviction-poll';
import ChatFeed from '../components/chat-feed';

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
          <HeaderBanner />

          {/* Hero Stream Banner */}
          <HeroBanner />

          {/* Active Contestants */}
          <ContestantList contestants={CONTESTANTS} />

          {/* Live Eviction Voting Card */}
          <EvictionPoll votes={votes} hasVoted={hasVoted} onVote={handleVote} />

          {/* Real-time Contestant Chat Feed */}
          <ChatFeed
            messages={messages}
            reactions={reactions}
            onReaction={handleReaction}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
          />
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
});
