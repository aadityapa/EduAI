import { useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchCourses } from '../../src/api/services';
import { ProgressBar, StitchCard, StitchScreenHeader } from '../../src/components/stitch';
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

interface Course {
  id: string;
  title: string;
  classLevel: number;
  subject?: { name: string };
}

export default function CoursesScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchCourses(authTokens.accessToken) as Promise<Course[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<Course[]>(
    authTokens ? 'courses' : null,
    authTokens ? fetcher : null,
  );

  const courses = data ?? [];

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading courses…" />
      </Screen>
    );
  }

  if (error && courses.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load courses" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Courses" />
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={<OfflineBanner visible={offline} />}
        ListEmptyComponent={
          <EmptyState
            title="No courses available"
            body="Courses from your board and class will appear here."
            actionLabel="Retry"
            onAction={() => void reload()}
          />
        }
        renderItem={({ item, index }) => {
          const progress = [75, 42, 90, 55][index % 4];
          const accent = [tokens.colors.primaryBright, tokens.colors.secondary, tokens.colors.tertiary][
            index % 3
          ];
          return (
            <StitchCard>
              <Text style={styles.title}>
                {item.subject?.name ?? 'Subject'} · Class {item.classLevel}
              </Text>
              <Text style={styles.subtitle}>{item.title}</Text>
              <ProgressBar progress={progress} color={accent} />
              <Text style={styles.pct}>{progress}% complete</Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  title: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  subtitle: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
  pct: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
});
