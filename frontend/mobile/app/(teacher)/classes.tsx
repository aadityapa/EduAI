import { useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchTeacherClasses } from '../../src/api/services';
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

type ClassRow = {
  id?: string;
  name?: string;
  grade?: string | number;
  section?: string;
  studentCount?: number;
};

export default function ClassesScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchTeacherClasses(authTokens.accessToken) as Promise<ClassRow[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<ClassRow[]>(
    authTokens ? 'teacher_classes' : null,
    authTokens ? fetcher : null,
  );

  const classes = data ?? [];

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading classes…" />
      </Screen>
    );
  }

  if (error && classes.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load classes" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="My Classes" />
      <FlatList
        data={classes}
        keyExtractor={(item, i) => item.id ?? String(i)}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={<OfflineBanner visible={offline} />}
        ListEmptyComponent={
          <EmptyState title="No classes assigned" body="ERP /classes/mine will populate this list." />
        }
        renderItem={({ item }) => (
          <StitchCard>
            <Text style={styles.title}>{item.name ?? 'Class'}</Text>
            <Text style={styles.meta}>
              {[item.grade != null ? `Grade ${item.grade}` : null, item.section, item.studentCount != null ? `${item.studentCount} students` : null]
                .filter(Boolean)
                .join(' · ') || 'Assigned class'}
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
