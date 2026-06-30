import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

type KeyDef = {
  label: string;
  value: string;
  wide?: boolean;
  variant: 'fn' | 'num' | 'op' | 'green' | 'eq' | 'chat';
  isIcon?: boolean;
};

const ROWS: KeyDef[][] = [
  [
    { label: '√', value: '√(', variant: 'fn' },
    { label: '·', value: '.', variant: 'fn' },
    { label: 'sin', value: 'sin(', variant: 'fn' },
    { label: 'cos', value: 'cos(', variant: 'fn' },
    { label: 'tan', value: 'tan(', variant: 'fn' },
    { label: 'π', value: 'π', variant: 'op' },
    { label: '⌫', value: '⌫', variant: 'op' },
  ],
  [
    { label: 'log', value: 'log(', variant: 'fn' },
    { label: '1', value: '1', variant: 'num' },
    { label: '2', value: '2', variant: 'num' },
    { label: '3', value: '3', variant: 'num' },
    { label: '÷', value: '/', variant: 'op' },
    { label: '(', value: '(', variant: 'op' },
    { label: ')', value: ')', variant: 'op' },
  ],
  [
    { label: 'xʸ', value: '^', variant: 'fn' },
    { label: '4', value: '4', variant: 'num' },
    { label: '5', value: '5', variant: 'num' },
    { label: '6', value: '6', variant: 'num' },
    { label: '×', value: '*', variant: 'op' },
    { label: '%', value: '%', variant: 'op' },
    { label: 'e', value: 'e', variant: 'op' },
  ],
  [
    { label: '√x', value: '√x', variant: 'green' },
    { label: '7', value: '7', variant: 'num' },
    { label: '8', value: '8', variant: 'num' },
    { label: '9', value: '9', variant: 'num' },
    { label: '−', value: '-', variant: 'op' },
    { label: 'AC', value: 'AC', variant: 'fn', wide: true },
  ],
  [
    { label: '0', value: '0', variant: 'num', wide: true },
    { label: '.', value: '.', variant: 'num' },
    { label: 'x', value: 'x', variant: 'num' },
    { label: '+', value: '+', variant: 'op' },
    { label: '=', value: '=', variant: 'eq', wide: true },
    { label: '💬', value: '💬', variant: 'chat', isIcon: true },
  ],
];

type Props = {
  display: string;
  onAppend: (value: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEvaluate: () => void;
  onSqrt: () => void;
  onOpenAI: () => void;
};

function keyStyle(variant: KeyDef['variant'], wide?: boolean) {
  const base = [styles.key, wide && styles.keyWide];
  switch (variant) {
    case 'fn':
      return [...base, styles.keyFn];
    case 'num':
      return [...base, styles.keyNum];
    case 'op':
      return [...base, styles.keyOp];
    case 'green':
      return [...base, styles.keyGreen];
    case 'eq':
      return [...base, styles.keyEq];
    case 'chat':
      return [...base, styles.keyChat];
    default:
      return base;
  }
}

function keyTextStyle(variant: KeyDef['variant']) {
  if (variant === 'eq') return styles.keyTextDark;
  if (variant === 'green') return styles.keyTextGreen;
  if (variant === 'op') return styles.keyTextOp;
  return styles.keyText;
}

export default function CalculatorPanel({
  display,
  onAppend,
  onDelete,
  onClear,
  onEvaluate,
  onSqrt,
  onOpenAI,
}: Props) {
  const handleKey = (value: string) => {
    if (value === '⌫') return onDelete();
    if (value === 'AC') return onClear();
    if (value === '=') return onEvaluate();
    if (value === '√x') return onSqrt();
    if (value === '💬') return onOpenAI();
    onAppend(value);
  };

  return (
    <View>
      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={2}>
          {display}
        </Text>
      </View>
      <View style={styles.keypad}>
        {ROWS.map((row, i) => (
          <View key={i} style={styles.keyRow}>
            {row.map((key) => (
              <Pressable
                key={key.label + key.value}
                style={({ pressed }) => [
                  ...keyStyle(key.variant, key.wide),
                  pressed && styles.keyPressed,
                ]}
                onPress={() => handleKey(key.value)}
              >
                {key.isIcon ? (
                  <Ionicons name="chatbubble-outline" size={22} color={colors.textBright} />
                ) : (
                  <Text style={keyTextStyle(key.variant)}>{key.label}</Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  display: {
    backgroundColor: colors.display,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  displayText: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
    fontFamily: 'monospace',
  },
  cursor: { display: 'none' },
  keypad: { gap: 7 },
  keyRow: { flexDirection: 'row', gap: 7, marginBottom: 7 },
  key: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyWide: { flex: 2 },
  keyFn: { backgroundColor: colors.keyFn },
  keyNum: { backgroundColor: colors.keyNum },
  keyOp: { backgroundColor: colors.keyOp },
  keyGreen: { backgroundColor: colors.keyOp },
  keyEq: { backgroundColor: colors.green },
  keyChat: {
    backgroundColor: colors.keyNum,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    width: 44,
    flex: 0,
  },
  keyPressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
  keyText: { fontSize: 13, fontWeight: '600', color: colors.text },
  keyTextOp: { fontSize: 13, fontWeight: '700', color: colors.green },
  keyTextDark: { fontSize: 16, fontWeight: '800', color: colors.greenDark },
  keyTextGreen: { fontSize: 13, fontWeight: '700', color: colors.green },
});
