import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchCourses } from '../../src/api/services';
import { cacheGet, cacheSet } from '../../src/auth/storage';
import { ProgressBar, StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import { Screen, tokens } from '../../src/components/ui';

interface Course {
  id: string;
  title: string;
  classLevel: number;
  subject?: { name: string };
}

export default function CoursesScreen() {
  const { tokens: authTokens } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authTokens) return;
    fetchCourses(authTokens.accessToken)
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
      <StitchScreenHeader title="Courses" actionLabel="Filter" />
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No courses available</Text>}
        renderItem={({ item, index }) => {
          const progress = [75, 42, 90, 55][index % 4];
          const accent = [tokens.colors.primaryBright, tokens.colors.secondary, tokens.colors.tertiary][index % 3];
          return (
            <StitchCard>
              <Text style={styles.title}>
                {item.subject?.name ?? 'Subject'} · Class {item.classLevel}
              </Text>
              <Text style={styles.subtitle}>{item.title}</Text>
              <ProgressBar progress={progress} color={accent} />
              <Text style={styles.pct}>{progress}% complete</Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100 },
  center: { justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: tokens.colors.textMuted, marginTop: 40 },
  title: { fontSize: tokens.fontSize.md, fontWeight: '700', color: tokens.colors.text },
  subtitle: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
  pct: { fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, marginTop: 4 },
});
