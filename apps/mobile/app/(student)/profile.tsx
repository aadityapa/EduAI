import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ProfileScreen() {
  const { tokens, signOut } = useAuth();
  const theme = useTheme();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: theme.primaryColor }]}>
        {tokens?.user.firstName} {tokens?.user.lastName}
      </Text>
      <Text style={styles.email}>{tokens?.user.email}</Text>
      <Text style={styles.role}>Role: {tokens?.user.roles.join(', ')}</Text>
      <Pressable style={[styles.button, { backgroundColor: theme.secondaryColor }]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  name: { fontSize: 22, fontWeight: '700' },
  email: { color: '#64748b', marginTop: 4 },
  role: { color: '#94a3b8', marginTop: 8, marginBottom: 24 },
  button: { borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
