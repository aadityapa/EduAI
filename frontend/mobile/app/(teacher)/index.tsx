import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchTeacherDashboard } from '../../src/api/services';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TeacherDashboard() {
  const { tokens } = useAuth();
  const theme = useTheme();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens) return;
    fetchTeacherDashboard(tokens.accessToken)
      .then(setData)
      .finally(() => setLoading(false));
  }, [tokens]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primaryColor} />
      </View>
    );
  }

  const classes = (data?.classes as unknown[]) ?? [];

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.primaryColor }]}>Teacher Dashboard</Text>
      <Text style={styles.subtitle}>{classes.length} classes assigned</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today</Text>
        <Text style={styles.cardBody}>
          Pending assignments: {(data?.pendingAssignments as number) ?? 0}
        </Text>
        <Text style={styles.cardBody}>
          Students: {(data?.totalStudents as number) ?? 0}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  cardBody: { color: '#64748b', marginBottom: 4 },
});
