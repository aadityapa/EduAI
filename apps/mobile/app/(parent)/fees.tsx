import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchFees } from '../../src/api/services';

export default function FeesScreen() {
  const { tokens } = useAuth();
  const [fees, setFees] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens) return;
    fetchFees(tokens.accessToken)
      .then(setFees)
      .finally(() => setLoading(false));
  }, [tokens]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={fees}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No fee records</Text>}
      renderItem={({ item }) => {
        const f = item as { description?: string; amount?: number; status?: string };
        return (
          <View style={styles.card}>
            <Text style={styles.title}>{f.description ?? 'Fee'}</Text>
            <Text>₹{f.amount ?? 0} · {f.status}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12 },
  title: { fontWeight: '600', marginBottom: 4 },
});
