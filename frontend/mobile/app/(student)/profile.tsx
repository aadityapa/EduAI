import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function ProfileScreen() {
  const { tokens, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <Screen>
      <StitchScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{tokens?.user.firstName?.charAt(0) ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.name}>
              {tokens?.user.firstName} {tokens?.user.lastName}
            </Text>
            <Text style={styles.meta}>{tokens?.user.email}</Text>
            <Text style={styles.role}>{tokens?.user.roles.join(' · ')}</Text>
          </View>
        </View>

        <StitchCard>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Language</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuItem} onPress={handleSignOut}>
            <Text style={[styles.menuText, styles.signOut]}>Sign Out</Text>
          </Pressable>
        </StitchCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: tokens.spacing.lg },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: tokens.colors.primary },
  name: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
  role: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.xs },
  menuItem: { paddingVertical: 12 },
  menuText: { fontSize: tokens.fontSize.sm, fontWeight: '600', color: tokens.colors.text },
  signOut: { color: tokens.colors.error },
  divider: { height: 1, backgroundColor: tokens.colors.border },
});
