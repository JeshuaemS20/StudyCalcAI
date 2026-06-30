import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GREEN = '#39ff14';

export default function SplashCubeLogo({ size = 130 }: { size?: number }) {
  const scale = size / 130;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      <View style={[styles.cube, { transform: [{ scale }] }]}>
        <View style={styles.backRight} />
        <View style={styles.backLeft} />
        <View style={styles.top} />
        <View style={styles.faceRight} />
        <View style={styles.faceLeft} />
        <View style={styles.topShine} />
        <Text style={styles.sigma}>∑</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(57,255,20,0.14)',
  },
  glowInner: {
    position: 'absolute',
    width: 165,
    height: 165,
    borderRadius: 82,
    backgroundColor: 'rgba(57,255,20,0.22)',
  },
  cube: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRight: {
    position: 'absolute',
    top: 18,
    left: 38,
    width: 44,
    height: 58,
    backgroundColor: '#1a3a10',
    borderWidth: 1.2,
    borderColor: GREEN,
    opacity: 0.55,
    transform: [{ skewY: '-18deg' }],
  },
  backLeft: {
    position: 'absolute',
    top: 18,
    left: 28,
    width: 44,
    height: 58,
    backgroundColor: '#0e2609',
    borderWidth: 1.2,
    borderColor: GREEN,
    opacity: 0.55,
    transform: [{ skewY: '18deg' }],
  },
  top: {
    position: 'absolute',
    top: 10,
    width: 62,
    height: 62,
    backgroundColor: GREEN,
    opacity: 0.88,
    borderWidth: 1.2,
    borderColor: '#ccff44',
    transform: [{ rotate: '45deg' }, { scaleY: 0.5 }],
  },
  faceRight: {
    position: 'absolute',
    top: 42,
    left: 52,
    width: 36,
    height: 46,
    backgroundColor: '#1d7a09',
    borderWidth: 1,
    borderColor: GREEN,
    transform: [{ skewY: '-18deg' }],
  },
  faceLeft: {
    position: 'absolute',
    top: 42,
    left: 22,
    width: 36,
    height: 46,
    backgroundColor: '#155c07',
    borderWidth: 1,
    borderColor: GREEN,
    transform: [{ skewY: '18deg' }],
  },
  topShine: {
    position: 'absolute',
    top: 16,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(200,255,180,0.2)',
    transform: [{ rotate: '45deg' }, { scaleY: 0.5 }],
  },
  sigma: {
    position: 'absolute',
    top: 48,
    fontSize: 30,
    fontWeight: '800',
    color: GREEN,
    textShadowColor: GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
});
