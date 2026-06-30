import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useFonts, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import SplashCubeLogo from '../components/splash/SplashCubeLogo';
import SplashBackground from '../components/splash/SplashBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const APP_NAME = 'StudyCalc AI';
const GREEN_START = 10;
const SPLASH_DURATION_MS = 5000;

const C = {
  bg: '#000000',
  green: '#39ff14',
  white: '#ffffff',
  tagline: 'rgba(180,255,160,0.45)',
  barBg: 'rgba(255,255,255,0.08)',
} as const;

export default function SplashScreen({ navigation }: Props) {
  const [fontsLoaded] = useFonts({ Syne_700Bold, Syne_800ExtraBold });

  const logoOp = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const dividerScale = useRef(new Animated.Value(0)).current;
  const dividerOp = useRef(new Animated.Value(0)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const barOp = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  const charAnims = useRef(
    APP_NAME.split('').map(() => ({
      op: new Animated.Value(0),
      y: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    Animated.parallel([
      Animated.timing(logoOp, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    ]).start();

    const letterTimer = setTimeout(() => {
      charAnims.forEach((a, i) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(a.op, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(a.y, {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }, i * 55);
      });
    }, 700);

    const phase2 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(dividerScale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dividerOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(tagOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(barOp, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
      Animated.timing(barWidth, {
        toValue: 1,
        duration: 2600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, 2000);

    const navTimer = setTimeout(() => navigation.replace('Login'), SPLASH_DURATION_MS);

    return () => {
      clearTimeout(letterTimer);
      clearTimeout(phase2);
      clearTimeout(navTimer);
    };
  }, [fontsLoaded, navigation, logoOp, logoScale, dividerScale, dividerOp, tagOp, barOp, barWidth, charAnims]);

  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <SplashBackground />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOp, transform: [{ scale: logoScale }] },
          ]}
        >
          <SplashCubeLogo size={160} />
        </Animated.View>

        <View style={styles.appName}>
          <View style={styles.appNameRow}>
            {APP_NAME.split('').map((ch, i) => (
              <Animated.Text
                key={`${ch}-${i}`}
                style={[
                  styles.char,
                  ch === ' ' && styles.charSpace,
                  i >= GREEN_START ? styles.charGreen : styles.charWhite,
                  { opacity: charAnims[i].op, transform: [{ translateY: charAnims[i].y }] },
                ]}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </Animated.Text>
            ))}
          </View>
        </View>

        <Animated.View
          style={[
            styles.divider,
            { opacity: dividerOp, transform: [{ scaleX: dividerScale }] },
          ]}
        />

        <Animated.Text style={[styles.tagline, { opacity: tagOp }]}>
          YOUR AI-POWERED STUDY COMPANION
        </Animated.Text>
      </View>

      <Animated.View style={[styles.barWrap, { opacity: barOp }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: barWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  logoWrap: {
    marginBottom: 32,
  },
  appName: {
    alignItems: 'center',
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  appNameRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  char: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 36,
    letterSpacing: -0.5,
    flexShrink: 0,
  },
  charSpace: {
    minWidth: 6,
  },
  charWhite: {
    color: C.white,
  },
  charGreen: {
    color: C.green,
    textShadowColor: C.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  divider: {
    width: 52,
    height: 1.5,
    backgroundColor: 'rgba(57,255,20,0.45)',
    borderRadius: 2,
    marginTop: 18,
  },
  tagline: {
    marginTop: 14,
    paddingHorizontal: 28,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 3.5,
    color: C.tagline,
    fontWeight: '400',
  },
  barWrap: {
    position: 'absolute',
    bottom: 72,
    alignSelf: 'center',
    width: 140,
    height: 2,
    backgroundColor: C.barBg,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: C.green,
  },
});
