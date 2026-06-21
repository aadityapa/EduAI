import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useAuth } from '../src/auth/AuthContext';
import { PrimaryButton, tokens } from '../src/components/ui';

type Portal = 'student' | 'teacher' | 'parent';

const PORTALS: { id: Portal; label: string; email: string }[] = [
  { id: 'student', label: 'Student', email: 'student@demo.eduai.in' },
  { id: 'teacher', label: 'Teacher', email: 'teacher@demo.eduai.in' },
  { id: 'parent', label: 'Parent', email: 'parent@demo.eduai.in' },
];

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [portal, setPortal] = useState<Portal>('student');
  const [email, setEmail] = useState('student@demo.eduai.in');
  const [password, setPassword] = useState('Demo1234!');
  const [loading, setLoading] = useState(false);

  function selectPortal(p: Portal) {
    setPortal(p);
    setEmail(PORTALS.find((x) => x.id === p)!.email);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      const route = await signIn(email, password);
      if (route.includes('student')) router.replace('/(student)');
      else if (route.includes('parent')) router.replace('/(parent)');
      else if (route.includes('teacher')) router.replace('/(teacher)');
      else Alert.alert('Admin login', 'Use Admin Portal at http://localhost:3002');
    } catch (e) {
      Alert.alert('Login failed', e instanceof Error ? e.message : 'Start backend on :3001');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>E</Text>
          </View>
          <Text style={styles.title}>EduAI</Text>
          <Text style={styles.subtitle}>Student · Teacher · Parent</Text>
        </View>

        <View style={styles.portalRow}>
          {PORTALS.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.pill, portal === p.id && styles.pillActive]}
              onPress={() => selectPortal(p.id)}
            >
              <Text style={[styles.pillText, portal === p.id && styles.pillTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
          <PrimaryButton label="Sign In" onPress={handleLogin} loading={loading} />
        </View>

        <Text style={styles.hint}>
          API {Constants.expoConfig?.extra?.identityUrl ?? 'http://localhost:3001'} · Expo LAN ready
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.colors.background },
  scroll: { flexGrow: 1, padding: tokens.spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: tokens.spacing.lg },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  title: { fontSize: tokens.fontSize.xxl, fontWeight: '800', color: tokens.colors.primaryBright },
  subtitle: { fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, marginTop: 4 },
  portalRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: tokens.spacing.lg,
    backgroundColor: '#e8eaed',
    padding: 4,
    borderRadius: tokens.radius.full,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pillActive: { backgroundColor: tokens.colors.primaryBright },
  pillText: { fontWeight: '600', color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm },
  pillTextActive: { color: '#fff' },
  form: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
  },
  label: { fontSize: tokens.fontSize.sm, fontWeight: '600', marginBottom: 6, color: tokens.colors.text },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    padding: 14,
    marginBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
  },
  hint: { marginTop: tokens.spacing.lg, textAlign: 'center', color: tokens.colors.textMuted, fontSize: tokens.fontSize.xs },
});
