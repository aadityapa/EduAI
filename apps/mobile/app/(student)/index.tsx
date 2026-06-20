import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification, fetchHub } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { useTheme } from '../../src/theme/ThemeProvider';
import { registerForPushNotifications, scheduleStudyReminder } from '../../src/notifications/setup';

export default function StudentHome() {
  const { tokens } = useAuth();
  const theme = useTheme();
  const [hub, setHub] = useState<Record<string, unknown> | null>(null);
  const [xp, setXp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!tokens) return;
    const token = tokens.accessToken;

    async function load() {
      try {
        const [hubData, xpData] = await Promise.all([
          fetchHub(token),
          fetchGamification(token),
        ]);
        setHub(hubData);
        setXp(xpData);
        await cacheSet('student_hub', hubData);
        await cacheSet('student_xp', xpData);
        setOffline(false);
        await registerForPushNotifications();
      } catch {
        const cachedHub = await cacheGet<Record<string, unknown>>('student_hub');
        const cachedXp = await cacheGet<Record<string, unknown>>('student_xp');
        setHub(cachedHub);
        setXp(cachedXp);
        setOffline(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tokens]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline mode — showing cached data</Text>
        </View>
      )}
      <Text style={[styles.greeting, { color: theme.primaryColor }]}>
        Hello, {tokens?.user.firstName}!
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learning Hub</Text>
        <Text style={styles.cardBody}>
          Streak: {(xp as { currentStreak?: number })?.currentStreak ?? 0} days
        </Text>
        <Text style={styles.cardBody}>
          Level: {(xp as { currentLevel?: number })?.currentLevel ?? 1} · XP:{' '}
          {(xp as { totalXp?: number })?.totalXp ?? 0}
        </Text>
        <Text style={styles.cardBody}>
          Courses in progress: {(hub as { enrollments?: unknown[] })?.enrollments?.length ?? 0}
        </Text>
      </View>
      <Pressable
        style={[styles.cta, { backgroundColor: theme.primaryColor }]}
        onPress={() => router.push('/(student)/courses')}
      >
        <Text style={styles.ctaText}>Continue Learning</Text>
      </Pressable>
      <Pressable
        style={[styles.ctaOutline, { borderColor: theme.accentColor }]}
        onPress={() => scheduleStudyReminder('Study time!', 'Review your lessons today', 60)}
      >
        <Text style={[styles.ctaOutlineText, { color: theme.accentColor }]}>
          Schedule Study Reminder
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  offlineBanner: { backgroundColor: '#fef3c7', padding: 8, borderRadius: 6, marginBottom: 12 },
  offlineText: { color: '#92400e', fontSize: 12, textAlign: 'center' },
  greeting: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cardBody: { color: '#64748b', marginBottom: 4 },
  cta: { borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  ctaText: { color: '#fff', fontWeight: '600' },
  ctaOutline: { borderWidth: 1, borderRadius: 8, padding: 16, alignItems: 'center' },
  ctaOutlineText: { fontWeight: '600' },
});
