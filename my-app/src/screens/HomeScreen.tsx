// Copyright (c) 2026 Jeshuaem Sepulveda. All rights reserved.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import NotesSection from '../components/NotesSection';
import CalculatorPanel from '../components/CalculatorPanel';
import AITutorPanel from '../components/AITutorPanel';
import ScanPanel from '../components/ScanPanel';
import AnswerBar from '../components/AnswerBar';
import BottomNav from '../components/BottomNav';
import { evaluateDisplay, sqrtDisplay } from '../lib/calculator';
import { askGeminiTutor, solveImageWithGemini } from '../lib/gemini';
import type { RootStackParamList } from '../navigation/types';
import type { ChatMessage } from '../types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const INITIAL_DISPLAY = '2x² − 44 = 0';
const INITIAL_ANSWER = '2x² − 44 = 0\nResult: x ≈ ±4.69\nx = √22';
const INITIAL_NOTES =
  'Let a=2, b=4x, c=−4...\nNeed to find discriminant first.';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function HomeScreen({ navigation }: Props) {
  const [display, setDisplay] = useState(INITIAL_DISPLAY);
  const [answer, setAnswer] = useState(INITIAL_ANSWER);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [notesVisible, setNotesVisible] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<string[]>([INITIAL_ANSWER]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [scanResult, setScanResult] = useState('');
  const [scanState, setScanState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [showAI, setShowAI] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanReady, setScanReady] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  const appendKey = useCallback((v: string) => {
    setDisplay((d) => {
      if (d === '0' || d === INITIAL_DISPLAY) return v;
      return d + v;
    });
  }, []);

  const solveToAnswerBar = useCallback(
    async (expr: string) => {
      setAnswerLoading(true);
      try {
        const result = await askGeminiTutor(`Solve step by step:\n${expr}`, {
          display: expr,
          notes,
        });
        setAnswer(result);
        setHistory((h) => [result, ...h.slice(0, 19)]);
      } catch (e) {
        const err = e instanceof Error ? e.message : 'Could not solve.';
        setAnswer(err);
      } finally {
        setAnswerLoading(false);
      }
    },
    [notes]
  );

  const sendAI = useCallback(
    async (override?: string) => {
      const q = (override ?? aiInput).trim();
      if (!q || aiLoading) return;
      setAiInput('');

      const loadId = uid();
      setMessages((m) => [
        ...m,
        { id: uid(), role: 'user', text: q },
        { id: loadId, role: 'loading', text: 'Thinking…' },
      ]);
      setAiLoading(true);

      try {
        const result = await askGeminiTutor(q, { display, notes });
        setMessages((m) =>
          m.map((msg) =>
            msg.id === loadId ? { ...msg, role: 'assistant', text: result } : msg
          )
        );
      } catch (e) {
        const err = e instanceof Error ? e.message : 'Error connecting to AI.';
        setMessages((m) =>
          m.map((msg) =>
            msg.id === loadId ? { ...msg, role: 'assistant', text: err } : msg
          )
        );
      } finally {
        setAiLoading(false);
      }
    },
    [aiInput, aiLoading, display, notes]
  );

  const onEvaluate = useCallback(() => {
    setDisplay((d) => {
      if (d.includes('=') || d.includes('x')) {
        void solveToAnswerBar(d);
        return d;
      }
      const result = evaluateDisplay(d);
      const line = `${d} = ${result}`;
      setAnswer(line);
      setHistory((h) => [line, ...h.slice(0, 19)]);
      return result;
    });
  }, [solveToAnswerBar]);

  const onSqrt = useCallback(() => {
    setDisplay((d) => {
      if (d.includes('=') || d.includes('x')) {
        void solveToAnswerBar(d);
        return d;
      }
      return sqrtDisplay(d);
    });
  }, [solveToAnswerBar]);

  const pickImage = useCallback(async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera or photo access.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8 });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);
    setImageBase64(asset.base64 ?? null);
    setImageMime(asset.mimeType ?? 'image/jpeg');
    setScanState('idle');
    setScanResult('');
  }, []);

  const scanOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scanOpenTimer.current) clearTimeout(scanOpenTimer.current);
    };
  }, []);

  const openScanModal = useCallback(() => {
    setActiveNav('Camera');
    setPreviewUri(null);
    setImageBase64(null);
    setScanState('idle');
    setScanResult('');
    setScanReady(false);
    setShowCamera(true);

    if (scanOpenTimer.current) clearTimeout(scanOpenTimer.current);
    scanOpenTimer.current = setTimeout(() => setScanReady(true), 400);
  }, []);

  const closeScanModal = useCallback(() => {
    if (scanOpenTimer.current) {
      clearTimeout(scanOpenTimer.current);
      scanOpenTimer.current = null;
    }
    setScanReady(false);
    setShowCamera(false);
    setActiveNav('Home');
  }, []);

  const clearImage = useCallback(() => {
    setPreviewUri(null);
    setImageBase64(null);
    setScanState('idle');
    setScanResult('');
  }, []);

  const solveImage = useCallback(async () => {
    if (!imageBase64) return;
    setScanState('loading');
    setScanResult('🔍 Reading your problem…');

    try {
      const result = await solveImageWithGemini(imageBase64, imageMime);
      setScanResult(result);
      setScanState('done');
      setAnswer(result);
      setHistory((h) => [result, ...h.slice(0, 19)]);
    } catch (e) {
      setScanResult(e instanceof Error ? e.message : 'Error connecting to AI.');
      setScanState('error');
    }
  }, [imageBase64, imageMime]);

  const handleLogout = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [navigation]);

  const openSettings = useCallback(() => {
    Alert.alert('Settings', 'Choose an option', [
      { text: 'Log out', onPress: handleLogout, style: 'destructive' },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => setActiveNav('Home'),
      },
    ]);
  }, [handleLogout]);

  const navItems = useMemo(
    () => [
      {
        icon: <Ionicons name="home-outline" size={26} color={colors.lime} />,
        label: 'Home',
        active: activeNav === 'Home',
        onPress: () => {
          setActiveNav('Home');
          setShowAI(false);
          setShowArchive(false);
          closeScanModal();
        },
      },
      {
        icon: <Ionicons name="archive-outline" size={26} color={colors.lime} />,
        label: 'Archive',
        active: activeNav === 'Archive',
        onPress: () => {
          setActiveNav('Archive');
          setShowArchive(true);
        },
      },
      {
        icon: <Ionicons name="camera-outline" size={26} color={colors.lime} />,
        label: 'Camera',
        active: activeNav === 'Camera',
        onPress: openScanModal,
      },
      {
        icon: <Ionicons name="person-outline" size={26} color={colors.lime} />,
        label: 'Profile',
        active: activeNav === 'Profile',
        onPress: () => {
          setActiveNav('Profile');
          navigation.navigate('UserSaveInfo', {
            calculations: history.map((h, i) => ({
              expression: `History ${i + 1}`,
              result: h.split('\n')[0] ?? h,
            })),
            latestDisplay: display,
          });
        },
      },
      {
        icon: <Ionicons name="settings-outline" size={26} color={colors.lime} />,
        label: 'Settings',
        active: activeNav === 'Settings',
        onPress: () => {
          setActiveNav('Settings');
          openSettings();
        },
      },
    ],
    [activeNav, closeScanModal, display, history, navigation, openScanModal, openSettings]
  );

  return (
    <View style={styles.root}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>StudyCalc AI</Text>
            <View style={styles.headerSubRow}>
              <View style={styles.syncDot} />
              <Text style={styles.headerSub}>Last Synced: just now</Text>
            </View>
          </View>

          <NotesSection
            notes={notes}
            notesVisible={notesVisible}
            onNotesChange={setNotes}
            onToggleNotes={() => setNotesVisible((v) => !v)}
            onTutorMode={() => setShowAI(true)}
            onAskHelp={() => {
              setShowAI(true);
              void sendAI(`Can you help me with this problem? My notes say: ${notes}`);
            }}
          />

          <View style={styles.calcSection}>
            <Text style={styles.calcTitle}>Calculator & AI</Text>

            <CalculatorPanel
              display={display}
              onAppend={appendKey}
              onDelete={() => setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : '0'))}
              onClear={() => {
                setDisplay('0');
                setAnswer('');
              }}
              onEvaluate={onEvaluate}
              onSqrt={onSqrt}
              onOpenAI={() => setShowAI(true)}
            />

            <AnswerBar answer={answer} loading={answerLoading} />
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.navSafe}>
          <BottomNav items={navItems} />
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal visible={showAI} animationType="slide" transparent onRequestClose={() => setShowAI(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Tutor</Text>
              <Pressable onPress={() => setShowAI(false)}>
                <Ionicons name="close" size={24} color={colors.lime} />
              </Pressable>
            </View>
            <AITutorPanel
              messages={messages}
              input={aiInput}
              loading={aiLoading}
              onInputChange={setAiInput}
              onSend={() => void sendAI()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showArchive}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowArchive(false);
          setActiveNav('Home');
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>History</Text>
              <Pressable
                onPress={() => {
                  setShowArchive(false);
                  setActiveNav('Home');
                }}
              >
                <Ionicons name="close" size={24} color={colors.lime} />
              </Pressable>
            </View>
            <ScrollView style={styles.archiveScroll}>
              {history.length === 0 ? (
                <Text style={styles.archiveEmpty}>No history yet.</Text>
              ) : (
                history.map((item, i) => (
                  <Pressable
                    key={i}
                    style={styles.archiveItem}
                    onPress={() => {
                      setAnswer(item);
                      setShowArchive(false);
                    }}
                  >
                    <Text style={styles.archiveText} numberOfLines={4}>
                      {item}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

      <Modal
        visible={showCamera}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={closeScanModal}
      >
        <View style={styles.scanOverlay}>
          <Pressable style={styles.scanBackdrop} onPress={closeScanModal} />
          <View
            style={styles.scanSheet}
            pointerEvents={scanReady ? 'auto' : 'none'}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Problem</Text>
              <Pressable onPress={closeScanModal} hitSlop={12}>
                <Ionicons name="close" size={24} color={colors.lime} />
              </Pressable>
            </View>
            <ScanPanel
              previewUri={previewUri}
              result={scanResult}
              resultState={scanState}
              actionsEnabled={scanReady}
              onPickImage={() => void pickImage(false)}
              onTakePhoto={() => void pickImage(true)}
              onClear={clearImage}
              onSolve={() => void solveImage()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 12 },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.lime,
    letterSpacing: -0.4,
  },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  syncDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  headerSub: { fontSize: 11, color: colors.textMuted },
  calcSection: {
    backgroundColor: colors.section,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textTitle,
    marginBottom: 10,
  },
  navSafe: {
    backgroundColor: colors.bg,
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scanBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.section,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scanSheet: {
    backgroundColor: colors.section,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
    minHeight: 340,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textTitle,
  },
  archiveScroll: { maxHeight: 360 },
  archiveEmpty: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  archiveItem: {
    backgroundColor: colors.display,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  archiveText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
