import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/auth/AuthContext';
import { useTheme, themeStyles } from '../src/theme/ThemeProvider';
import { useTranslation } from '../src/i18n/useTranslation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const theme = useTheme();
  const styles = themeStyles(theme);
  const t = useTranslation();
  const [email, setEmail] = useState('student@demo.eduai.in');
  const [password, setPassword] = useState('Demo1234!');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const route = await signIn(email, password);
      if (route.startsWith('student')) router.replace('/(student)');
      else if (route.startsWith('parent')) router.replace('/(parent)');
      else if (route.startsWith('teacher')) router.replace('/(teacher)');
      else Alert.alert('Login', 'Role not supported on mobile yet');
    } catch (e) {
      Alert.alert('Login failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={local.container}>
      <Text style={[local.title, styles.title]}>{theme.appName}</Text>
      <Text style={local.subtitle}>{t('auth.signIn', 'Sign in to continue learning')}</Text>
      <TextInput
        style={local.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={local.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={[local.button, styles.button]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={local.buttonText}>{t('auth.login', 'Sign In')}</Text>
        )}
      </Pressable>
      <Text style={local.hint}>Demo: *@demo.eduai.in / Demo1234!</Text>
    </View>
  );
}

const local = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: { borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  hint: { marginTop: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 },
});
