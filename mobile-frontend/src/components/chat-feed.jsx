import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

export default function ChatFeed({
  messages = [],
  reactions = {},
  onReaction,
  newMessage = '',
  onNewMessageChange,
  onSendMessage,
}) {
  const theme = useTheme();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Live Villa Conversation</Text>
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
                <Text style={[styles.chatTime, { color: theme.textSecondary }]}>{msg.time}</Text>
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
              onPress={() => onReaction(emoji)}
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
            onChangeText={onNewMessageChange}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.accent }]}
            onPress={onSendMessage}
          >
            <Text style={styles.sendButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
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
