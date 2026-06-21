import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchFees } from '../../src/api/services';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function FeesScreen() {
  const { tokens: authTokens } = useAuth();
  const [fees, setFees] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchFees(authTokens.accessToken)
      .then(setFees)
      .finally(() => setLoading(false));
  }, [authTokens]);

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator color={tokens.colors.primaryBright} />
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
        ListEmptyComponent={
          <View style={styles.paidBanner}>
            <Text style={styles.paidTitle}>Term 2 — Paid</Text>
            <Text style={styles.paidMeta}>Receipt #EDU-2026-042</Text>
          </View>
        }
        renderItem={({ item }) => {
          const f = item as { description?: string; amount?: number; status?: string };
          const paid = f.status?.toLowerCase() === 'paid';
          return (
            <StitchCard style={paid ? styles.paidCard : undefined}>
              <Text style={styles.title}>{f.description ?? 'Fee'}</Text>
              <Text style={styles.meta}>
                ₹{f.amount ?? 0} · {f.status}
              </Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  paidBanner: {
    backgroundColor: '#dcfce7',
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  paidTitle: { fontWeight: '700', color: '#166534' },
  paidMeta: { color: '#15803d', marginTop: 4, fontSize: tokens.fontSize.sm },
  paidCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  title: { fontWeight: '700', marginBottom: 4, color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, fontSize: tokens.fontSize.sm },
});
