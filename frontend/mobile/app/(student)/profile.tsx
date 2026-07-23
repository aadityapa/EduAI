import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';
import {
  cancelAllScheduledNotifications,
  registerForPushNotifications,
  scheduleStudyReminder,
} from '../../src/notifications/setup';
import { loadPushToken } from '../../src/auth/storage';

export default function ProfileScreen() {
  const { tokens: auth, signOut } = useAuth();
  const [pushBusy, setPushBusy] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  async function enableNotifications() {
    setPushBusy(true);
    try {
      const result = await registerForPushNotifications();
      if (result.status === 'denied') {
        Alert.alert('Permission needed', 'Enable notifications in system settings to get study reminders.');
        return;
      }
      await scheduleStudyReminder('EduAI study reminder', 'Time for a focused 15-minute session!', 10);
      const stored = result.token ?? (await loadPushToken());
      Alert.alert(
        'Notifications ready',
        result.status === 'missing-project-id'
          ? 'Local reminders work. Set EXPO_PUBLIC_EAS_PROJECT_ID for remote push.'
          : stored
            ? `Device registered. A demo reminder is scheduled.`
            : 'Local reminder scheduled.',
      );
    } catch (e) {
      Alert.alert('Push setup failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setPushBusy(false);
    }
  }

  async function clearReminders() {
    await cancelAllScheduledNotifications();
    Alert.alert('Cleared', 'Scheduled local notifications cancelled.');
  }

  return (
    <Screen>
      <StitchScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{auth?.user.firstName?.charAt(0) ?? '?'}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.name}>
              {auth?.user.firstName} {auth?.user.lastName}
            </Text>
            <Text style={styles.meta}>{auth?.user.email}</Text>
            <Text style={styles.role}>{auth?.user.roles.join(' · ')}</Text>
          </View>
        </View>

        <StitchCard>
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={() => void enableNotifications()}
            disabled={pushBusy}
            accessibilityRole="button"
          >
            <Text style={styles.menuText}>{pushBusy ? 'Enabling…' : 'Enable study reminders'}</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={() => void clearReminders()}
            accessibilityRole="button"
          >
            <Text style={styles.menuText}>Clear scheduled reminders</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={handleSignOut}
            accessibilityRole="button"
          >
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
  flex: { flex: 1 },
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
  menuItem: { minHeight: 44, justifyContent: 'center', paddingVertical: 12 },
  menuText: { fontSize: tokens.fontSize.sm, fontWeight: '600', color: tokens.colors.text },
  signOut: { color: tokens.colors.error },
  divider: { height: 1, backgroundColor: tokens.colors.border },
  pressed: { opacity: 0.7 },
});
