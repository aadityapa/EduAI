import { useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchTeacherAssignments } from '../../src/api/services';
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

type Assignment = {
  id?: string;
  title?: string;
  status?: string;
  dueAt?: string;
  className?: string;
};

export default function AssignmentsScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchTeacherAssignments(authTokens.accessToken) as Promise<Assignment[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<Assignment[]>(
    authTokens ? 'teacher_assignments' : null,
    authTokens ? fetcher : null,
  );

  const assignments = data ?? [];

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading homework…" />
      </Screen>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load assignments" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Homework" />
      <FlatList
        data={assignments}
        keyExtractor={(item, i) => item.id ?? String(i)}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={<OfflineBanner visible={offline} />}
        ListEmptyComponent={
          <EmptyState
            title="No assignments yet"
            body="Publish homework via ERP — it will appear here for your classes."
          />
        }
        renderItem={({ item }) => (
          <StitchCard>
            <Text style={styles.title}>{item.title ?? 'Assignment'}</Text>
            <Text style={styles.meta}>
              {[item.className, item.status, item.dueAt ? `Due ${new Date(item.dueAt).toLocaleDateString()}` : null]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </StitchCard>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  title: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
});
