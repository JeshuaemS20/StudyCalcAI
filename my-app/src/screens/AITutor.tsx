// Copyright (c) 2026 Jeshuaem Sepulveda. All rights reserved.

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { askGeminiTutor } from '../lib/gemini';

type Props = NativeStackScreenProps<RootStackParamList, 'AITutor'>;

export default function AITutor({ route, navigation }: Props) {
  const initialPrompt = route.params?.prompt?.trim() ?? '';
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onAskAI = useCallback(async () => {
    if (prompt.trim() === '') {
      setError('Please enter a question for the AI.');
      setAIResponse('');
      return;
    }

    setAIResponse('');
    setError('');
    setLoading(true);

    try {
      const text = await askGeminiTutor(prompt, { display: '', notes: '' });
      setAIResponse(text);
    } catch (err) {
      console.error('Gemini API error:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to get a response from the AI.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => {
    if (initialPrompt) {
      void onAskAI();
    }
    // Run only on mount with the initial prompt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
        <View style={styles.container}>
          <Text style={styles.title}>AI Tutor</Text>
          <Text style={styles.subtitle}>Question from calculator:</Text>
          <View style={styles.promptCard}>
            <TextInput
              style={styles.promptInput}
              value={prompt}
              onChangeText={(text) => {
                setPrompt(text);
                setError('');
              }}
              placeholder="Type your question here"
              placeholderTextColor="#6C757D"
              multiline
              editable={!loading}
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
          <Pressable
            style={[styles.askAIButton, loading && styles.askAIDisabled]}
            onPress={() => void onAskAI()}
            disabled={loading}
          >
            <Text style={styles.askAIButtonText}>{loading ? 'Thinking...' : 'Ask AI'}</Text>
          </Pressable>
          <Text style={styles.note}>
            {prompt
              ? 'Below is an AI-generated response to your question.'
              : 'No question yet. Provide a problem above and ask AI.'}
          </Text>
          {loading ? (
            <View style={styles.responseCard}>
              <ActivityIndicator size="large" color="#B5FF39" style={{ marginVertical: 12 }} />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          ) : error ? (
            <View style={styles.responseCard}>
              <Text style={styles.aiErrorText}>{error}</Text>
            </View>
          ) : (
            !!aiResponse && (
              <ScrollView style={styles.responseCard}>
                <Text style={styles.aiResponseText}>{aiResponse}</Text>
              </ScrollView>
            )
          )}
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Calculator</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>© 2026 Jeshuaem Sepulveda</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C1E',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    color: '#B5FF39',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b1b8b9',
    marginBottom: 12,
    textAlign: 'center',
  },
  promptCard: {
    width: '100%',
    backgroundColor: '#23252B',
    borderColor: '#383B41',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptInput: {
    color: '#E8EAED',
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: 'transparent',
    minHeight: 44,
    flex: 1,
    textAlignVertical: 'top',
  },
  note: {
    fontSize: 15,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 13,
  },
  askAIButton: {
    backgroundColor: '#B5FF39',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginBottom: 10,
    minWidth: 90,
    marginTop: -8,
    marginRight: 3,
  },
  askAIDisabled: {
    backgroundColor: '#d8eeab',
  },
  askAIButtonText: {
    color: '#1A1C1E',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  responseCard: {
    width: '100%',
    backgroundColor: '#24273a',
    borderRadius: 10,
    padding: 16,
    minHeight: 60,
    marginBottom: 17,
    maxHeight: 400,
  },
  aiResponseText: {
    color: '#B5FF39',
    fontSize: 16,
    lineHeight: 23,
  },
  aiErrorText: {
    color: '#ff615c',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    color: '#bdbdbd',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#B5FF39',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  backButtonText: {
    color: '#1A1C1E',
    fontWeight: '700',
    fontSize: 15,
  },
  copyrightContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: '#1A1C1E',
    alignItems: 'center',
  },
  copyrightText: {
    color: '#B5FF39',
    fontSize: 12,
    textAlign: 'center',
  },
});
