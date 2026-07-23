import { useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchParentChildren } from '../../src/api/services';
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

export default function ChildrenScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchParentChildren(authTokens.accessToken) as Promise<unknown[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<unknown[]>(
    authTokens ? 'parent_children' : null,
    authTokens ? fetcher : null,
  );

  const children = data ?? [];

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading children…" />
      </Screen>
    );
  }

  if (error && children.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load children" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Children" />
      <FlatList
        data={children}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={<OfflineBanner visible={offline} />}
        ListEmptyComponent={
          <EmptyState title="No linked children" body="Link a student account to see details here." />
        }
        renderItem={({ item }) => {
          const c = item as { student?: { firstName?: string; lastName?: string; email?: string } };
          return (
            <StitchCard>
              <Text style={styles.name}>
                {c.student?.firstName} {c.student?.lastName}
              </Text>
              <Text style={styles.email}>{c.student?.email}</Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  name: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  email: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
});
