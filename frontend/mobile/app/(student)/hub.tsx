import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchHub } from '../../src/api/services';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import { useCachedResource } from '../../src/hooks/useCachedResource';

export default function HubScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchHub(authTokens.accessToken);
  }, [authTokens]);

  const { data: hub, loading, refreshing, error, offline, reload } = useCachedResource(
    authTokens ? 'student_hub' : null,
    authTokens ? fetcher : null,
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading hub…" />
      </Screen>
    );
  }

  if (error && !hub) {
    return (
      <Screen>
        <ErrorState title="Couldn't load hub" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  const board = (hub as { board?: string })?.board ?? 'CBSE';
  const classLevel = (hub as { classLevel?: number })?.classLevel ?? 8;
  const path = (hub as { currentPath?: string })?.currentPath ?? 'Mathematics → Algebra';
  const enrollments = (hub as { enrollments?: unknown[] })?.enrollments ?? [];

  return (
    <Screen>
      <StitchScreenHeader title="Learning Hub" />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        <StitchCard>
          <Text style={styles.pathTitle}>
            {board} · Class {classLevel}
          </Text>
          <Text style={styles.pathSub}>{path}</Text>
        </StitchCard>

        <View style={styles.actionGrid}>
          <Pressable
            style={({ pressed }) => [styles.actionTile, styles.lessonsTile, pressed && styles.pressed]}
            onPress={() => router.push('/(student)/courses')}
            accessibilityRole="button"
          >
            <Text style={styles.actionLabel}>Lessons</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionTile, styles.practiceTile, pressed && styles.pressed]}
            onPress={() => router.push('/(student)/quizzes')}
            accessibilityRole="button"
          >
            <Text style={styles.actionLabel}>Practice</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Enrolled subjects</Text>
        {enrollments.length === 0 ? (
          <EmptyState
            title="No enrollments yet"
            body="Browse courses to get started."
            actionLabel="Browse courses"
            onAction={() => router.push('/(student)/courses')}
          />
        ) : (
          enrollments.map((raw, i) => {
            const e = raw as { id?: string; course?: { title?: string; subject?: { name?: string } } };
            const label = e.course?.subject?.name ?? e.course?.title ?? `Subject ${i + 1}`;
            return (
              <StitchCard key={e.id ?? String(i)}>
                <Text style={styles.enrollTitle}>{label}</Text>
                <Text style={styles.enrollMeta}>Tap courses for lessons and progress</Text>
              </StitchCard>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  pathTitle: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  pathSub: { fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, marginTop: 4 },
  actionGrid: { flexDirection: 'row', gap: tokens.spacing.sm, marginVertical: tokens.spacing.md },
  actionTile: {
    flex: 1,
    borderRadius: tokens.radius.md,
    minHeight: 56,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonsTile: { backgroundColor: tokens.colors.primaryBright + '18' },
  practiceTile: { backgroundColor: tokens.colors.secondary + '18' },
  actionLabel: { fontWeight: '700', fontSize: tokens.fontSize.sm, color: tokens.colors.text },
  pressed: { opacity: 0.85 },
  sectionLabel: {
    fontSize: tokens.fontSize.sm,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  enrollTitle: { fontWeight: '700', color: tokens.colors.text },
  enrollMeta: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
});
