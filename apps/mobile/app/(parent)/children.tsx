import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchParentChildren } from '../../src/api/services';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ChildrenScreen() {
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
    <FlatList
      data={children}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const c = item as { student?: { firstName?: string; email?: string } };
        return (
          <View style={styles.card}>
            <Text style={styles.name}>{c.student?.firstName}</Text>
            <Text style={styles.email}>{c.student?.email}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12 },
  name: { fontWeight: '600' },
  email: { color: '#64748b', marginTop: 4 },
});
