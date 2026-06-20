import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchParentChildren } from '../../src/api/services';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ParentDashboard() {
  const { tokens } = useAuth();
  const theme = useTheme();
  const [children, setChildren] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens) return;
    fetchParentChildren(tokens.accessToken)
      .then(setChildren)
      .finally(() => setLoading(false));
  }, [tokens]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.primaryColor }]}>Parent Dashboard</Text>
      <Text style={styles.subtitle}>{children.length} linked children</Text>
      {children.map((child, i) => {
        const c = child as { student?: { firstName?: string; lastName?: string } };
        return (
          <View key={i} style={styles.card}>
            <Text style={styles.name}>
              {c.student?.firstName} {c.student?.lastName}
            </Text>
            <Text style={styles.meta}>View attendance, fees, and reports</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12 },
  name: { fontWeight: '600', fontSize: 16 },
  meta: { color: '#94a3b8', marginTop: 4, fontSize: 13 },
});
