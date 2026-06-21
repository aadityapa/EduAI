import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchHub } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function HubScreen() {
  const { tokens: authTokens } = useAuth();
  const [hub, setHub] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchHub(authTokens.accessToken)
      .then(async (data) => {
        setHub(data);
        await cacheSet('student_hub', data);
      })
      .catch(async () => setHub(await cacheGet('student_hub')))
      .finally(() => setLoading(false));
  }, [authTokens]);

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator color={tokens.colors.primaryBright} />
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
      <ScrollView contentContainerStyle={styles.list}>
        <StitchCard>
          <Text style={styles.pathTitle}>
            {board} · Class {classLevel}
          </Text>
          <Text style={styles.pathSub}>{path}</Text>
        </StitchCard>

        <View style={styles.actionGrid}>
          <Pressable style={[styles.actionTile, styles.lessonsTile]} onPress={() => router.push('/(student)/courses')}>
            <Text style={styles.actionLabel}>Lessons</Text>
          </Pressable>
          <Pressable style={[styles.actionTile, styles.practiceTile]} onPress={() => router.push('/(student)/quizzes')}>
            <Text style={styles.actionLabel}>Practice</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Enrolled subjects</Text>
        {enrollments.length === 0 ? (
          <Text style={styles.empty}>No enrollments yet — browse courses to get started.</Text>
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
  center: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  pathTitle: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  pathSub: { fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, marginTop: 4 },
  actionGrid: { flexDirection: 'row', gap: tokens.spacing.sm, marginVertical: tokens.spacing.md },
  actionTile: {
    flex: 1,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  lessonsTile: { backgroundColor: tokens.colors.primaryBright + '18' },
  practiceTile: { backgroundColor: tokens.colors.secondary + '18' },
  actionLabel: { fontWeight: '700', fontSize: tokens.fontSize.sm, color: tokens.colors.text },
  sectionLabel: {
    fontSize: tokens.fontSize.sm,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: { color: tokens.colors.textMuted, textAlign: 'center', marginTop: 8 },
  enrollTitle: { fontWeight: '700', color: tokens.colors.text },
  enrollMeta: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
});
