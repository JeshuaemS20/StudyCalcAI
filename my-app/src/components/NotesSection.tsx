import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  notes: string;
  notesVisible: boolean;
  onNotesChange: (value: string) => void;
  onToggleNotes: () => void;
  onTutorMode: () => void;
  onAskHelp: () => void;
};

export default function NotesSection({
  notes,
  notesVisible,
  onNotesChange,
  onToggleNotes,
  onTutorMode,
  onAskHelp,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.rightRow}>
          <Pressable onPress={onTutorMode}>
            <Text style={styles.tutorBtn}>Tutor Mode</Text>
          </Pressable>
          <Pressable
            onPress={onToggleNotes}
            style={[styles.toggle, !notesVisible && styles.toggleOff]}
            accessibilityRole="switch"
            accessibilityState={{ checked: notesVisible }}
          >
            <View style={[styles.knob, !notesVisible && styles.knobOff]} />
          </Pressable>
        </View>
      </View>

      {notesVisible && (
        <View style={styles.latexBox}>
          <Text style={styles.formula}>x = (−b ± √(b² − 4ac)) / 2a</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Write your notes here..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <Pressable style={styles.helpBtn} onPress={onAskHelp}>
            <Text style={styles.helpBtnText}>?</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.section,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tutorBtn: { fontSize: 12, fontWeight: '600', color: colors.green },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.green,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  toggleOff: { backgroundColor: colors.toggleOff, alignItems: 'flex-start' },
  knob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  knobOff: {},
  title: { fontSize: 15, fontWeight: '700', color: colors.textTitle },
  latexBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 90,
  },
  formula: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  notesInput: {
    fontSize: 13,
    color: colors.textNotes,
    lineHeight: 20,
    minHeight: 36,
    paddingRight: 36,
  },
  helpBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBtnText: { color: colors.green, fontSize: 13, fontWeight: '700' },
});
