import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification, fetchHub } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { Screen, tokens } from '../../src/components/ui';
import {
  AiHero,
  BentoTile,
  CourseCarousel,
  mapEnrollmentsToCourses,
  MetricChip,
  MobileHeader,
  SectionHeader,
} from '../../src/components/stitch';
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
        <ActivityIndicator color={tokens.colors.primaryBright} size="large" />
      </Screen>
    );
  }

  const streak = (xp as { currentStreak?: number })?.currentStreak ?? 0;
  const totalXp = (xp as { totalXp?: number })?.totalXp ?? 0;
  const enrollments = (hub as { enrollments?: unknown[] })?.enrollments ?? [];
  const courses = mapEnrollmentsToCourses(enrollments);
  const firstName = auth?.user.firstName ?? 'Student';

  return (
    <Screen>
      <MobileHeader
        title="EduAI Portal"
        subtitle={`Good morning, ${firstName}!`}
        onSettings={() => router.push('/(student)/profile')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {offline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Offline — showing cached data</Text>
          </View>
        )}

        <View style={styles.metricRow}>
          <MetricChip icon="★" value={totalXp.toLocaleString()} label="Total XP" accent={tokens.colors.tertiary} />
          <MetricChip icon="🔥" value={`${streak} Day`} label="Streak" accent={tokens.colors.error} />
        </View>

        <AiHero onPress={() => router.push('/(student)/tutor')} />

        <SectionHeader
          title="Active Courses"
          actionLabel="View All"
          onAction={() => router.push('/(student)/courses')}
        />
        <CourseCarousel courses={courses} />

        <View style={styles.bentoSection}>
          <BentoTile
            wide
            title="Upcoming Exam"
            subtitle="Check planner for your schedule"
            icon="📅"
            style={styles.examBento}
            onPress={() => router.push('/(student)/planner')}
          />
          <View style={styles.bentoRow}>
            <BentoTile
              title="Social Hub"
              subtitle="Class updates"
              icon="💬"
              onPress={() => router.push('/(student)/hub')}
            />
            <BentoTile
              title="Rewards"
              subtitle="View XP & badges"
              icon="🏆"
              onPress={() => router.push('/(student)/gamification')}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: tokens.spacing.md, paddingBottom: 100 },
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.sm,
  },
  offlineText: { color: '#92400E', fontSize: tokens.fontSize.xs, textAlign: 'center' },
  metricRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  bentoSection: { marginTop: tokens.spacing.lg },
  bentoRow: { flexDirection: 'row', gap: tokens.spacing.sm },
  examBento: {
    backgroundColor: tokens.colors.primaryBright,
  },
});
