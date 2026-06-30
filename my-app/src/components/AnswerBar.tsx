import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  answer: string;
  loading?: boolean;
};

export default function AnswerBar({ answer, loading }: Props) {
  const hasAnswer = answer.trim().length > 0;

  return (
    <View style={styles.wrap}>
      {!hasAnswer && !loading && (
        <Text style={styles.hint}>Ans Bar (e.g., 14.8324... | Hist)</Text>
      )}
      {loading && <Text style={styles.loading}>Solving…</Text>}
      {hasAnswer && !loading && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    backgroundColor: colors.display,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 72,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  loading: {
    fontSize: 13,
    color: colors.textSoft,
    fontStyle: 'italic',
  },
  answer: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});
