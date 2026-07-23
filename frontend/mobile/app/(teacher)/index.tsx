import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchTeacherDashboard } from '../../src/api/services';
import { MobileHeader, StitchCard } from '../../src/components/stitch';
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

export default function TeacherDashboard() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchTeacherDashboard(authTokens.accessToken);
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource(
    authTokens ? 'teacher_dashboard' : null,
    authTokens ? fetcher : null,
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading dashboard…" />
      </Screen>
    );
  }

  if (error && !data) {
    return (
      <Screen>
        <ErrorState title="Couldn't load dashboard" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  const classes = (data?.classes as unknown[]) ?? [];

  return (
    <Screen>
      <MobileHeader title="Teacher Portal" subtitle={`${classes.length} classes assigned`} />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        <View style={styles.aiPromo}>
          <Text style={styles.aiPromoTitle}>AI Question Generator</Text>
          <Text style={styles.aiPromoBody}>Create quizzes in seconds</Text>
        </View>
        <StitchCard>
          <Text style={styles.cardLabel}>TODAY&apos;S SCHEDULE</Text>
          <Text style={styles.cardTitle}>Grade 8 Science · 10:00 AM</Text>
          <Text style={styles.cardBody}>
            Pending assignments: {(data?.pendingAssignments as number) ?? 0}
          </Text>
          <Text style={styles.cardBody}>Students: {(data?.totalStudents as number) ?? 0}</Text>
        </StitchCard>
        {classes.length === 0 ? (
          <EmptyState title="No classes yet" body="Assigned classes from ERP will show here." />
        ) : (
          classes.slice(0, 5).map((raw, i) => {
            const c = raw as { id?: string; name?: string; grade?: string | number };
            return (
              <StitchCard key={c.id ?? String(i)}>
                <Text style={styles.cardTitle}>{c.name ?? `Class ${i + 1}`}</Text>
                <Text style={styles.cardBody}>{c.grade != null ? `Grade ${c.grade}` : 'Assigned'}</Text>
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
  aiPromo: {
    backgroundColor: tokens.colors.tertiary + '18',
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.tertiary + '33',
    marginBottom: tokens.spacing.md,
  },
  aiPromoTitle: { fontWeight: '700', color: tokens.colors.tertiary, fontSize: tokens.fontSize.md },
  aiPromoBody: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
  cardLabel: {
    fontSize: tokens.fontSize.xs,
    color: tokens.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text, marginBottom: 8 },
  cardBody: { color: tokens.colors.textMuted, marginBottom: 4, fontSize: tokens.fontSize.sm },
});
