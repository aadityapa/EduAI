import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchStudyPlans, generateStudyPlan } from '../../src/api/services';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  PrimaryButton,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import { useCachedResource } from '../../src/hooks/useCachedResource';

type PlanDay = { day?: string; focus?: string; tasks?: string[]; durationMinutes?: number };
type StudyPlan = {
  summary?: string;
  weeklyHours?: number;
  schedule?: PlanDay[];
  tips?: string[];
};

export default function PlannerScreen() {
  const { tokens: authTokens } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [localPlan, setLocalPlan] = useState<StudyPlan | null>(null);

  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchStudyPlans(authTokens.accessToken);
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<unknown[]>(
    authTokens ? 'study_plans' : null,
    authTokens ? fetcher : null,
  );

  const saved = data ?? [];
  const fromSaved = saved[0] as { plan?: StudyPlan } | undefined;
  const plan = localPlan ?? fromSaved?.plan ?? null;

  async function onGenerate() {
    if (!authTokens) return;
    setGenerating(true);
    try {
      const res = await generateStudyPlan(authTokens.accessToken, {
        subjects: ['Mathematics', 'Science'],
        goals: 'Prepare for mid-term exams',
        availableHoursPerWeek: 10,
      });
      setLocalPlan((res.plan as StudyPlan) ?? null);
      await reload();
    } catch {
      // keep cached / local
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading planner…" />
      </Screen>
    );
  }

  if (error && !plan && saved.length === 0) {
    return (
      <Screen>
        <StitchScreenHeader title="Study Planner" />
        <ErrorState title="Couldn't load plans" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  const schedule = plan?.schedule?.length
    ? plan.schedule
    : [
        { day: 'Today', focus: 'Complete Chapter 4', tasks: ['Read lesson', 'Practice quiz'], durationMinutes: 45 },
        { day: 'Tomorrow', focus: 'Science MCQ', tasks: ['15 min AI review'], durationMinutes: 30 },
      ];

  return (
    <Screen>
      <StitchScreenHeader title="Study Planner" />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        <View style={styles.todayBanner}>
          <Text style={styles.todayTitle}>{plan?.summary ?? "Today's Plan"}</Text>
          <Text style={styles.todayBody}>
            {plan?.weeklyHours
              ? `${plan.weeklyHours} hrs / week recommended`
              : '2 lessons · 1 quiz · 15 min AI review'}
          </Text>
        </View>

        {schedule.map((day, i) => (
          <StitchCard key={`${day.day ?? i}`}>
            <View style={styles.taskRow}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: [
                      tokens.colors.primaryBright,
                      tokens.colors.tertiary,
                      tokens.colors.success,
                    ][i % 3],
                  },
                ]}
              />
              <View style={styles.flex}>
                <Text style={styles.taskLabel}>{day.focus ?? day.day ?? `Task ${i + 1}`}</Text>
                {day.tasks?.length ? (
                  <Text style={styles.taskMeta}>{day.tasks.join(' · ')}</Text>
                ) : null}
              </View>
            </View>
          </StitchCard>
        ))}

        {!plan && saved.length === 0 ? (
          <EmptyState
            title="No AI plan yet"
            body="Generate a personalized weekly study plan."
          />
        ) : null}

        <PrimaryButton
          label={generating ? 'Generating…' : 'Generate AI plan'}
          onPress={() => void onGenerate()}
          loading={generating}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  todayBanner: {
    backgroundColor: tokens.colors.primaryContainer,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  todayTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  todayBody: { fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, marginTop: 4 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  flex: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  taskLabel: { fontSize: tokens.fontSize.sm, fontWeight: '600', color: tokens.colors.text },
  taskMeta: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
});
