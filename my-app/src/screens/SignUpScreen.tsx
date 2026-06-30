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
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { signUpUser } from '../lib/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const C = {
  bg: '#1a1a1a',
  lime: '#aaff00',
  limeBright: '#c2ff44',
  textMuted: '#ccc',
  textSoft: '#bbb',
  placeholder: '#888',
  inputBg: '#222',
  line: '#333',
  orText: '#777',
  socialBg: '#2a2a2a',
  socialHover: '#333',
  btnText: '#111',
  footer: '#555',
  white: '#fff',
} as const;

function validateEmail(testEmail: string): boolean {
  // Improved email regex and explicit string type on return
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(testEmail);
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

type SocialButtonProps = {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
};

function SocialButton({ label, onPress, children }: SocialButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.socialBtn, pressed && styles.socialBtnPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={`social-btn-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {children}
    </Pressable>
  );
}

export default function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUpUser(name.trim(), email.trim().toLowerCase(), password);
      Alert.alert('Success', 'Account created. Please log in.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = (provider: string) => {
    Alert.alert(`${provider} sign-in`, 'Coming soon.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Pressable
        style={[styles.backBtn, { top: insets.top + 4 }]}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        testID="go-back-btn"
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
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={C.placeholder}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
                selectionColor={C.lime}
                accessibilityLabel="Name"
                textContentType="name"
              />
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
                accessibilityLabel="Email"
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
                textContentType="newPassword"
                editable={!loading}
                selectionColor={C.lime}
                accessibilityLabel="Password"
              />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor={C.placeholder}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                editable={!loading}
                onSubmitEditing={handleSignUp}
                returnKeyType="go"
                selectionColor={C.lime}
                accessibilityLabel="Confirm Password"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && styles.btnPrimaryPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              accessibilityLabel="Sign Up"
              testID="sign-up-btn"
            >
              {loading ? (
                <ActivityIndicator color={C.btnText} />
              ) : (
                <Text style={styles.btnPrimaryText}>SIGN UP</Text>
              )}
            </Pressable>

            <OrDivider />

            <View style={styles.socialRow}>
              <SocialButton label="Google" onPress={() => socialSignIn('Google')}>
                <AntDesign name="google" size={26} color="#EA4335" />
              </SocialButton>
              <SocialButton label="Apple" onPress={() => socialSignIn('Apple')}>
                <Ionicons name="logo-apple" size={26} color={C.white} />
              </SocialButton>
              <SocialButton label="GitHub" onPress={() => socialSignIn('GitHub')}>
                <AntDesign name="github" size={26} color={C.white} />
              </SocialButton>
            </View>

            <Text style={styles.footerLinkRow}>
              Already have an account?{' '}
              <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                Sign In
              </Text>
            </Text>

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
    marginBottom: 28,
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
  btnPrimary: {
    width: '100%',
    backgroundColor: C.lime,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 28,
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
