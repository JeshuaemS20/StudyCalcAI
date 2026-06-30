// Copyright (c) 2026 Jeshuaem Sepulveda. All rights reserved.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import AppLogo from '../components/AppLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const C = {
  bg: '#1a1a1a',
  lime: '#aaff00',
  limeBright: '#c2ff44',
  textMuted: '#ccc',
  textSoft: '#bbb',
  placeholder: '#888',
  inputBg: '#222',
  btnText: '#111',
  footer: '#555',
} as const;

function validateEmail(testEmail: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(testEmail);
}

export default function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendReset = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Pressable
        style={[styles.backBtn, { top: insets.top + 4 }]}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={28} color={C.lime} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 52, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.logoWrap}>
              <AppLogo size={120} borderColor={C.lime} />
            </View>

            <Text style={styles.title}>Forgot Password</Text>

            {sent ? (
              <View style={styles.successBox}>
                <Ionicons name="mail-outline" size={40} color={C.lime} />
                <Text style={styles.successTitle}>Check your email</Text>
                <Text style={styles.successText}>
                  We sent a password reset link to{'\n'}
                  <Text style={styles.successEmail}>{email}</Text>
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.btnPrimaryText}>BACK TO LOG IN</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Enter the email linked to your account and we&apos;ll send you a link to reset
                  your password.
                </Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor={C.placeholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  editable={!loading}
                  selectionColor={C.lime}
                  onSubmitEditing={handleSendReset}
                  returnKeyType="send"
                  accessibilityLabel="Email"
                />

                <Pressable
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    pressed && styles.btnPrimaryPressed,
                    loading && styles.btnDisabled,
                  ]}
                  onPress={handleSendReset}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={C.btnText} />
                  ) : (
                    <Text style={styles.btnPrimaryText}>SEND RESET LINK</Text>
                  )}
                </Pressable>
              </>
            )}

            {!sent && (
              <Text style={styles.footerLinkRow}>
                Remember your password?{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                  Sign In
                </Text>
              </Text>
            )}

            <Text style={styles.footer}>© 2026 Jeshuaem Sepulveda</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: C.lime,
    letterSpacing: -0.5,
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: C.textSoft,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  input: {
    width: '100%',
    backgroundColor: C.inputBg,
    borderWidth: 1.8,
    borderColor: C.lime,
    borderRadius: 14,
    color: C.textMuted,
    fontSize: 16,
    paddingVertical: 17,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: C.lime,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnPrimaryPressed: {
    backgroundColor: C.limeBright,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  btnPrimaryText: {
    color: C.btnText,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  successBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#222',
    borderWidth: 1.8,
    borderColor: C.lime,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.lime,
    textAlign: 'center',
  },
  successText: {
    fontSize: 15,
    color: C.textSoft,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  successEmail: {
    color: C.textMuted,
    fontWeight: '600',
  },
  footerLinkRow: {
    fontSize: 15,
    color: C.textSoft,
    marginBottom: 24,
    textAlign: 'center',
  },
  footerLink: {
    color: C.lime,
    textDecorationLine: 'underline',
  },
  footer: {
    fontSize: 12,
    color: C.footer,
    textAlign: 'center',
  },
});
