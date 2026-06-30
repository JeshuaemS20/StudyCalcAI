import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

type Props = {
  previewUri: string | null;
  result: string;
  resultState: 'idle' | 'loading' | 'done' | 'error';
  actionsEnabled?: boolean;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onClear: () => void;
  onSolve: () => void;
};

export default function ScanPanel({
  previewUri,
  result,
  resultState,
  actionsEnabled = true,
  onPickImage,
  onTakePhoto,
  onClear,
  onSolve,
}: Props) {
  return (
    <View style={styles.panel}>
      {!previewUri ? (
        <View style={styles.uploadZone}>
          <Ionicons name="camera-outline" size={32} color={colors.textMuted} style={styles.camIcon} />
          <Text style={styles.uploadTitle}>Take a photo or upload an image</Text>
          <Text style={styles.uploadSub}>of any math problem — handwritten or printed</Text>
          <View style={styles.uploadBtns}>
            <Pressable
              style={[styles.pickBtn, !actionsEnabled && styles.pickBtnDisabled]}
              onPress={onTakePhoto}
              disabled={!actionsEnabled}
            >
              <Text style={styles.pickBtnText}>Camera</Text>
            </Pressable>
            <Pressable
              style={[styles.pickBtn, styles.pickBtnAlt, !actionsEnabled && styles.pickBtnDisabled]}
              onPress={onPickImage}
              disabled={!actionsEnabled}
            >
              <Text style={styles.pickBtnTextAlt}>Gallery</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.previewBox}>
          <Image source={{ uri: previewUri }} style={styles.previewImg} resizeMode="contain" />
          <Pressable style={styles.previewClear} onPress={onClear}>
            <Text style={styles.previewClearText}>✕</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={[styles.solveBtn, (!previewUri || resultState === 'loading') && styles.solveDisabled]}
        onPress={onSolve}
        disabled={!previewUri || resultState === 'loading'}
      >
        <Text style={styles.solveBtnText}>Solve this problem</Text>
      </Pressable>

      {resultState !== 'idle' && (
        <ScrollView
          style={[styles.result, resultState === 'error' && styles.resultError]}
        >
          <Text
            style={[
              styles.resultText,
              resultState === 'loading' && styles.resultLoading,
              resultState === 'error' && styles.resultTextError,
            ]}
          >
            {result}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 12 },
  uploadZone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  camIcon: { marginBottom: 10 },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
    textAlign: 'center',
  },
  uploadSub: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  uploadBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  pickBtn: {
    flex: 1,
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickBtnAlt: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.green,
  },
  pickBtnDisabled: { opacity: 0.5 },
  pickBtnText: { color: colors.greenDark, fontWeight: '700', fontSize: 14 },
  pickBtnTextAlt: { color: colors.green, fontWeight: '700', fontSize: 14 },
  previewBox: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  previewImg: { width: '100%', height: 180 },
  previewClear: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(33,35,37,0.9)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewClearText: { color: colors.text, fontSize: 14 },
  solveBtn: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  solveDisabled: { opacity: 0.35 },
  solveBtnText: { color: colors.greenDark, fontSize: 15, fontWeight: '700' },
  result: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    maxHeight: 220,
  },
  resultError: { borderColor: colors.error },
  resultText: { fontSize: 13, color: colors.aiAssistantText, lineHeight: 22 },
  resultLoading: { color: colors.textMuted, fontStyle: 'italic' },
  resultTextError: { color: colors.error },
});
