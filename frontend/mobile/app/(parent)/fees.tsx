import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchFees } from '../../src/api/services';
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

type FeeRow = { description?: string; amount?: number; status?: string };

export default function FeesScreen() {
  const { tokens: authTokens } = useAuth();
  const fetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchFees(authTokens.accessToken) as Promise<FeeRow[]>;
  }, [authTokens]);

  const { data, loading, refreshing, error, offline, reload } = useCachedResource<FeeRow[]>(
    authTokens ? 'parent_fees' : null,
    authTokens ? fetcher : null,
  );

  const fees = data ?? [];

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading fees…" />
      </Screen>
    );
  }

  if (error && fees.length === 0) {
    return (
      <Screen>
        <ErrorState title="Couldn't load fees" body={error} onRetry={() => void reload()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Fees" />
      <FlatList
        data={fees}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={<OfflineBanner visible={offline} />}
        ListEmptyComponent={
          <View style={styles.paidBanner}>
            <Text style={styles.paidTitle}>All clear</Text>
            <Text style={styles.paidMeta}>No outstanding fees from ERP right now.</Text>
            <EmptyState title="No fee records" body="Pull to refresh when the school posts invoices." />
          </View>
        }
        renderItem={({ item }) => {
          const paid = item.status?.toLowerCase() === 'paid';
          return (
            <StitchCard style={paid ? styles.paidCard : undefined}>
              <Text style={styles.title}>{item.description ?? 'Fee'}</Text>
              <Text style={styles.meta}>
                ₹{item.amount ?? 0} · {item.status ?? '—'}
              </Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  paidBanner: {
    backgroundColor: tokens.colors.successContainer,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.success + '55',
    gap: tokens.spacing.sm,
  },
  paidTitle: { fontWeight: '700', color: tokens.colors.onSuccessContainer },
  paidMeta: { color: tokens.colors.onSuccessContainer, fontSize: tokens.fontSize.sm },
  paidCard: { backgroundColor: tokens.colors.successContainer + '55', borderColor: tokens.colors.success + '44' },
  title: { fontWeight: '700', marginBottom: 4, color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm },
});
