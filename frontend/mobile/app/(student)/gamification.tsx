import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification } from '../../src/api/services';
import { MetricChip, StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import {
  ErrorState,
  LoadingState,
  OfflineBanner,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import { useCachedResource } from '../../src/hooks/useCachedResource';

export default function GamificationScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchGamification(authTokens.accessToken);
  }, [authTokens]);

  const { data: xp, loading, refreshing, error, offline, reload } = useCachedResource(
    authTokens ? 'student_xp' : null,
    authTokens ? fetcher : null,
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading rewards…" />
      </Screen>
    );
  }

  if (error && !xp) {
    return (
      <Screen>
        <ErrorState title="Couldn't load rewards" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  const streak = (xp as { currentStreak?: number })?.currentStreak ?? 0;
  const totalXp = (xp as { totalXp?: number })?.totalXp ?? 0;
  const level = (xp as { currentLevel?: number })?.currentLevel ?? 1;
  const rank = (xp as { classRank?: number })?.classRank ?? 4;

  return (
    <Screen>
      <StitchScreenHeader title="Rewards" />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        <View style={styles.metricRow}>
          <View style={styles.xpCard}>
            <Text style={styles.xpValue}>{totalXp.toLocaleString()}</Text>
            <Text style={styles.xpLabel}>XP</Text>
          </View>
          <View style={styles.streakCard}>
            <Text style={styles.streakValue}>{streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        <StitchCard>
          <Text style={styles.cardTitle}>Leaderboard</Text>
          <Text style={styles.cardBody}>You are #{rank} in your class</Text>
          <Text style={styles.level}>Level {level}</Text>
        </StitchCard>

        <View style={styles.metricRow}>
          <MetricChip icon="★" value={level} label="Level" accent={tokens.colors.primaryBright} />
          <MetricChip icon="🏆" value={`#${rank}`} label="Class rank" accent={tokens.colors.tertiary} />
        </View>

        <StitchCard>
          <Text style={styles.cardTitle}>Badges</Text>
          <Text style={styles.cardBody}>
            Complete quizzes and maintain your streak to unlock new badges.
          </Text>
        </StitchCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  metricRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  xpCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  xpValue: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.xp },
  xpLabel: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
  streakCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  streakValue: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.streak },
  streakLabel: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
  cardTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text, marginBottom: 6 },
  cardBody: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm, lineHeight: 20 },
  level: { marginTop: 8, fontWeight: '600', color: tokens.colors.primaryBright, fontSize: tokens.fontSize.sm },
});
