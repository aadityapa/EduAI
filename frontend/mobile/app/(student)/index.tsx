import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification, fetchHub } from '../../src/api/services';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import {
  AiHero,
  BentoTile,
  CourseCarousel,
  mapEnrollmentsToCourses,
  MetricChip,
  MobileHeader,
  SectionHeader,
} from '../../src/components/stitch';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { registerForPushNotifications } from '../../src/notifications/setup';

export default function StudentHome() {
  const { tokens: auth } = useAuth();
  const [hub, setHub] = useState<Record<string, unknown> | null>(null);
  const [xp, setXp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!auth) return;
      const token = auth.accessToken;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const [hubData, xpData] = await Promise.all([fetchHub(token), fetchGamification(token)]);
        setHub(hubData);
        setXp(xpData);
        await cacheSet('student_hub', hubData);
        await cacheSet('student_xp', xpData);
        setOffline(false);
        void registerForPushNotifications();
      } catch (e) {
        const cachedHub = await cacheGet<Record<string, unknown>>('student_hub');
        const cachedXp = await cacheGet<Record<string, unknown>>('student_xp');
        if (cachedHub || cachedXp) {
          setHub(cachedHub);
          setXp(cachedXp);
          setOffline(true);
        } else {
          setError(e instanceof Error ? e.message : 'Unable to load home');
          setOffline(true);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [auth],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading your dashboard…" />
      </Screen>
    );
  }

  if (error && !hub) {
    return (
      <Screen>
        <ErrorState title="Couldn't load home" body={error} onRetry={() => void load(true)} />
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void load(true),
        })}
      >
        <OfflineBanner visible={offline} />

        <View style={styles.metricRow}>
          <MetricChip icon="★" value={totalXp.toLocaleString()} label="Total XP" accent={tokens.colors.tertiary} />
          <MetricChip icon="🔥" value={`${streak} Day`} label="Streak" accent={tokens.colors.streak} />
        </View>

        <AiHero onPress={() => router.push('/(student)/tutor')} />

        <SectionHeader
          title="Active Courses"
          actionLabel="View All"
          onAction={() => router.push('/(student)/courses')}
        />
        {courses.length === 0 ? (
          <EmptyState
            title="No courses yet"
            body="Browse courses to enroll and start earning XP."
            actionLabel="Browse courses"
            onAction={() => router.push('/(student)/courses')}
          />
        ) : (
          <CourseCarousel courses={courses} />
        )}

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
  scroll: { padding: tokens.spacing.md, paddingBottom: 100 },
  metricRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  bentoSection: { marginTop: tokens.spacing.lg },
  bentoRow: { flexDirection: 'row', gap: tokens.spacing.sm },
  examBento: {
    backgroundColor: tokens.colors.primaryBright,
  },
});
