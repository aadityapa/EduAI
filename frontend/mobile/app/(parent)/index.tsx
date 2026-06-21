import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchParentChildren } from '../../src/api/services';
import { MetricChip, MobileHeader, StitchCard } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function ParentDashboard() {
  const { tokens: authTokens } = useAuth();
  const [children, setChildren] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchParentChildren(authTokens.accessToken)
      .then(setChildren)
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
      <MobileHeader title="Parent Portal" subtitle={`${children.length} linked children`} />
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.metricRow}>
          <MetricChip icon="✓" value="95%" label="Attendance" accent={tokens.colors.primaryBright} />
          <MetricChip icon="₹" value="Paid" label="Fees" accent={tokens.colors.tertiary} />
        </View>
        {children.map((child, i) => {
          const c = child as { student?: { firstName?: string; lastName?: string } };
          return (
            <StitchCard key={i}>
              <Text style={styles.name}>
                {c.student?.firstName} {c.student?.lastName}
              </Text>
              <Text style={styles.meta}>Class linked · View attendance, fees, and reports</Text>
            </StitchCard>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  center: { justifyContent: 'center', alignItems: 'center' },
  metricRow: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  name: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
});
