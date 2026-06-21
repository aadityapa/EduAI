import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchGamification } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { MetricChip, StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function GamificationScreen() {
  const { tokens: authTokens } = useAuth();
  const [xp, setXp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchGamification(authTokens.accessToken)
      .then(async (data) => {
        setXp(data);
        await cacheSet('student_xp', data);
      })
      .catch(async () => setXp(await cacheGet('student_xp')))
      .finally(() => setLoading(false));
  }, [authTokens]);

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator color={tokens.colors.primaryBright} />
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
      <ScrollView contentContainerStyle={styles.list}>
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
          <Text style={styles.cardBody}>Complete quizzes and maintain your streak to unlock new badges.</Text>
        </StitchCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
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
  xpValue: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.tertiary },
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
  streakValue: { fontSize: tokens.fontSize.xl, fontWeight: '700', color: tokens.colors.error },
  streakLabel: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
  cardTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text, marginBottom: 6 },
  cardBody: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm, lineHeight: 20 },
  level: { marginTop: 8, fontWeight: '600', color: tokens.colors.primaryBright, fontSize: tokens.fontSize.sm },
});
