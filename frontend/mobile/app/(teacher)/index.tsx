import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchTeacherDashboard } from '../../src/api/services';
import { MobileHeader, StitchCard } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

export default function TeacherDashboard() {
  const { tokens: authTokens } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchTeacherDashboard(authTokens.accessToken)
      .then(setData)
      .finally(() => setLoading(false));
  }, [authTokens]);

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator color={tokens.colors.primaryBright} />
      </Screen>
    );
  }

  const classes = (data?.classes as unknown[]) ?? [];

  return (
    <Screen>
      <MobileHeader title="Teacher Portal" subtitle={`${classes.length} classes assigned`} />
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.aiPromo}>
          <Text style={styles.aiPromoTitle}>AI Question Generator</Text>
          <Text style={styles.aiPromoBody}>Create quizzes in seconds</Text>
        </View>
        <StitchCard>
          <Text style={styles.cardLabel}>TODAY&apos;S SCHEDULE</Text>
          <Text style={styles.cardTitle}>Grade 8 Science · 10:00 AM</Text>
          <Text style={styles.cardBody}>
            Pending assignments: {(data?.pendingAssignments as number) ?? 0}
          </Text>
          <Text style={styles.cardBody}>Students: {(data?.totalStudents as number) ?? 0}</Text>
        </StitchCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  center: { justifyContent: 'center', alignItems: 'center' },
  aiPromo: {
    backgroundColor: tokens.colors.tertiary + '18',
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.tertiary + '33',
    marginBottom: tokens.spacing.md,
  },
  aiPromoTitle: { fontWeight: '700', color: tokens.colors.tertiary, fontSize: tokens.fontSize.md },
  aiPromoBody: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
  cardLabel: {
    fontSize: tokens.fontSize.xs,
    color: tokens.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: { fontWeight: '700', fontSize: tokens.fontSize.md, color: tokens.colors.text, marginBottom: 8 },
  cardBody: { color: tokens.colors.textMuted, marginBottom: 4, fontSize: tokens.fontSize.sm },
});
