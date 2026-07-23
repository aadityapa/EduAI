import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchParentChildren } from '../../src/api/services';
import { MetricChip, MobileHeader, StitchCard } from '../../src/components/stitch';
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

export default function ParentDashboard() {
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
        <LoadingState label="Loading family…" />
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
      <MobileHeader title="Parent Portal" subtitle={`${children.length} linked children`} />
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
      >
        <OfflineBanner visible={offline} />
        <View style={styles.metricRow}>
          <MetricChip icon="✓" value="—" label="Attendance" accent={tokens.colors.primaryBright} />
          <MetricChip icon="₹" value="Fees" label="See Fees tab" accent={tokens.colors.tertiary} />
        </View>
        {children.length === 0 ? (
          <EmptyState
            title="No linked children"
            body="Link a student from the web parent portal to see progress here."
          />
        ) : (
          children.map((child, i) => {
            const c = child as { student?: { firstName?: string; lastName?: string } };
            return (
              <StitchCard key={i}>
                <Text style={styles.name}>
                  {c.student?.firstName} {c.student?.lastName}
                </Text>
                <Text style={styles.meta}>Class linked · View attendance, fees, and reports</Text>
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
  metricRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  name: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
});
