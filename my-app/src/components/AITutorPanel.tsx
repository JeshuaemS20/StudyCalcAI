import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { ChatMessage } from '../types';
import { colors } from '../theme/colors';

type Props = {
  messages: ChatMessage[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

export default function AITutorPanel({
  messages,
  input,
  loading,
  onInputChange,
  onSend,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.panel}>
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 && (
          <Text style={styles.empty}>Ask the AI Tutor anything about your problem...</Text>
        )}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msg,
              msg.role === 'user' && styles.msgUser,
              msg.role === 'assistant' && styles.msgAssistant,
              msg.role === 'loading' && styles.msgLoading,
            ]}
          >
            {msg.role === 'loading' ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.textMuted} />
                <Text style={styles.loadingText}>Thinking…</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.msgText,
                  msg.role === 'assistant' && styles.msgAssistantText,
                ]}
              >
                {msg.text}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={onInputChange}
          placeholder="Ask about the problem..."
          placeholderTextColor={colors.textMuted}
          editable={!loading}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendBtn, (loading || !input.trim()) && styles.sendDisabled]}
          onPress={onSend}
          disabled={loading || !input.trim()}
        >
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 10 },
  messages: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 240,
    minHeight: 160,
  },
  messagesContent: { padding: 12, gap: 8 },
  empty: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 30,
  },
  msg: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    maxWidth: '92%',
  },
  msgUser: {
    backgroundColor: colors.aiUser,
    alignSelf: 'flex-end',
  },
  msgAssistant: {
    backgroundColor: colors.aiAssistant,
    alignSelf: 'flex-start',
  },
  msgLoading: { alignSelf: 'flex-start' },
  msgText: { fontSize: 13, lineHeight: 20, color: colors.text },
  msgAssistantText: { color: colors.aiAssistantText },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: colors.textMuted, fontStyle: 'italic', fontSize: 13 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.green,
    borderRadius: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  sendText: { fontSize: 20, fontWeight: '800', color: colors.greenDark },
});
