import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

const SYMBOLS: { sym: string; x: number; y: number; size: number; opacity: number }[] = [
  { sym: '≠', x: 0.06, y: 0.1, size: 30, opacity: 0.14 },
  { sym: 'β', x: 0.78, y: 0.08, size: 34, opacity: 0.12 },
  { sym: 'λ', x: 0.88, y: 0.22, size: 28, opacity: 0.1 },
  { sym: 'Δ', x: 0.04, y: 0.28, size: 26, opacity: 0.11 },
  { sym: '÷', x: 0.72, y: 0.38, size: 32, opacity: 0.13 },
  { sym: '%', x: 0.1, y: 0.52, size: 24, opacity: 0.09 },
  { sym: 'θ', x: 0.84, y: 0.55, size: 30, opacity: 0.11 },
  { sym: '=', x: 0.18, y: 0.72, size: 28, opacity: 0.1 },
  { sym: '∑', x: 0.8, y: 0.7, size: 22, opacity: 0.08 },
  { sym: 'π', x: 0.05, y: 0.85, size: 26, opacity: 0.09 },
  { sym: '×', x: 0.9, y: 0.88, size: 24, opacity: 0.1 },
  { sym: '∫', x: 0.42, y: 0.06, size: 20, opacity: 0.07 },
  { sym: 'α', x: 0.55, y: 0.9, size: 22, opacity: 0.08 },
];

export default function SplashBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.vignette} />
      {SYMBOLS.map((s, i) => (
        <Text
          key={i}
          style={[
            styles.symbol,
            {
              left: s.x * width,
              top: s.y * height,
              fontSize: s.size,
              opacity: s.opacity,
            },
          ]}
        >
          {s.sym}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(57,255,20,0.03)',
  },
  symbol: {
    position: 'absolute',
    color: '#39ff14',
    fontWeight: '700',
  },
});
