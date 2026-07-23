import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { useTranslation } from '../../src/i18n/useTranslation';

type QuizRow = {
  id: string;
  title: string;
  due: string;
  status: 'New' | 'Done';
  score: string | null;
};

function quizzesFromHub(hub: Record<string, unknown> | null): QuizRow[] {
  const raw =
    (hub as { quizzes?: unknown[]; upcomingQuizzes?: unknown[] })?.quizzes ??
    (hub as { upcomingQuizzes?: unknown[] })?.upcomingQuizzes ??
    [];
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map((item, i) => {
    const q = item as {
      id?: string;
      title?: string;
      name?: string;
      dueAt?: string;
      status?: string;
      score?: number | string;
    };
    const done = (q.status ?? '').toLowerCase() === 'done' || q.score != null;
    return {
      id: q.id ?? String(i),
      title: q.title ?? q.name ?? `Quiz ${i + 1}`,
      due: q.dueAt
        ? `Due ${new Date(q.dueAt).toLocaleDateString()}`
        : done
          ? 'Completed'
          : 'Assigned',
      status: done ? 'Done' : 'New',
      score: q.score != null ? `${q.score}${typeof q.score === 'number' ? '%' : ''}` : null,
    };
  });
}

export default function QuizzesScreen() {
  const t = useTranslation();
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchHub(authTokens.accessToken);
  }, [authTokens]);

  const { data: hub, loading, refreshing, error, offline, reload } = useCachedResource(
    authTokens ? 'student_hub' : null,
    authTokens ? fetcher : null,
  );

  const quizzes = quizzesFromHub(hub);

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading quizzes…" />
      </Screen>
    );
  }

  if (error && !hub) {
    return (
      <Screen>
        <ErrorState title="Couldn't load quizzes" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title={t('quiz.title', 'Quizzes')} />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        {quizzes.length === 0 ? (
          <EmptyState
            title="No quizzes yet"
            body="Assigned quizzes appear here. Attempts sync with learning-service when available."
            actionLabel="Refresh"
            onAction={() => void reload()}
          />
        ) : (
          quizzes.map((q) => (
            <StitchCard key={q.id}>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={styles.title}>{q.title}</Text>
                  <Text style={styles.meta}>{q.due}</Text>
                </View>
                {q.status === 'New' ? (
                  <View style={styles.badgeNew}>
                    <Text style={styles.badgeNewText}>New</Text>
                  </View>
                ) : (
                  <Text style={styles.score}>{q.score}</Text>
                )}
              </View>
            </StitchCard>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flex: { flex: 1 },
  title: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  meta: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
  badgeNew: {
    backgroundColor: tokens.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: tokens.radius.full,
  },
  badgeNewText: {
    color: tokens.colors.primaryBright,
    fontSize: tokens.fontSize.xs,
    fontWeight: '700',
  },
  score: { color: tokens.colors.success, fontWeight: '700', fontSize: tokens.fontSize.sm },
});
