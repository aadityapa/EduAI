import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchCourses } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { useTheme } from '../../src/theme/ThemeProvider';

interface Course {
  id: string;
  title: string;
  classLevel: number;
  subject?: { name: string };
}

export default function CoursesScreen() {
  const { tokens } = useAuth();
  const theme = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens) return;
    fetchCourses(tokens.accessToken)
      .then((data) => {
        const list = data as Course[];
        setCourses(list);
        return cacheSet('courses', list);
      })
      .catch(async () => {
        const cached = await cacheGet<Course[]>('courses');
        if (cached) setCourses(cached);
      })
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
      data={courses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No courses available</Text>}
      renderItem={({ item }) => (
        <Pressable style={styles.card}>
          <Text style={[styles.title, { color: theme.primaryColor }]}>{item.title}</Text>
          <Text style={styles.meta}>
            Class {item.classLevel} · {item.subject?.name ?? 'Subject'}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#64748b', marginTop: 4, fontSize: 13 },
});
