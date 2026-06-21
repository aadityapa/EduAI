import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification, fetchHub } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { Card, KpiCard, PortalBadge, PrimaryButton, Screen, tokens } from '../../src/components/ui';
import { registerForPushNotifications } from '../../src/notifications/setup';

export default function StudentHome() {
  const { tokens: auth } = useAuth();
  const [hub, setHub] = useState<Record<string, unknown> | null>(null);
  const [xp, setXp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const token = auth.accessToken;

    async function load() {
      try {
        const [hubData, xpData] = await Promise.all([fetchHub(token), fetchGamification(token)]);
        setHub(hubData);
        setXp(xpData);
        await cacheSet('student_hub', hubData);
        await cacheSet('student_xp', xpData);
        setOffline(false);
        await registerForPushNotifications();
      } catch {
        setHub(await cacheGet('student_hub'));
        setXp(await cacheGet('student_xp'));
        setOffline(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [auth]);

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator color={tokens.colors.primary} size="large" />
      </Screen>
    );
  }

  const streak = (xp as { currentStreak?: number })?.currentStreak ?? 0;
  const level = (xp as { currentLevel?: number })?.currentLevel ?? 1;
  const totalXp = (xp as { totalXp?: number })?.totalXp ?? 0;
  const courses = (hub as { enrollments?: unknown[] })?.enrollments?.length ?? 0;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        {offline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Offline — cached data</Text>
          </View>
        )}
        <PortalBadge label="Student Portal" color={tokens.colors.primary} />
        <Text style={styles.greeting}>Hello, {auth?.user.firstName}! 👋</Text>

        <View style={styles.kpiRow}>
          <KpiCard label="Streak" value={`${streak}d`} accent={tokens.colors.warning} />
          <KpiCard label="Level" value={level} accent={tokens.colors.primary} />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard label="XP" value={totalXp} accent={tokens.colors.secondary} />
          <KpiCard label="Courses" value={courses} accent={tokens.colors.success} />
        </View>

        <Card>
          <Text style={styles.cardTitle}>Today&apos;s focus</Text>
          <Text style={styles.cardBody}>Complete 1 lesson and 1 quiz to keep your streak.</Text>
        </Card>

        <PrimaryButton label="Continue Learning" onPress={() => router.push('/(student)/courses')} />
        <PrimaryButton
          label="Ask AI Tutor"
          variant="outline"
          onPress={() => router.push('/(student)/tutor')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: tokens.spacing.md },
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.sm,
  },
  offlineText: { color: '#92400E', fontSize: tokens.fontSize.xs, textAlign: 'center' },
  greeting: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.text, marginBottom: tokens.spacing.md },
  kpiRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm },
  cardTitle: { fontSize: tokens.fontSize.md, fontWeight: '600', marginBottom: 6 },
  cardBody: { color: tokens.colors.textMuted, lineHeight: 20 },
});
