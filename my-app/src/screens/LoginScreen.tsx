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
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { loginUser } from '../lib/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const C = {
  bg: '#1a1a1a',
  lime: '#aaff00',
  limeHover: '#ccff44',
  limeBright: '#c2ff44',
  text: '#e8e8e8',
  textMuted: '#ccc',
  textSoft: '#bbb',
  placeholder: '#888',
  inputBg: '#222',
  inputFocusBg: '#252525',
  line: '#333',
  orText: '#777',
  socialBg: '#2a2a2a',
  socialHover: '#333',
  btnText: '#111',
  footer: '#555',
  toggleOff: '#555',
  white: '#fff',
} as const;

function validateEmail(testEmail: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail);
}

function RememberToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable style={styles.remember} onPress={() => onChange(!value)}>
      <View
        style={[styles.toggle, value && styles.toggleOn]}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      >
        <View style={styles.toggleThumb} />
      </View>
      <Text style={styles.rememberText}>Remember Me</Text>
    </Pressable>
  );
}

function OrDivider() {
  return (
    <View style={styles.orRow}>
      <View style={styles.orLine} />
      <Text style={styles.orText}>OR SIGN IN WITH:</Text>
      <View style={styles.orLine} />
    </View>
  );
}

function SocialButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.socialBtn, pressed && styles.socialBtnPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {children}
    </Pressable>
  );
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await loginUser(email.trim().toLowerCase(), password);
      navigation.navigate('Home' as never);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setGuestLoading(true);
    setTimeout(() => {
      setGuestLoading(false);
      navigation.navigate('Home' as never);
    }, 600);
  };

  const socialSignIn = (provider: string) => {
    Alert.alert(`${provider} sign-in`, 'Coming soon.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>StudyCalc AI</Text>

            <View style={styles.inputGroup}>
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
                editable={!loading && !guestLoading}
                selectionColor={C.lime}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={C.placeholder}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                editable={!loading && !guestLoading}
                onSubmitEditing={handleLogin}
                returnKeyType="go"
                selectionColor={C.lime}
              />
            </View>

            <View style={styles.extras}>
              <RememberToggle value={rememberMe} onChange={setRememberMe} />
              <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnLogin,
                pressed && styles.btnLoginPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading || guestLoading}
            >
              {loading ? (
                <ActivityIndicator color={C.btnText} />
              ) : (
                <Text style={styles.btnLoginText}>LOG IN</Text>
              )}
            </Pressable>

            <OrDivider />

            <View style={styles.socialRow}>
              <SocialButton label="Sign in with Google" onPress={() => socialSignIn('Google')}>
                <AntDesign name="google" size={26} color="#EA4335" />
              </SocialButton>
              <SocialButton label="Sign in with Apple" onPress={() => socialSignIn('Apple')}>
                <Ionicons name="logo-apple" size={26} color={C.white} />
              </SocialButton>
              <SocialButton label="Sign in with GitHub" onPress={() => socialSignIn('GitHub')}>
                <AntDesign name="github" size={26} color={C.white} />
              </SocialButton>
            </View>

            <Text style={styles.createRow}>
              New to StudyCalc?{' '}
              <Text
                style={styles.createLink}
                onPress={() => navigation.navigate('SignUp' as never)}
              >
                Create an Account
              </Text>
            </Text>

            <Pressable
              style={styles.guestRow}
              onPress={handleGuestLogin}
              disabled={loading || guestLoading}
            >
              <Ionicons name="person-circle-outline" size={22} color={C.textSoft} />
              {guestLoading ? (
                <ActivityIndicator color={C.lime} size="small" />
              ) : (
                <Text style={styles.guestText}>Or, Log in as Guest</Text>
              )}
            </Pressable>

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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  container: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: C.lime,
    letterSpacing: -0.5,
    marginBottom: 36,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    gap: 14,
    marginBottom: 18,
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
  },
  extras: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rememberText: {
    fontSize: 15,
    color: C.textMuted,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.toggleOff,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-start',
  },
  toggleOn: {
    backgroundColor: C.lime,
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.white,
  },
  forgot: {
    fontSize: 15,
    color: C.lime,
    textDecorationLine: 'underline',
  },
  btnLogin: {
    width: '100%',
    backgroundColor: C.lime,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 28,
  },
  btnLoginPressed: {
    backgroundColor: C.limeBright,
  },
  btnDisabled: {
    opacity: 0.85,
  },
  btnLoginText: {
    color: C.btnText,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  orRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.line,
  },
  orText: {
    fontSize: 12,
    color: C.orText,
    letterSpacing: 1,
  },
  socialRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: C.socialBg,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnPressed: {
    backgroundColor: C.socialHover,
  },
  createRow: {
    fontSize: 15,
    color: C.textSoft,
    marginBottom: 20,
    textAlign: 'center',
  },
  createLink: {
    color: C.lime,
    textDecorationLine: 'underline',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  guestText: {
    fontSize: 15,
    color: C.textSoft,
  },
  footer: {
    fontSize: 12,
    color: C.footer,
    textAlign: 'center',
  },
});
